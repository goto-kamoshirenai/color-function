import { linearToSrgb } from "./convert";
import { rgbToXyz, xyzToXy, rgbToHsv } from "./convert";
import { relativeLuminance } from "./contrast";
import type { RGB } from "./types";

/**
 * 知覚明度（HSP: Highly Sensitive Perceived brightness, Darel Rex Finley 2006）。
 * 0–1。ガンマ空間の重み付き二乗平均で「感じる明るさ」を近似する。
 */
export function hspBrightness({ r, g, b }: RGB): number {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  return Math.sqrt(0.299 * R * R + 0.587 * G * G + 0.114 * B * B);
}

/**
 * 相関色温度の近似（McCamy 1992, CIE 1931 xy から）。単位 K。
 * 黒体軌跡から遠い色（高彩度の緑・マゼンタ等）では参考値にとどまる。
 */
export function correlatedColorTemp(rgb: RGB): number {
  const { x, y } = xyzToXy(rgbToXyz(rgb));
  const n = (x - 0.332) / (0.1858 - y);
  return 449 * n ** 3 + 3525 * n ** 2 + 6823.3 * n + 5520.33;
}

export type WarmCool = "warm" | "cool" | "neutral";

/** 暖色/寒色/中立の分類（HSV 色相・低彩度は中立）。 */
export function warmCoolOf(rgb: RGB): WarmCool {
  const { h, s } = rgbToHsv(rgb);
  if (s < 12) return "neutral";
  return h < 70 || h >= 330 ? "warm" : "cool";
}

/** 知覚グレースケール等価色（WCAG 相対輝度を保ったグレー）。 */
export function grayscaleOf(rgb: RGB): RGB {
  const v = linearToSrgb(relativeLuminance(rgb)) * 255;
  return { r: v, g: v, b: v };
}
