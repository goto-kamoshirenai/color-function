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
} from "./convert";

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
