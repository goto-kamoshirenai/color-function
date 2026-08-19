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
  normalizeHue,
  hueDiff,
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

describe("色相ヘルパ（normalizeHue / hueDiff）", () => {
  it("normalizeHue: 負・360超を 0–360 に畳む", () => {
    expect(normalizeHue(0)).toBe(0);
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(-30)).toBe(330);
    expect(normalizeHue(760)).toBe(40);
    expect(normalizeHue(NaN)).toBe(0);
  });

  it("hueDiff: 環状の最短差（0–180）", () => {
    expect(hueDiff(10, 350)).toBe(20);
    expect(hueDiff(0, 180)).toBe(180);
    expect(hueDiff(-10, 10)).toBe(20);
    expect(hueDiff(90, 90)).toBe(0);
  });
});

describe("sRGB ガンマの閾値跨ぎ", () => {
  // sRGB 規格の区分関数は丸めた定数のため閾値で約 3e-8 の不連続がある。
  // 実害のない範囲であることを固定する（8bit 換算で 1e-5 未満）。
  it("srgbToLinear は 0.04045 の前後でほぼ連続（不連続は 1e-7 未満）", () => {
    const at = srgbToLinear(0.04045);
    expect(at).toBeCloseTo(0.04045 / 12.92, 12);
    expect(srgbToLinear(0.04045 - 1e-9)).toBeCloseTo(at, 7);
    expect(srgbToLinear(0.04045 + 1e-9)).toBeCloseTo(at, 7);
  });

  it("linearToSrgb は 0.0031308 の前後でほぼ連続（不連続は 1e-7 未満）", () => {
    const at = linearToSrgb(0.0031308);
    expect(at).toBeCloseTo(12.92 * 0.0031308, 12);
    expect(linearToSrgb(0.0031308 - 1e-12)).toBeCloseTo(at, 7);
    expect(linearToSrgb(0.0031308 + 1e-12)).toBeCloseTo(at, 7);
  });

  it("往復は閾値の両側で戻る", () => {
    for (const v of [0, 0.002, 0.0031308, 0.04045, 0.2, 1]) {
      expect(linearToSrgb(srgbToLinear(v))).toBeCloseTo(v, 7);
    }
  });
});

describe("oklchToRgb のガマット外処理（clampChroma）", () => {
  it("sRGB 域外の高彩度は色相を保ったまま域内へ寄せる", () => {
    // L=0.6 / C=0.4（sRGB 外）の赤系。単純クランプなら色相が歪む
    const rgb = oklchToRgb({ l: 0.6, c: 0.4, h: 29.23 });
    for (const v of [rgb.r, rgb.g, rgb.b]) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(255);
    }
    const back = rgbToOklch(rgb);
    expect(back.c).toBeLessThan(0.4); // 彩度を落として域内化
    expect(Math.abs(back.h - 29.23)).toBeLessThan(3); // 色相は保つ
    expect(back.l).toBeCloseTo(0.6, 1);
  });

  it("既知のガマット外指定は決定的な hex になる", () => {
    expect(toHex(oklchToRgb({ l: 0.6, c: 0.4, h: 29.23 }))).toBe(
      toHex(oklchToRgb({ l: 0.6, c: 0.4, h: 29.23 })),
    );
    expect(toHex(oklchToRgb({ l: 0.5, c: 0.5, h: 150 }))).toMatch(
      /^#[0-9a-f]{6}$/,
    );
  });

  it("L=0 / L=1 は黒・白になる", () => {
    expect(toHex(oklchToRgb({ l: 0, c: 0.2, h: 100 }))).toBe("#000000");
    expect(toHex(oklchToRgb({ l: 1, c: 0.2, h: 100 }))).toBe("#ffffff");
  });
});
