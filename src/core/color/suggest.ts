import { normalizeHue, rgbToLab, rgbToOklch, oklchToRgb } from "./convert";
import { ACHROMATIC_CHROMA } from "./stats";
import { bestByLightness, nearestByLightness } from "./search";
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
 *
 * 動かすのは OKLCH の明度のみ（色相・彩度は保つ）。明度では届かず彩度を
 * 落とさないと届かない色は reached=false になる。
 */
export function nudgeForContrast(
  fg: RGB,
  bg: RGB,
  target: number,
): { rgb: RGB; ratio: number; reached: boolean } | null {
  if (contrastRatio(fg, bg) >= target) return null;

  const found = nearestByLightness(fg, (c) => contrastRatio(c, bg) >= target);
  if (found)
    return {
      rgb: found.rgb,
      ratio: contrastRatio(found.rgb, bg),
      reached: true,
    };

  const best = bestByLightness(fg, (c) => contrastRatio(c, bg));
  return { rgb: best.rgb, ratio: best.value, reached: false };
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
  const score = (c: RGB) => Math.min(...others.map((x) => minCvdDelta(c, x)));

  const current = score(color);
  if (current >= threshold)
    return { rgb: color, minDelta: current, reached: true };

  // ΔE の最小値は明度に対して単調でないため、粗い刻みで成立点を見つけてから
  // 直前の不成立点との間を二分する（nearestByLightness が担う）。
  const found = nearestByLightness(color, (c) => score(c) >= threshold, {
    step: 0.025,
    refine: 10,
  });
  if (found)
    return { rgb: found.rgb, minDelta: score(found.rgb), reached: true };

  const best = bestByLightness(color, score, { step: 0.025 });
  return { rgb: best.rgb, minDelta: best.value, reached: false };
}

/**
 * 不足色の補完提案: 有彩色の色相環上で最も広い隙間の中央に、
 * パレットの中央値的な明度・彩度を持つ色を提案する。
 */
export function suggestGapFill(rgbs: RGB[]): RGB | null {
  const chroma = rgbs.map(rgbToOklch).filter((o) => o.c >= ACHROMATIC_CHROMA);
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
  const h = normalizeHue(gapStart + gapSize / 2);
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
    const ca = os[a].c >= ACHROMATIC_CHROMA;
    const cb = os[b].c >= ACHROMATIC_CHROMA;
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
 * primary=残りで最高彩度 / accent=その次 /
 * neutral=残り（background・text を除く）の中で最も低彩度。
 * ※ neutral はパレット全体の最低彩度ではない（background/text が
 *   低彩度でも役割を兼任させないため、残りの中から選ぶ）。
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

/** 位置順ロール割当の並び（n 番目の色 → ROLE_ORDER[n]）。 */
const ROLE_ORDER: SemanticRole[] = [
  "background",
  "text",
  "primary",
  "accent",
  "neutral",
];

/**
 * 位置順のロール割当: パレットの並び順だけで決定的にロールを割り当てる。
 * 1 番目=background / 2=text / 3=primary / 4=accent / 5=neutral。
 * FG/BG・アクセント指定（ペアモード等の選択状態）には一切依存しない
 * — ペア用の設定を他モード（UI モック等）へ波及させないため。
 * ヒューリスティックな {@link assignRoles} と異なり並び順のみで決まる。
 */
export function rolesByOrder(
  count: number,
): { role: SemanticRole; index: number }[] {
  const n = Math.min(count, ROLE_ORDER.length);
  return Array.from({ length: n }, (_, i) => ({
    role: ROLE_ORDER[i],
    index: i,
  }));
}
