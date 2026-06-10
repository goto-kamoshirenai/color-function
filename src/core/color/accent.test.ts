import { describe, it, expect } from "vitest";
import { ensureReadableAccent } from "./accent";
import { contrastRatio } from "./contrast";
import { parseHex } from "./convert";

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
});
