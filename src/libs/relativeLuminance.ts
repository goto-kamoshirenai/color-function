import { hexToRgb } from "./colorUtils";

/**
 * 色の相対輝度を計算する
 * WCAG 2.0の定義に基づく計算方法
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export const calculateRelativeLuminance = (color: string): number => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  return getLuminance(rgb.r, rgb.g, rgb.b);
};

/**
 * RGB値から相対輝度を計算する
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * 相対輝度の値を見やすい形式にフォーマットする
 */
export const formatLuminance = (luminance: number): string => {
  return luminance.toFixed(3);
};

/**
 * 相対輝度の値に基づいて明るさのレベルを判定する
 */
export const getLuminanceLevel = (luminance: number): string => {
  if (luminance >= 0.8) return "非常に明るい";
  if (luminance >= 0.6) return "明るい";
  if (luminance >= 0.4) return "中程度";
  if (luminance >= 0.2) return "暗い";
  return "非常に暗い";
};

/**
 * 相対輝度の値に基づいて背景色を判定する
 */
export const getLuminanceBackgroundColor = (luminance: number): string => {
  if (luminance >= 0.8) return "bg-blue-100";
  if (luminance >= 0.6) return "bg-blue-200";
  if (luminance >= 0.4) return "bg-blue-300";
  if (luminance >= 0.2) return "bg-blue-400";
  return "bg-blue-500";
};
