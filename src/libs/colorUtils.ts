import chroma from "chroma-js";

interface HSV {
  h: number; // 色相 (0-360)
  s: number; // 彩度 (0-100)
  v: number; // 明度 (0-100)
}

export interface ColorMetrics {
  hueEntropy: number;
  saturationEntropy: number;
  lightnessEntropy: number;
  colorDistance: number;
}

export interface ColorAnalysis {
  entropy: number;
  hueVariety: number;
  saturationUnity: number;
  lightnessBalance: number;
  colorCategory: "統一感" | "バランス" | "カラフル";
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

// エントロピー計算
export const calculateEntropy = (
  values: number[],
  maxValue: number
): number => {
  const normalizedValues = values.map((v) => v / maxValue);
  const sum = normalizedValues.reduce((a, b) => a + b, 0);
  return -normalizedValues
    .filter((v) => v > 0)
    .reduce((acc, val) => acc + (val / sum) * Math.log2(val / sum), 0);
};

// 色間の距離計算
export const calculateColorDistance = (colors: string[]): number => {
  let totalDistance = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      totalDistance += chroma.distance(colors[i], colors[j]);
    }
  }
  return totalDistance / ((colors.length * (colors.length - 1)) / 2);
};

// 色のメトリクス計算
export const calculateColorMetrics = (colors: string[]): ColorMetrics => {
  const hslValues = colors.map((color) => chroma(color).hsl());

  const hues = hslValues.map((hsl) => hsl[0]);
  const hueEntropy = calculateEntropy(hues, 360);

  const saturations = hslValues.map((hsl) => hsl[1]);
  const saturationEntropy = calculateEntropy(saturations, 1);

  const lightness = hslValues.map((hsl) => hsl[2]);
  const lightnessEntropy = calculateEntropy(lightness, 1);

  const colorDistance = calculateColorDistance(colors);

  return {
    hueEntropy,
    saturationEntropy,
    lightnessEntropy,
    colorDistance,
  };
};

// 配色の評価テキスト取得
export const getColorEvaluationText = (metrics: ColorMetrics): string => {
  const totalScore =
    (metrics.hueEntropy +
      metrics.saturationEntropy +
      metrics.lightnessEntropy +
      metrics.colorDistance) /
    4;

  if (totalScore > 0.7) {
    return "カラフルで活発な配色です。アクセントとして効果的ですが、長時間の視聴には注意が必要かもしれません。";
  } else if (totalScore > 0.4) {
    return "バランスの取れた配色です。視認性と美しさを両立しています。";
  } else {
    return "統一感のある落ち着いた配色です。長時間の閲覧に適しています。";
  }
};

// 色相の多様性を計算
const calculateHueVariety = (hues: number[], lightness: number[]): number => {
  // 無効な色相値と無彩色（明度0%または100%）を除外
  const validIndices = lightness
    .map((l, i) => (l > 0 && l < 1 ? i : -1))
    .filter((i) => i !== -1);
  const validHues = validIndices
    .map((i) => hues[i])
    .filter((h) => h !== null && !isNaN(h));

  if (validHues.length === 0) return 0;

  // 色相の差分を計算
  let maxDiff = 0;
  for (let i = 0; i < validHues.length; i++) {
    for (let j = i + 1; j < validHues.length; j++) {
      const diff = Math.min(
        Math.abs(validHues[i] - validHues[j]),
        360 - Math.abs(validHues[i] - validHues[j])
      );
      maxDiff = Math.max(maxDiff, diff);
    }
  }

  // 最大色相差を180度で正規化
  return Math.min(maxDiff / 180, 1);
};

export const analyzeColorPalette = (colors: string[]): ColorAnalysis => {
  const hslValues = colors.map((color) => chroma(color).hsl());

  // 無彩色の判定（明度が0%/100%、または彩度が0%の色を除外）
  const isAchromatic = (hsl: number[]) => {
    const [, s, l] = hsl;
    return l <= 0 || l >= 1 || s <= 0;
  };

  // 有効な（無彩色でない）色のインデックスを取得
  const validIndices = hslValues
    .map((hsl, i) => (isAchromatic(hsl) ? -1 : i))
    .filter((i) => i !== -1);

  // 色相の多様性
  const hues = hslValues.map((hsl) => hsl[0]);
  const lightness = hslValues.map((hsl) => hsl[2]);
  const hueVariety = calculateHueVariety(hues, lightness);

  // 彩度の統一性（無彩色を除外）
  const saturations = validIndices.map((i) => hslValues[i][1]);
  const saturationUnity =
    saturations.length === 0 ? 1 : 1 - calculateStandardDeviation(saturations);

  // 明度のバランス（全ての色を含む）
  const lightnessBalance = 1 - Math.abs(0.5 - average(lightness));

  // 総合エントロピー
  const entropy =
    (hueVariety + (1 - saturationUnity) + (1 - lightnessBalance)) / 3;

  // カテゴリ判定
  let colorCategory: "統一感" | "バランス" | "カラフル";
  if (entropy < 0.3) colorCategory = "統一感";
  else if (entropy < 0.6) colorCategory = "バランス";
  else colorCategory = "カラフル";

  return {
    entropy,
    hueVariety,
    saturationUnity,
    lightnessBalance,
    colorCategory,
  };
};

// 補助関数
const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

const calculateStandardDeviation = (arr: number[]) => {
  const avg = average(arr);
  const squareDiffs = arr.map((value) => Math.pow(value - avg, 2));
  return Math.sqrt(average(squareDiffs));
};
