import { describe, it, expect } from "vitest";
import { rotateHueOklch, generateScheme, generateTones } from "./harmony";
import { parseHex, rgbToOklch, rgbToHsv } from "./convert";

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
  it("既定は5段階、色相を保つ", () => {
    const base = hex("#2d6cdf");
    const tones = generateTones(base);
    expect(tones).toHaveLength(5);
    const baseHue = rgbToHsv(base).h;
    for (const t of tones) {
      expect(rgbToHsv(t).h).toBeCloseTo(baseHue, 0);
    }
  });
});
