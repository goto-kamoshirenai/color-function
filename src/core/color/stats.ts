import { rgbToHsv } from "./convert";
import type { RGB } from "./types";

/**
 * パレット各色の色相（0–360）の配列（docs/04 F・色相分布カード）。
 */
export function hueDistribution(palette: RGB[]): number[] {
  return palette.map((rgb) => rgbToHsv(rgb).h);
}

/**
 * 色相ヒストグラムの Shannon エントロピー（bit, docs/04 F）。
 * 単色・空は 0、色相が散るほど大きい。
 */
export function paletteEntropy(palette: RGB[], bins = 12): number {
  if (palette.length === 0) return 0;
  const hist = new Array<number>(bins).fill(0);
  for (const h of hueDistribution(palette)) {
    const idx = Math.min(bins - 1, Math.floor((h / 360) * bins));
    hist[idx] += 1;
  }
  const n = palette.length;
  let entropy = 0;
  for (const count of hist) {
    if (count === 0) continue;
    const p = count / n;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}
