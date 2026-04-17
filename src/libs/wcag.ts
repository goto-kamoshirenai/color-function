import { hexToRgb } from "./colorUtils";

// 相対輝度の計算
const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

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
