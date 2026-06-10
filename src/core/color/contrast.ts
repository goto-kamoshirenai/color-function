import { srgbToLinear } from "./convert";
import type { RGB } from "./types";

/**
 * WCAG 相対輝度 Y（docs/07 §5）。係数は計算定数（アセットではない）。
 */
export function relativeLuminance({ r, g, b }: RGB): number {
  const R = srgbToLinear(r / 255);
  const G = srgbToLinear(g / 255);
  const B = srgbToLinear(b / 255);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** WCAG コントラスト比（1–21, docs/07 §6）。 */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

export type WcagVerdict = {
  aaNormal: boolean;
  aaaNormal: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
  /** UI部品・グラフィック（3:1） */
  ui: boolean;
  verdict: "AAA" | "AA" | "AA-large" | "fail";
};

/**
 * WCAG 2.1 のレベル判定（docs/07 §6 / docs/06 §3）。
 * 閾値は WCAG 2.1 SC 1.4.3/1.4.6/1.4.11 の事実値。判定は丸め前の ratio で行うこと。
 */
export function judgeWcag(ratio: number): WcagVerdict {
  const verdict: WcagVerdict["verdict"] =
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA-large" : "fail";
  return {
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
    ui: ratio >= 3,
    verdict,
  };
}
