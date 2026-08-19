import { interpolate, formatHex } from "culori";
import { normalizeRgb, parseHex, toHex } from "./convert";
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

/**
 * 2色の合成（前景 a × 背景 b）。
 *
 * チャンネル演算はガンマ空間（sRGB のまま）で行う。これは CSS の
 * mix-blend-mode / Photoshop 等の実装に一致させるためで、知覚的に正確な
 * 混色ではない（線形 RGB や OKLab での混色とは結果が異なる）。
 * 補間（gradientSteps）は線形/OKLab を選べるが、こちらは CSS 互換が目的。
 */
export function mixColors(a: RGB, b: RGB, mode: BlendMode): RGB {
  const x = normalizeRgb(a);
  const y = normalizeRgb(b);
  return {
    r: blendChannel(mode, x.r / 255, y.r / 255) * 255,
    g: blendChannel(mode, x.g / 255, y.g / 255) * 255,
    b: blendChannel(mode, x.b / 255, y.b / 255) * 255,
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
export function toWebSafe(input: RGB): RGB {
  const rgb = normalizeRgb(input);
  const q = (v: number) => Math.round(v / 51) * 51;
  return { r: q(rgb.r), g: q(rgb.g), b: q(rgb.b) };
}

/** Web セーフ判定。 */
export function isWebSafe(hex: string): boolean {
  const rgb = parseHex(hex);
  if (!rgb) return false;
  return toHex(toWebSafe(rgb)).toUpperCase() === hex.toUpperCase();
}
