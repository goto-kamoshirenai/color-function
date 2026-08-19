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

/** CIE 1931 xy → CIE 1960 UCS uv（Δuv の算出用）。 */
function xyToUv(x: number, y: number): { u: number; v: number } {
  const d = -2 * x + 12 * y + 3;
  return { u: (4 * x) / d, v: (6 * y) / d };
}

/**
 * 黒体軌跡上の xy 座標の近似（Kim et al. 1667–25000K）。
 * Δuv（軌跡からの距離）を測るためだけに使う。
 */
function planckianXy(t: number): { x: number; y: number } {
  const x =
    t <= 4000
      ? -0.2661239e9 / t ** 3 - 0.2343589e6 / t ** 2 + 0.8776956e3 / t + 0.17991
      : -3.0258469e9 / t ** 3 +
        2.1070379e6 / t ** 2 +
        0.2226347e3 / t +
        0.24039;
  const y =
    t <= 2222
      ? -1.1063814 * x ** 3 - 1.3481102 * x ** 2 + 2.18555832 * x - 0.20219683
      : t <= 4000
        ? -0.9549476 * x ** 3 -
          1.37418593 * x ** 2 +
          2.09137015 * x -
          0.16748867
        : 3.081758 * x ** 3 - 5.8733867 * x ** 2 + 3.75112997 * x - 0.37001483;
  return { x, y };
}

/** McCamy 近似が妥当と見なせる Δuv（黒体軌跡からの距離）の上限。 */
const DUV_LIMIT = 0.05;

/**
 * 相関色温度の近似（McCamy 1992, CIE 1931 xy から）。単位 K。
 *
 * 妥当域を外れる入力には `null` を返す（「黒の色温度 6500K」のような
 * 無意味な値を出さないため。docs/07 §1「無彩色は色相不定」と同じ趣旨）:
 *  - 純黒など色度が定義できない色（XYZ の総和が 0）
 *  - 近似の適用範囲（1000–25000K）外
 *  - 黒体軌跡から離れた色（Δuv > 0.05。高彩度の緑・マゼンタ等）
 */
export function correlatedColorTemp(rgb: RGB): number | null {
  const xyz = rgbToXyz(rgb);
  if (xyz.x + xyz.y + xyz.z <= 0) return null;

  const { x, y } = xyzToXy(xyz);
  const n = (x - 0.332) / (0.1858 - y);
  const cct = 449 * n ** 3 + 3525 * n ** 2 + 6823.3 * n + 5520.33;
  if (!Number.isFinite(cct) || cct < 1000 || cct > 25000) return null;

  const a = xyToUv(x, y);
  const locus = planckianXy(cct);
  const b = xyToUv(locus.x, locus.y);
  if (Math.hypot(a.u - b.u, a.v - b.v) > DUV_LIMIT) return null;

  return cct;
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
