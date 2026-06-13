import { rgbToLab, rgbToOklch, oklchToRgb } from "./convert";
import { contrastRatio } from "./contrast";
import { deltaE2000 } from "./difference";
import { simulateCvd } from "./cvd";
import type { CvdType, RGB } from "./types";

/**
 * 設計支援系の純関数（docs/04 C/E/H の設計カード向け）。
 * いずれも OKLCH の明度操作を基本にし、色相・彩度はなるべく保つ。
 */

const CVD_TYPES: CvdType[] = ["protan", "deutan", "tritan"];

/**
 * アクセシブル化ナッジ: fg の明度を調整して bg とのコントラスト比が
 * target 以上になる最寄り色を返す。元々満たしている場合は null。
 * どう調整しても届かない場合は最良値を返す（reached=false）。
 */
export function nudgeForContrast(
  fg: RGB,
  bg: RGB,
  target: number,
): { rgb: RGB; ratio: number; reached: boolean } | null {
  if (contrastRatio(fg, bg) >= target) return null;
  const o = rgbToOklch(fg);
  let best = fg;
  let bestRatio = contrastRatio(fg, bg);

  // 明るい方向・暗い方向の両方を試し、先に届いた方（=最寄り）を採用
  for (let i = 1; i <= 50; i++) {
    for (const dir of [-1, 1]) {
      const l = Math.min(1, Math.max(0, o.l + dir * 0.02 * i));
      const cand = oklchToRgb({ l, c: o.c, h: o.h });
      const ratio = contrastRatio(cand, bg);
      if (ratio >= target) return { rgb: cand, ratio, reached: true };
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = cand;
      }
    }
  }
  return { rgb: best, ratio: bestRatio, reached: false };
}

/** 全色覚型でのシミュレーション後 ΔE00 の最小値。 */
function minCvdDelta(a: RGB, b: RGB): number {
  return Math.min(
    ...CVD_TYPES.map((t) =>
      deltaE2000(
        rgbToLab(simulateCvd(a, t, 1)),
        rgbToLab(simulateCvd(b, t, 1)),
      ),
    ),
  );
}

/**
 * 色覚セーフ提案: color を明度方向に調整し、others のどの色とも
 * 全色覚型で ΔE00 ≥ threshold となる最寄り色を探す。
 * 見つからなければ最も改善する候補を返す（reached=false）。
 */
export function suggestCvdSafe(
  color: RGB,
  others: RGB[],
  threshold: number,
): { rgb: RGB; minDelta: number; reached: boolean } {
  const o = rgbToOklch(color);
  const score = (c: RGB) => Math.min(...others.map((x) => minCvdDelta(c, x)));

  let best = color;
  let bestScore = score(color);
  if (bestScore >= threshold)
    return { rgb: color, minDelta: bestScore, reached: true };

  for (let i = 1; i <= 40; i++) {
    for (const dir of [-1, 1]) {
      const l = Math.min(1, Math.max(0, o.l + dir * 0.025 * i));
      const cand = oklchToRgb({ l, c: o.c, h: o.h });
      const s = score(cand);
      if (s >= threshold) return { rgb: cand, minDelta: s, reached: true };
      if (s > bestScore) {
        bestScore = s;
        best = cand;
      }
    }
  }
  return { rgb: best, minDelta: bestScore, reached: false };
}

/**
 * 不足色の補完提案: 有彩色の色相環上で最も広い隙間の中央に、
 * パレットの中央値的な明度・彩度を持つ色を提案する。
 */
export function suggestGapFill(rgbs: RGB[]): RGB | null {
  const chroma = rgbs.map(rgbToOklch).filter((o) => o.c >= 0.03);
  if (chroma.length < 2) return null;
  const hues = chroma.map((o) => o.h).sort((a, b) => a - b);

  let gapStart = hues[hues.length - 1];
  let gapSize = hues[0] + 360 - gapStart;
  for (let i = 0; i < hues.length - 1; i++) {
    const size = hues[i + 1] - hues[i];
    if (size > gapSize) {
      gapSize = size;
      gapStart = hues[i];
    }
  }
  const h = (gapStart + gapSize / 2) % 360;
  const med = (xs: number[]) =>
    xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  return oklchToRgb({
    l: med(chroma.map((o) => o.l)),
    c: med(chroma.map((o) => o.c)),
    h,
  });
}

/** ダーク/ライト変換: OKLCH の明度を反転（色相・彩度は概ね維持）。 */
export function invertLightness(rgb: RGB): RGB {
  const o = rgbToOklch(rgb);
  const l = Math.min(0.97, Math.max(0.12, 1.06 - o.l));
  return oklchToRgb({ l, c: o.c * 0.96, h: o.h });
}

export type SortKey = "hue" | "lightness";

