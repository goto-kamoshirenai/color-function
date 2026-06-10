import { describe, it, expect } from "vitest";
import { hueDistribution, paletteEntropy } from "./stats";
import { parseHex } from "./convert";

const pal = (...hexes: string[]) => hexes.map((h) => parseHex(h)!);

describe("hueDistribution", () => {
  it("各色の色相を返す", () => {
    const hues = hueDistribution(pal("#ff0000", "#00ff00", "#0000ff"));
    expect(hues[0]).toBeCloseTo(0, 0);
    expect(hues[1]).toBeCloseTo(120, 0);
    expect(hues[2]).toBeCloseTo(240, 0);
  });
});

describe("paletteEntropy", () => {
  it("空は 0", () => {
    expect(paletteEntropy([])).toBe(0);
  });
  it("同色相だけなら 0", () => {
    expect(paletteEntropy(pal("#ff0000", "#aa0000"))).toBeCloseTo(0, 6);
  });
  it("色相が散るほど大きい", () => {
    const concentrated = paletteEntropy(pal("#ff0000", "#ff3300", "#ff6600"));
    const spread = paletteEntropy(pal("#ff0000", "#00ff00", "#0000ff"));
    expect(spread).toBeGreaterThan(concentrated);
  });
});
