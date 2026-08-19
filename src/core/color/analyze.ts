import { hueDiff, normalizeHue, rgbToLab, rgbToOklch } from "./convert";
import { contrastRatio } from "./contrast";
import { deltaE2000 } from "./difference";
import { simulateCvd } from "./cvd";
import { warmCoolOf, type WarmCool } from "./perception";
import { ACHROMATIC_CHROMA } from "./stats";
import type { CvdType, RGB } from "./types";

/**
 * パレット分析系の純関数（docs/04 E/F/G の検証カード向け）。
 */

export type IndexPair = { i: number; j: number; value: number };

/** 全ペアの ΔE00 が閾値未満の「紛らわしい」組（冗長性検出）。 */
export function confusablePairs(rgbs: RGB[], threshold: number): IndexPair[] {
  const labs = rgbs.map(rgbToLab);
  const out: IndexPair[] = [];
  for (let i = 0; i < labs.length; i++) {
    for (let j = i + 1; j < labs.length; j++) {
      const de = deltaE2000(labs[i], labs[j]);
      if (de < threshold) out.push({ i, j, value: de });
    }
  }
  return out.sort((a, b) => a.value - b.value);
}

/** 色覚型ごとの紛らわしいペア（シミュレーション後の ΔE00 < threshold）。 */
export function cvdConfusablePairs(
  rgbs: RGB[],
  type: CvdType,
  threshold: number,
): IndexPair[] {
  return confusablePairs(
    rgbs.map((c) => simulateCvd(c, type, 1)),
    threshold,
  );
}

/** 暖寒バランス（分類と比率）。 */
export function warmCoolBalance(rgbs: RGB[]): {
  kinds: WarmCool[];
  warm: number;
  cool: number;
  neutral: number;
} {
  const kinds = rgbs.map(warmCoolOf);
  const count = (k: WarmCool) => kinds.filter((x) => x === k).length;
  return {
    kinds,
    warm: count("warm"),
    cool: count("cool"),
    neutral: count("neutral"),
  };
}

export type RoleCheck = {
  key: "background" | "text" | "accent" | "surface";
  ok: boolean;
  /** 該当した色の index（無ければ -1） */
  index: number;
};

/**
 * 役割カバレッジ（背景/テキスト/強調/中間面が揃うかのヒューリスティック）。
 * 背景=最も明るい(または暗い)色、テキスト=背景に AA(4.5)以上、
 * 強調=十分な彩度(OKLCH C≥0.11)、中間面=背景ともテキストとも異なる中間明度。
 */
export function rolesCoverage(rgbs: RGB[]): RoleCheck[] {
  if (rgbs.length === 0) {
    return (["background", "text", "accent", "surface"] as const).map(
      (key) => ({ key, ok: false, index: -1 }),
    );
  }
  const ls = rgbs.map((c) => rgbToOklch(c).l);
  const cs = rgbs.map((c) => rgbToOklch(c).c);

  // 背景候補 = 明度が最も端に寄っている色
  const bgIndex = ls.reduce(
    (best, l, i) => (Math.abs(l - 0.5) > Math.abs(ls[best] - 0.5) ? i : best),
    0,
  );
  const bgOk = ls[bgIndex] >= 0.85 || ls[bgIndex] <= 0.25;

  let textIndex = -1;
  let bestRatio = 0;
  rgbs.forEach((c, i) => {
    if (i === bgIndex) return;
    const ratio = contrastRatio(c, rgbs[bgIndex]);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      textIndex = i;
    }
  });
  const textOk = bestRatio >= 4.5;

  const accentIndex = cs.reduce((best, c, i) => (c > cs[best] ? i : best), 0);
  const accentOk = cs[accentIndex] >= 0.11;

  const surfaceIndex = rgbs.findIndex(
    (_, i) =>
      i !== bgIndex &&
      i !== textIndex &&
      Math.abs(ls[i] - ls[bgIndex]) > 0.05 &&
      Math.abs(ls[i] - (textIndex >= 0 ? ls[textIndex] : -1)) > 0.05,
  );

  return [
    { key: "background", ok: bgOk, index: bgIndex },
    { key: "text", ok: textOk, index: textIndex },
    { key: "accent", ok: accentOk, index: accentIndex },
    { key: "surface", ok: surfaceIndex >= 0, index: surfaceIndex },
  ];
}

export type SchemeMatch = {
  ruleId: string;
  /** 0–100。100 = オフセットパターンに完全一致 */
  score: number;
};

/**
 * 調和スキーム判定。パレットの有彩色の色相（OKLCH）を各ルールの
 * 色相オフセットパターンと突き合わせ、最も合致するルールとスコアを返す。
 *
 * 偏差は双方向で測る:
 *  - 各パレット色 → 最寄りターゲットの平均偏差（パターンからの外れ）
 *  - 各ターゲット → 最寄りパレット色の平均偏差（未使用ターゲットのペナルティ）
 * 片方向（前者のみ）だと、全色が base 近傍に固まっていても complementary の
 * 0° 側だけで偏差ゼロになり score 100 の偽陽性が出る。
 * スコア = 100 − 平均色相偏差（度）× 2（0 でクランプ）。
 */
export function matchScheme(
  rgbs: RGB[],
  rules: { id: string; hueOffsets: number[] }[],
): SchemeMatch | null {
  const hues = rgbs
    .map((c) => rgbToOklch(c))
    .filter((o) => o.c >= ACHROMATIC_CHROMA)
    .map((o) => o.h);
  if (hues.length < 2 || rules.length === 0) return null;

  const meanNearest = (from: number[], to: number[]) =>
    from.reduce(
      (sum, a) => sum + Math.min(...to.map((b) => hueDiff(a, b))),
      0,
    ) / from.length;

  let best: SchemeMatch | null = null;
  for (const rule of rules) {
    // 各色を基準色と仮定して最良の合致を探す
    for (const base of hues) {
      const targets = rule.hueOffsets.map((o) => normalizeHue(base + o));
      const dev = (meanNearest(hues, targets) + meanNearest(targets, hues)) / 2;
      const score = Math.max(0, Math.round(100 - dev * 2));
      if (!best || score > best.score) best = { ruleId: rule.id, score };
    }
  }
  return best;
}
