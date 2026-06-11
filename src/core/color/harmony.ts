import { rgbToOklch, oklchToRgb } from "./convert";
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

/** トーン段階（MUI 等のカラーパレット流儀。500 が基準色）。 */
export const TONE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;
export type ToneStep = (typeof TONE_STEPS)[number];
export type Tone = { step: ToneStep; rgb: RGB };

// 50 / 900 の目標明度（OKLCH L）。基準色がこれより明るい/暗い場合は
// その側を基準色の明度で頭打ちにし、階調の単調性を保つ。
const TONE_L_LIGHT = 0.97;
const TONE_L_DARK = 0.25;

/**
 * トーン展開（docs/04 H）。基準色を 500 に据え、OKLCH の明度を
 * 50（最明）〜900（最暗）へ補間する。淡い側は彩度も絞って白へ寄せ、
 * sRGB 域外は色相を保ったままガマットマッピングされる（oklchToRgb）。
 */
export function generateTones(base: RGB): Tone[] {
  const { l, c, h } = rgbToOklch(base);
  const lightMax = Math.max(TONE_L_LIGHT, l);
  const darkMin = Math.min(TONE_L_DARK, l);

  return TONE_STEPS.map((step) => {
    if (step === 500) return { step, rgb: base }; // 基準色はそのまま
    if (step < 500) {
      // 50 は命名上の半段（450/450=1.0）。100→0.889 … 400→0.222
      const t = (500 - step) / 450;
      return {
        step,
        rgb: oklchToRgb({
          l: l + (lightMax - l) * t,
          c: c * (1 - 0.75 * t),
          h,
        }),
      };
    }
    const t = (step - 500) / 400; // 600→0.25 … 900→1.0
    return {
      step,
      rgb: oklchToRgb({ l: l - (l - darkMin) * t, c: c * (1 - 0.25 * t), h }),
    };
  });
}
