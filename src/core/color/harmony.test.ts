import { describe, it, expect } from "vitest";
import {
  rotateHueOklch,
  generateScheme,
  generateTones,
  TONE_STEPS,
} from "./harmony";
import { parseHex, rgbToOklch } from "./convert";

const hex = (h: string) => parseHex(h)!;

describe("rotateHueOklch", () => {
  it("0° 回転はほぼ同色", () => {
    const red = hex("#e4572e");
    const out = rotateHueOklch(red, 0);
    expect(out.r).toBeCloseTo(red.r, 0);
    expect(out.g).toBeCloseTo(red.g, 0);
    expect(out.b).toBeCloseTo(red.b, 0);
  });

  it("180° 回転で OKLCH 色相が約180°ずれる", () => {
    const base = hex("#2d6cdf");
    const h0 = rgbToOklch(base).h;
    const h1 = rgbToOklch(rotateHueOklch(base, 180)).h;
    const separation = (((h1 - h0) % 360) + 360) % 360; // 完全な補色なら ≈180
    expect(Math.abs(separation - 180)).toBeLessThan(2);
  });
});

describe("generateScheme", () => {
  it("補色は2色、先頭は基準色近傍", () => {
    const base = hex("#2d6cdf");
    const scheme = generateScheme(base, [0, 180]);
    expect(scheme).toHaveLength(2);
    expect(scheme[0].r).toBeCloseTo(base.r, 0);
  });

  it("トライアドは3色", () => {
    expect(generateScheme(hex("#e8c547"), [0, 120, 240])).toHaveLength(3);
  });
});

describe("generateTones", () => {
  it("50〜900 の10段階で、500 は基準色そのもの", () => {
    const base = hex("#2d6cdf");
    const tones = generateTones(base);
    expect(tones.map((t) => t.step)).toEqual([...TONE_STEPS]);
    expect(tones.find((t) => t.step === 500)?.rgb).toEqual(base);
  });

  it("明度は 50（最明）から 900（最暗）へ単調減少", () => {
    const tones = generateTones(hex("#2d6cdf"));
    const ls = tones.map((t) => rgbToOklch(t.rgb).l);
    for (let i = 1; i < ls.length; i++) {
      expect(ls[i]).toBeLessThan(ls[i - 1]);
    }
  });

  it("OKLCH 色相を保つ（彩度が残る段のみ判定）", () => {
    const base = hex("#2d6cdf");
    const baseHue = rgbToOklch(base).h;
    for (const tone of generateTones(base)) {
      const o = rgbToOklch(tone.rgb);
      if (o.c < 0.02) continue; // ほぼ無彩色は色相が不定
      const diff = Math.abs((((o.h - baseHue) % 360) + 360) % 360);
      expect(Math.min(diff, 360 - diff)).toBeLessThan(3);
    }
  });

  it("白・黒のような極端な基準色でも階調が破綻しない", () => {
    for (const h of ["#ffffff", "#000000"]) {
      const tones = generateTones(hex(h));
      expect(tones).toHaveLength(10);
      const ls = tones.map((t) => rgbToOklch(t.rgb).l);
      for (let i = 1; i < ls.length; i++) {
        expect(ls[i]).toBeLessThanOrEqual(ls[i - 1] + 1e-9);
      }
    }
  });
});
