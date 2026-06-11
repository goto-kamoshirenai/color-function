import { parseHex, rgbToHsl, rgbToHsv } from "./convert";

/** アプリ内のカラーコード表示形式。 */
export const COLOR_FORMATS = ["hex", "rgb", "hsl", "hsv"] as const;
export type ColorFormat = (typeof COLOR_FORMATS)[number];

const r0 = (n: number) => Math.round(n);

/**
 * HEX 文字列を表示形式に整形（CardValue の表記と同じ簡潔スタイル）。
 * 例: "#2D6CDF" → rgb "45, 108, 223" / hsl "219°, 74%, 53%"。
 * 不正な HEX はそのまま返す。
 */
export function formatColor(hex: string, format: ColorFormat): string {
  const rgb = parseHex(hex);
  if (!rgb || format === "hex") return hex.toUpperCase();
  switch (format) {
    case "rgb":
      return `${r0(rgb.r)}, ${r0(rgb.g)}, ${r0(rgb.b)}`;
    case "hsl": {
      const v = rgbToHsl(rgb);
      return `${r0(v.h)}°, ${r0(v.s)}%, ${r0(v.l)}%`;
    }
    case "hsv": {
      const v = rgbToHsv(rgb);
      return `${r0(v.h)}°, ${r0(v.s)}%, ${r0(v.v)}%`;
    }
  }
}
