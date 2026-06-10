import { describe, it, expect } from "vitest";
import { deltaE2000, deltaE76 } from "./difference";
import { rgbToLab, parseHex } from "./convert";
import type { LAB } from "./types";
import { SHARMA_CIEDE2000 } from "./__fixtures__/ciede2000-sharma";

const lab = (L: number, a: number, b: number): LAB => ({ L, a, b });

describe("deltaE2000", () => {
  it("同色は 0", () => {
    expect(deltaE2000(lab(50, 2, -3), lab(50, 2, -3))).toBeCloseTo(0, 10);
  });

  it("Sharma 標準34組と4桁一致", () => {
    for (const [L1, a1, b1, L2, a2, b2, expected] of SHARMA_CIEDE2000) {
      expect(deltaE2000(lab(L1, a1, b1), lab(L2, a2, b2))).toBeCloseTo(
        expected,
        4,
      );
    }
  });

  it("黒×白は大きな色差（≈100）", () => {
    const black = rgbToLab(parseHex("#000000")!);
    const white = rgbToLab(parseHex("#ffffff")!);
    expect(deltaE2000(black, white)).toBeGreaterThan(95);
  });
});

describe("deltaE76", () => {
  it("Lab ユークリッド距離", () => {
    expect(deltaE76(lab(50, 0, 0), lab(50, 3, 4))).toBeCloseTo(5, 6);
  });
});
