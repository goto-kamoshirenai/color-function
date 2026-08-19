import { describe, it, expect } from "vitest";
import {
  parseHex,
  toHex,
  srgbToLinear,
  linearToSrgb,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToOklch,
  oklchToRgb,
  rgbToLab,
  rgbToCmyk,
  rgbToHwb,
  rgbToXyz,
  rgbToOklab,
} from "./convert";
import { relativeLuminance, contrastRatio } from "./contrast";

describe("parseHex", () => {
  it("#rrggbb を 0–255 RGB に変換", () => {
    expect(parseHex("#2D6CDF")).toEqual({ r: 45, g: 108, b: 223 });
  });
  it("短縮 #rgb は各桁を複製", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });
  it("# は省略可", () => {
    expect(parseHex("000000")).toEqual({ r: 0, g: 0, b: 0 });
  });
  it("不正な文字列は null", () => {
    expect(parseHex("#xyz")).toBeNull();
    expect(parseHex("#12")).toBeNull();
    expect(parseHex("")).toBeNull();
  });
});

describe("toHex", () => {
  it("RGB を小文字 #rrggbb に", () => {
    expect(toHex({ r: 45, g: 108, b: 223 })).toBe("#2d6cdf");
  });
  it("丸めとクランプ", () => {
    expect(toHex({ r: 255.6, g: -3, b: 127.4 })).toBe("#ff007f");
  });
});

describe("srgb <-> linear", () => {
  it("境界値", () => {
    expect(srgbToLinear(0)).toBeCloseTo(0, 6);
    expect(srgbToLinear(1)).toBeCloseTo(1, 6);
    expect(srgbToLinear(0.5)).toBeCloseTo(0.214041, 5);
  });
  it("往復", () => {
    expect(linearToSrgb(srgbToLinear(0.3))).toBeCloseTo(0.3, 6);
  });
});

describe("rgbToHsl / hslToRgb", () => {
  it("赤", () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
  });
  it("白は無彩色", () => {
    const hsl = rgbToHsl({ r: 255, g: 255, b: 255 });
    expect(hsl.s).toBe(0);
    expect(hsl.l).toBe(100);
  });
  it("往復", () => {
    const rgb = { r: 45, g: 108, b: 223 };
    const back = hslToRgb(rgbToHsl(rgb));
    expect(back.r).toBeCloseTo(45, 0);
    expect(back.g).toBeCloseTo(108, 0);
    expect(back.b).toBeCloseTo(223, 0);
  });
});

describe("rgbToHsv / hsvToRgb", () => {
  it("赤", () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 });
  });
  it("往復", () => {
    const rgb = { r: 232, g: 197, b: 71 };
    const back = hsvToRgb(rgbToHsv(rgb));
    expect(back.r).toBeCloseTo(232, 0);
    expect(back.g).toBeCloseTo(197, 0);
    expect(back.b).toBeCloseTo(71, 0);
  });
});

describe("rgbToOklch / oklchToRgb", () => {
  it("赤（既知の近似値）", () => {
    const o = rgbToOklch({ r: 255, g: 0, b: 0 });
    expect(o.l).toBeCloseTo(0.628, 2);
    expect(o.c).toBeCloseTo(0.258, 2);
    expect(o.h).toBeCloseTo(29.23, 1);
  });
  it("往復", () => {
    const rgb = { r: 45, g: 108, b: 223 };
    const back = oklchToRgb(rgbToOklch(rgb));
    expect(back.r).toBeCloseTo(45, 0);
    expect(back.g).toBeCloseTo(108, 0);
    expect(back.b).toBeCloseTo(223, 0);
  });
});

describe("rgbToLab（D65）", () => {
  it("白", () => {
    const lab = rgbToLab({ r: 255, g: 255, b: 255 });
    expect(lab.L).toBeCloseTo(100, 1);
    expect(lab.a).toBeCloseTo(0, 0);
    expect(lab.b).toBeCloseTo(0, 0);
  });
  it("黒", () => {
    expect(rgbToLab({ r: 0, g: 0, b: 0 })).toEqual({ L: 0, a: 0, b: 0 });
  });
  it("赤（既知の近似値 53.24, 80.09, 67.20）", () => {
    const lab = rgbToLab({ r: 255, g: 0, b: 0 });
    expect(lab.L).toBeCloseTo(53.24, 1);
    expect(lab.a).toBeCloseTo(80.09, 1);
    expect(lab.b).toBeCloseTo(67.2, 1);
  });
});

describe("範囲外入力の堅牢性（入口でクランプ）", () => {
  const OUT_OF_RANGE = { r: -30, g: 300, b: 128.7 };
  const CLAMPED = { r: 0, g: 255, b: 128.7 };

  it("各変換は 0–255 にクランプした値と同じ結果を返す", () => {
    expect(rgbToHsl(OUT_OF_RANGE)).toEqual(rgbToHsl(CLAMPED));
    expect(rgbToHsv(OUT_OF_RANGE)).toEqual(rgbToHsv(CLAMPED));
    expect(rgbToHwb(OUT_OF_RANGE)).toEqual(rgbToHwb(CLAMPED));
    expect(rgbToXyz(OUT_OF_RANGE)).toEqual(rgbToXyz(CLAMPED));
    expect(rgbToLab(OUT_OF_RANGE)).toEqual(rgbToLab(CLAMPED));
    expect(rgbToOklch(OUT_OF_RANGE)).toEqual(rgbToOklch(CLAMPED));
    expect(rgbToOklab(OUT_OF_RANGE)).toEqual(rgbToOklab(CLAMPED));
    expect(rgbToCmyk(OUT_OF_RANGE)).toEqual(rgbToCmyk(CLAMPED));
  });

  it("非有限値（NaN/Infinity）でも NaN を伝播させない", () => {
    const hsv = rgbToHsv({ r: NaN, g: Infinity, b: -Infinity });
    expect(Number.isFinite(hsv.h)).toBe(true);
    expect(Number.isFinite(hsv.s)).toBe(true);
    expect(Number.isFinite(hsv.v)).toBe(true);

    const y = relativeLuminance({ r: NaN, g: 0, b: 0 });
    expect(Number.isFinite(y)).toBe(true);
  });

  it("相対輝度・コントラスト比は範囲外入力でも規定の値域に収まる", () => {
    const y = relativeLuminance({ r: -100, g: -100, b: -100 });
    expect(y).toBe(0);
    const ratio = contrastRatio(
      { r: 400, g: 400, b: 400 },
      { r: -5, g: 0, b: 0 },
    );
    expect(ratio).toBeCloseTo(21, 2);
  });

  it("rgbToCmyk: 実質黒では 0 除算せず K=100 を返す", () => {
    expect(rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({
      c: 0,
      m: 0,
      y: 0,
      k: 100,
    });
    expect(rgbToCmyk({ r: -1, g: -1, b: -1 })).toEqual({
      c: 0,
      m: 0,
      y: 0,
      k: 100,
    });
    const near = rgbToCmyk({ r: 0, g: 0, b: 1e-12 });
    expect(near.k).toBeCloseTo(100, 6);
    expect(near.c).toBe(0);
  });

  it("rgbToCmyk: 各成分は 0–100 に収まる", () => {
    for (const rgb of [
      { r: 255, g: 0, b: 0 },
      { r: 300, g: -20, b: 128 },
      { r: 1, g: 0, b: 0 },
    ]) {
      const { c, m, y, k } = rgbToCmyk(rgb);
      for (const v of [c, m, y, k]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });
});
