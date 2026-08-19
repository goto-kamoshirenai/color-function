import { describe, it, expect } from "vitest";
import { ensureReadableAccent } from "./accent";
import { contrastRatio } from "./contrast";
import { parseHex, rgbToOklch } from "./convert";

const hex = (h: string) => parseHex(h)!;

describe("ensureReadableAccent", () => {
  it("既に十分なら原色のまま", () => {
    const accent = hex("#1a1a18");
    const bg = hex("#ffffff");
    expect(ensureReadableAccent(accent, bg, 4.5)).toEqual(accent);
  });

  it("明背景で低コントラストな色は暗く補正して minRatio を満たす", () => {
    const accent = hex("#e9d8a6"); // 淡色、白地で読みにくい
    const bg = hex("#ffffff");
    const fixed = ensureReadableAccent(accent, bg, 4.5);
    expect(contrastRatio(fixed, bg)).toBeGreaterThanOrEqual(4.5 - 0.05);
  });

  it("暗背景では明るく補正して minRatio を満たす", () => {
    const accent = hex("#1f2933"); // 暗色、黒地で読みにくい
    const bg = hex("#0c0c0d");
    const fixed = ensureReadableAccent(accent, bg, 4.5);
    expect(contrastRatio(fixed, bg)).toBeGreaterThanOrEqual(4.5 - 0.05);
  });

  it("中間輝度の背景では両方向を探索し、明度差の小さい方を採る", () => {
    // 中間グレー背景に対し、暗くする方が近い色（やや暗めの中間色）
    const accent = hex("#6f7a86");
    const bg = hex("#808080");
    const fixed = ensureReadableAccent(accent, bg, 4.5);
    expect(contrastRatio(fixed, bg)).toBeGreaterThanOrEqual(4.5 - 0.05);

    // 逆方向（明るくする）で満たす場合よりも明度差が小さいこと
    const l0 = rgbToOklch(accent).l;
    const lFixed = rgbToOklch(fixed).l;
    expect(lFixed).toBeLessThan(l0);
    expect(Math.abs(lFixed - l0)).toBeLessThan(0.5);
  });

  it("補正量は必要最小限（境界を大きく超えない）", () => {
    const accent = hex("#e9d8a6");
    const bg = hex("#ffffff");
    const fixed = ensureReadableAccent(accent, bg, 4.5);
    // 二分で境界に寄せるため、行き過ぎ（比が大幅に超過）しない
    expect(contrastRatio(fixed, bg)).toBeLessThan(4.5 + 0.3);
  });
});
