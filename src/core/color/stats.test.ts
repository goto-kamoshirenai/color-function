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

  it("無彩色（白・黒・グレー）は色相不定として null", () => {
    const hues = hueDistribution(
      pal("#ffffff", "#000000", "#888888", "#ff0000"),
    );
    expect(hues.slice(0, 3)).toEqual([null, null, null]);
    expect(hues[3]).toBeCloseTo(0, 0);
  });

  it("index はパレットと一対一で保たれる", () => {
    expect(hueDistribution(pal("#888888", "#00ff00"))).toHaveLength(2);
  });
});

describe("paletteEntropy", () => {
  it("空は 0", () => {
    expect(paletteEntropy([])).toBe(0);
  });
  it("無彩色のみは 0（色相0°の赤ビンに集計しない）", () => {
    expect(paletteEntropy(pal("#ffffff", "#000000", "#888888"))).toBe(0);
  });
  it("無彩色は有彩色の分布を歪めない", () => {
    const chromatic = paletteEntropy(pal("#ff0000", "#00ff00", "#0000ff"));
    const withGray = paletteEntropy(
      pal("#ff0000", "#00ff00", "#0000ff", "#888888", "#000000"),
    );
    expect(withGray).toBeCloseTo(chromatic, 10);
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
