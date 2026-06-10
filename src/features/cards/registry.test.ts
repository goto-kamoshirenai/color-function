import { describe, it, expect } from "vitest";
import { CARD_REGISTRY } from "./registry";
import { filterCards } from "./types";

describe("カードレジストリ / filterCards", () => {
  it("単色×検証で5カード（色値/HSV/相対輝度/色相環/最寄り色名）", () => {
    const keys = filterCards(CARD_REGISTRY, "single", "verify").map(
      (c) => c.key,
    );
    expect(keys).toEqual([
      "value",
      "hsv",
      "luminance",
      "hue-wheel",
      "nearest-name",
    ]);
  });

  it("ペア×検証で3カード（WCAGコントラスト/色差ΔE/色覚シミュレーション）", () => {
    const keys = filterCards(CARD_REGISTRY, "pair", "verify").map((c) => c.key);
    expect(keys).toEqual(["wcag-contrast", "delta-e", "cvd"]);
  });

  it("全カードが既知の helpKey を持つ", () => {
    for (const c of CARD_REGISTRY) {
      expect(typeof c.helpKey).toBe("string");
      expect(c.helpKey.length).toBeGreaterThan(0);
    }
  });
});
