import { describe, it, expect } from "vitest";
import { relativeLuminance, contrastRatio, judgeWcag } from "./contrast";
import { parseHex } from "./convert";

const hex = (h: string) => parseHex(h)!;

describe("relativeLuminance", () => {
  it("黒=0 / 白=1（WCAG）", () => {
    expect(relativeLuminance(hex("#000000"))).toBeCloseTo(0, 6);
    expect(relativeLuminance(hex("#ffffff"))).toBeCloseTo(1, 6);
  });
  it("#808080 ≈ 0.2159（docs/07 §10）", () => {
    expect(relativeLuminance(hex("#808080"))).toBeCloseTo(0.2159, 3);
  });
});

describe("contrastRatio", () => {
  it("黒×白 = 21.00", () => {
    expect(contrastRatio(hex("#000000"), hex("#ffffff"))).toBeCloseTo(21, 2);
  });
  it("同色 = 1.00", () => {
    expect(contrastRatio(hex("#777777"), hex("#777777"))).toBeCloseTo(1, 5);
  });
  it("順序に依らない（対称）", () => {
    const a = hex("#2d6cdf");
    const b = hex("#ffffff");
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
  it("#767676 on #fff ≈ 4.54（AA通常境界, docs/07 §10）", () => {
    expect(contrastRatio(hex("#767676"), hex("#ffffff"))).toBeCloseTo(4.54, 2);
  });
});

describe("judgeWcag", () => {
  it("21:1 は全レベル合格、verdict=AAA", () => {
    const v = judgeWcag(21);
    expect(v.aaNormal).toBe(true);
    expect(v.aaaNormal).toBe(true);
    expect(v.verdict).toBe("AAA");
  });
  it("4.6 は AA通常合格・AAA通常不合格", () => {
    const v = judgeWcag(4.6);
    expect(v.aaNormal).toBe(true);
    expect(v.aaaNormal).toBe(false);
    expect(v.aaLarge).toBe(true);
    expect(v.verdict).toBe("AA");
  });
  it("3.5 は大字のみ AA", () => {
    const v = judgeWcag(3.5);
    expect(v.aaNormal).toBe(false);
    expect(v.aaLarge).toBe(true);
    expect(v.verdict).toBe("AA-large");
  });
  it("2.0 は不適合", () => {
    expect(judgeWcag(2).verdict).toBe("fail");
  });
});
