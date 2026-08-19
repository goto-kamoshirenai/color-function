import { rgbToHsv, rgbToOklch } from "./convert";
import type { RGB } from "./types";

/**
 * 無彩色と見なす彩度（OKLCH C）の下限。
 * suggestGapFill / sortOrder / matchScheme と同じ閾値を使い、
 * 「どこから色相を持つ色として扱うか」の判断を一貫させる。
 */
export const ACHROMATIC_CHROMA = 0.03;

/** 無彩色（色相が定義できない色）か。 */
export function isAchromatic(rgb: RGB): boolean {
  return rgbToOklch(rgb).c < ACHROMATIC_CHROMA;
}

/**
 * パレット各色の色相（0–360）の配列（docs/04 F・色相分布カード）。
 * 無彩色（グレー・白・黒）は色相が定義できないため `null`（docs/07 §1）。
 * 色相値は HSV 由来（カードの sRGB 色相帯と目盛りが一致する）。
 */
export function hueDistribution(palette: RGB[]): (number | null)[] {
  return palette.map((rgb) => (isAchromatic(rgb) ? null : rgbToHsv(rgb).h));
}

/**
 * 色相ヒストグラムの Shannon エントロピー（bit, docs/04 F）。
 * 有彩色のみを対象にする（無彩色を色相0°=赤ビンに集計すると分布が歪む）。
 * 単色・空・無彩色のみは 0、色相が散るほど大きい。
 */
export function paletteEntropy(palette: RGB[], bins = 12): number {
  const hues = hueDistribution(palette).filter((h): h is number => h !== null);
  if (hues.length === 0) return 0;
  const hist = new Array<number>(bins).fill(0);
  for (const h of hues) {
    const idx = Math.min(bins - 1, Math.floor((h / 360) * bins));
    hist[idx] += 1;
  }
  let entropy = 0;
  for (const count of hist) {
    if (count === 0) continue;
    const p = count / hues.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}
