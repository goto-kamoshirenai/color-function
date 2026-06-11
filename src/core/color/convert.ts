import { converter, clampChroma } from "culori";
import type {
  CMYK,
  HSL,
  HSV,
  HWB,
  LAB,
  LCH,
  OKLAB,
  OKLCH,
  RGB,
  XYZ,
} from "./types";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// ---------- HEX <-> RGB ----------

/** #rgb / #rrggbb（# 省略可）を 0–255 RGB に。不正は null（docs/07 §2）。 */
export function parseHex(input: string): RGB | null {
  let h = (input ?? "").trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** RGB を小文字 #rrggbb に（丸め・クランプ）。 */
export function toHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

// ---------- sRGB <-> linear（docs/07 §1.1） ----------

/** ガンマ解除。c は 0–1。 */
export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** ガンマ付与。c は 0–1。 */
export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// ---------- HSL（docs/07 §3） ----------

export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] = hueSector(h, c, x);
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

// ---------- HSV（docs/07 §4） ----------

export function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, v: v * 100 };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r1, g1, b1] = hueSector(h, c, x);
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

function hueSector(h: number, c: number, x: number): [number, number, number] {
  if (h < 60) return [c, x, 0];
  if (h < 120) return [x, c, 0];
  if (h < 180) return [0, c, x];
  if (h < 240) return [0, x, c];
  if (h < 300) return [x, 0, c];
  return [c, 0, x];
}

// ---------- OKLCH（culori 経由） ----------

const toOklch = converter("oklch");
const toRgb = converter("rgb");

export function rgbToOklch({ r, g, b }: RGB): OKLCH {
  const o = toOklch({ mode: "rgb", r: r / 255, g: g / 255, b: b / 255 });
  return { l: o.l, c: o.c, h: o.h ?? 0 };
}

export function oklchToRgb({ l, c, h }: OKLCH): RGB {
  // sRGB 域外は色相を保ったまま彩度を落としてガマットマッピング（単純クランプは色相を歪める）。
  const inGamut = clampChroma({ mode: "oklch", l, c, h }, "oklch");
  const rgb = toRgb(inGamut);
  return {
    r: clamp(rgb.r, 0, 1) * 255,
    g: clamp(rgb.g, 0, 1) * 255,
    b: clamp(rgb.b, 0, 1) * 255,
  };
}

// ---------- CIE XYZ（D65・sRGB 行列） ----------

export function rgbToXyz({ r, g, b }: RGB): XYZ {
  const R = srgbToLinear(r / 255);
  const G = srgbToLinear(g / 255);
  const B = srgbToLinear(b / 255);
  return {
    x: R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    y: R * 0.2126729 + G * 0.7151522 + B * 0.072175,
    z: R * 0.0193339 + G * 0.119192 + B * 0.9503041,
  };
}

/** CIE 1931 xy 色度座標。黒（X=Y=Z=0）は D65 白色点を返す。 */
export function xyzToXy({ x, y, z }: XYZ): { x: number; y: number } {
  const sum = x + y + z;
  if (sum === 0) return { x: 0.3127, y: 0.329 };
  return { x: x / sum, y: y / sum };
}

// ---------- CIELAB（D65, docs/07 §7.1–7.2） ----------

export function rgbToLab(rgb: RGB): LAB {
  const { x, y, z } = rgbToXyz(rgb);

  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;
  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : (1 / 3) * (29 / 6) ** 2 * t + 4 / 29;
  const fx = f(x / xn);
  const fy = f(y / yn);
  const fz = f(z / zn);

  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** CIELCH（LAB の極座標）。実質無彩色（C<0.05）のとき色相は 0。 */
export function labToLch({ L, a, b }: LAB): LCH {
  const c = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, c, h: c < 0.05 ? 0 : h };
}

// ---------- OKLab（culori 経由） ----------

const toOklab = converter("oklab");

export function rgbToOklab({ r, g, b }: RGB): OKLAB {
  const o = toOklab({ mode: "rgb", r: r / 255, g: g / 255, b: b / 255 });
  return { l: o.l, a: o.a, b: o.b };
}

// ---------- HWB / CMYK（CSS Color 4 / ナイーブ近似） ----------

export function rgbToHwb(rgb: RGB): HWB {
  const { h } = rgbToHsv(rgb);
  const w = Math.min(rgb.r, rgb.g, rgb.b) / 255;
  const b = 1 - Math.max(rgb.r, rgb.g, rgb.b) / 255;
  return { h, w: w * 100, b: b * 100 };
}

/** ナイーブ CMYK 近似（ICC プロファイル無し・印刷の参考値）。 */
export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const k = 1 - Math.max(R, G, B);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: ((1 - R - k) / (1 - k)) * 100,
    m: ((1 - G - k) / (1 - k)) * 100,
    y: ((1 - B - k) / (1 - k)) * 100,
    k: k * 100,
  };
}