/** 並べ替え順（index 列）。hue=有彩色を色相順・無彩色は末尾、lightness=明→暗。 */
export function sortOrder(rgbs: RGB[], key: SortKey): number[] {
  const os = rgbs.map(rgbToOklch);
  const idx = rgbs.map((_, i) => i);
  if (key === "lightness") {
    return idx.sort((a, b) => os[b].l - os[a].l);
  }
  return idx.sort((a, b) => {
    const ca = os[a].c >= 0.03;
    const cb = os[b].c >= 0.03;
    if (ca !== cb) return ca ? -1 : 1; // 無彩色は末尾
    if (!ca) return os[b].l - os[a].l;
    return os[a].h - os[b].h;
  });
}

/** 明度ステップ均等化: 現在の明度順を保ったまま L を等間隔に再配置。 */
export function equalizeLightness(rgbs: RGB[]): RGB[] {
  if (rgbs.length < 3) return rgbs;
  const os = rgbs.map(rgbToOklch);
  const rank = rgbs.map((_, i) => i).sort((a, b) => os[a].l - os[b].l);
  const lMin = os[rank[0]].l;
  const lMax = os[rank[rank.length - 1]].l;
  const out: RGB[] = new Array(rgbs.length);
  rank.forEach((origIndex, r) => {
    const l = lMin + ((lMax - lMin) * r) / (rank.length - 1);
    out[origIndex] = oklchToRgb({ l, c: os[origIndex].c, h: os[origIndex].h });
  });
  return out;
}

export type SemanticRole =
  | "background"
  | "text"
  | "primary"
  | "accent"
  | "neutral";

/**
 * セマンティックロール割当（ヒューリスティック）:
 * background=明度が最も端の色 / text=背景に最も高コントラスト /
 * primary=残りで最高彩度 / accent=その次 / neutral=最も低彩度。
 */
export function assignRoles(
  rgbs: RGB[],
): { role: SemanticRole; index: number }[] {
  if (rgbs.length === 0) return [];
  const os = rgbs.map(rgbToOklch);
  const taken = new Set<number>();
  const out: { role: SemanticRole; index: number }[] = [];

  const bg = os.reduce(
    (best, o, i) =>
      Math.abs(o.l - 0.5) > Math.abs(os[best].l - 0.5) ? i : best,
    0,
  );
  taken.add(bg);
  out.push({ role: "background", index: bg });

  let text = -1;
  let bestRatio = 0;
  rgbs.forEach((c, i) => {
    if (taken.has(i)) return;
    const ratio = contrastRatio(c, rgbs[bg]);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      text = i;
    }
  });
  if (text >= 0) {
    taken.add(text);
    out.push({ role: "text", index: text });
  }

  const byChroma = rgbs
    .map((_, i) => i)
    .filter((i) => !taken.has(i))
    .sort((a, b) => os[b].c - os[a].c);
  if (byChroma[0] !== undefined)
    out.push({ role: "primary", index: byChroma[0] });
  if (byChroma[1] !== undefined)
    out.push({ role: "accent", index: byChroma[1] });
  const last = byChroma[byChroma.length - 1];
  if (byChroma.length > 2 && last !== undefined)
    out.push({ role: "neutral", index: last });
  return out;
}

/**
 * 順番ベースのロール割当: パレットの並び順とユーザー指定の FG / BG / アクセントから
 * 決定的にロールを割り当てる。ヒューリスティックな {@link assignRoles} と異なり、
 * ユーザーが DnD・FG/BG 指定で完全に制御できる（docs/05 §3 palette は順序つきの真実の源）。
 *
 * background = BG 指定 / text = FG 指定 / accent = アクセント指定 /
 * primary = 残りの先頭 / neutral = 残りの末尾。
 * 無効な index は既定（bg = 末尾・fg = 先頭）にフォールバックする。
 */
export function rolesByOrder(
  count: number,
  opts: { fgIndex: number; bgIndex: number; accentIndex?: number },
): { role: SemanticRole; index: number }[] {
  if (count === 0) return [];
  const valid = (i: number | undefined): i is number =>
    i !== undefined && i >= 0 && i < count;
  const out: { role: SemanticRole; index: number }[] = [];
  const taken = new Set<number>();
  const claim = (role: SemanticRole, i: number | undefined): void => {
    if (valid(i) && !taken.has(i)) {
      taken.add(i);
      out.push({ role, index: i });
    }
  };
  claim("background", valid(opts.bgIndex) ? opts.bgIndex : count - 1);
  claim("text", valid(opts.fgIndex) ? opts.fgIndex : 0);
  claim("accent", opts.accentIndex);
  const rest = Array.from({ length: count }, (_, i) => i).filter(
    (i) => !taken.has(i),
  );
  if (rest.length > 0) claim("primary", rest[0]);
  if (rest.length > 1) claim("neutral", rest[rest.length - 1]);
  return out;
}
