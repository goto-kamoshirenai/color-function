import { describe, it, expect } from "vitest";
import { ensureReadableAccent } from "./accent";
import { contrastRatio } from "./contrast";
import { parseHex, rgbToOklch, toHex } from "./convert";

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

describe("補正結果は HEX 化しても条件を満たす", () => {
  it("8bit 量子化後もコントラスト比が minRatio を下回らない", () => {
    // 境界へ寄せた結果が hex 化で 4.49 に落ちると axe の色コントラスト検査に落ちる
    for (const [a, bg] of [
      ["#e4572e", "#ededee"],
      ["#e9d8a6", "#ffffff"],
      ["#1f2933", "#0c0c0d"],
      ["#576fff", "#ededee"],
      ["#009b4c", "#ffffff"],
    ] as const) {
      const fixed = ensureReadableAccent(hex(a), hex(bg), 4.5);
      const quantized = parseHex(toHex(fixed))!;
      expect(
        contrastRatio(quantized, hex(bg)),
        `${a} on ${bg}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
