import { rgbToOklch, oklchToRgb, rgbToHsv, hsvToRgb } from "./convert";
import type { RGB } from "./types";

/**
 * OKLCH の色相を deltaDeg 回転（知覚均等, docs/06 §4.1）。
 * 明度・彩度は保つ。結果は sRGB ガマットにクランプ。
 */
export function rotateHueOklch(rgb: RGB, deltaDeg: number): RGB {
  const o = rgbToOklch(rgb);
  const h = (((o.h + deltaDeg) % 360) + 360) % 360;
  return oklchToRgb({ l: o.l, c: o.c, h });
}

/**
 * 調和スキーム生成。基準色の色相を各オフセット回転して配色候補を返す
 * （補色=[0,180] / 類似=[-30,0,30] 等。docs/06 §4.1 / docs/04 G）。
 */
export function generateScheme(base: RGB, hueOffsets: number[]): RGB[] {
  return hueOffsets.map((d) => rotateHueOklch(base, d));
}

/**
 * トーン展開。基準色の色相・彩度を保ち明度（HSV V）だけを段階変化（docs/04 H / mock）。
 */
export function generateTones(
  base: RGB,
  values: number[] = [22, 38, 54, 70, 86],
): RGB[] {
  const { h, s } = rgbToHsv(base);
  return values.map((v) => hsvToRgb({ h, s, v }));
}
