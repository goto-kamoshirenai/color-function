import { interpolate, formatHex } from "culori";
import { parseHex, toHex } from "./convert";
import type { RGB } from "./types";

/** 合成モード（CSS の mix-blend-mode サブセット＋単純平均）。 */
export const BLEND_MODES = ["normal", "multiply", "screen", "overlay"] as const;
export type BlendMode = (typeof BLEND_MODES)[number];

function blendChannel(mode: BlendMode, a: number, b: number): number {
  switch (mode) {
    case "normal":
      return (a + b) / 2; // 50/50 平均
    case "multiply":
      return a * b;
    case "screen":
      return 1 - (1 - a) * (1 - b);
    case "overlay":
      return a <= 0.5 ? 2 * a * b : 1 - 2 * (1 - a) * (1 - b);
  }
}

/** 2色の合成（前景 a × 背景 b、ガンマ空間チャンネル演算）。 */
export function mixColors(a: RGB, b: RGB, mode: BlendMode): RGB {
  return {
    r: blendChannel(mode, a.r / 255, b.r / 255) * 255,
    g: blendChannel(mode, a.g / 255, b.g / 255) * 255,
    b: blendChannel(mode, a.b / 255, b.b / 255) * 255,
  };
}

/** グラデーションの補間色空間。 */
export const GRADIENT_SPACES = ["rgb", "oklab", "hsv"] as const;
export type GradientSpace = (typeof GRADIENT_SPACES)[number];

/** 2色間の補間ステップ列（端点を含む steps 色）。 */
export function gradientSteps(
  fromHex: string,
  toHex_: string,
  space: GradientSpace,
  steps: number,
): string[] {
  const f = interpolate([fromHex, toHex_], space);
  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1);
    return formatHex(f(t)).toUpperCase();
  });
}

/** Web セーフカラー（216色）への最近傍丸め。 */
export function toWebSafe(rgb: RGB): RGB {
  const q = (v: number) => Math.round(v / 51) * 51;
  return { r: q(rgb.r), g: q(rgb.g), b: q(rgb.b) };
}

/** Web セーフ判定。 */
export function isWebSafe(hex: string): boolean {
  const rgb = parseHex(hex);
  if (!rgb) return false;
  return toHex(toWebSafe(rgb)).toUpperCase() === hex.toUpperCase();
}
