interface HSV {
  h: number; // 色相 (0-360)
  s: number; // 彩度 (0-100)
  v: number; // 明度 (0-100)
}

// HEXからRGBに変換
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// RGBからHSVに変換
export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff === 0) {
    h = 0;
  } else if (max === r) {
    h = 60 * ((g - b) / diff + (g < b ? 6 : 0));
  } else if (max === g) {
    h = 60 * ((b - r) / diff + 2);
  } else if (max === b) {
    h = 60 * ((r - g) / diff + 4);
  }

  const s = max === 0 ? 0 : (diff / max) * 100;
  const v = max * 100;

  return { h: Math.round(h), s: Math.round(s), v: Math.round(v) };
};

// HEXからHSVに変換
export const hexToHsv = (hex: string): HSV | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
};

// HSVの値を比較しやすい文字列に変換
export const formatHsv = (hsv: HSV): string => {
  return `H:${hsv.h}° S:${hsv.s}% V:${hsv.v}%`;
};
