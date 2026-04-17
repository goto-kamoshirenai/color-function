import { hexToRgb } from "./colorUtils";
import { getLuminance } from "./relativeLuminance";

// コントラスト比の計算
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

export type ContrastLevel = "不適合" | "AA(適合)" | "AAA(適合)";

// WCAGレベルの判定
export const getWCAGLevel = (
  ratio: number,
  isLargeText: boolean = false
): ContrastLevel => {
  const aaaThreshold = isLargeText ? 4.5 : 7.0;
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  if (ratio >= aaaThreshold) return "AAA(適合)";
  if (ratio >= aaThreshold) return "AA(適合)";
  return "不適合";
};

// コントラスト比のフォーマット
export const formatContrastRatio = (ratio: number): string => {
  return ratio.toFixed(2) + "：1";
};
