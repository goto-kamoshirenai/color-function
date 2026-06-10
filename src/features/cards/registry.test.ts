import { describe, it, expect } from "vitest";
import { CARD_REGISTRY } from "./registry";
import { filterCards } from "./types";

describe("カードレジストリ / filterCards", () => {
  it("単色×検証で4カード（色値/HSV/相対輝度/色相環）", () => {
    const keys = filterCards(CARD_REGISTRY, "single", "verify").map(
      (c) => c.key,
    );
    expect(keys).toEqual(["value", "hsv", "luminance", "hue-wheel"]);
  });

  it("ペア×検証は該当なし（S4で追加）", () => {
    expect(filterCards(CARD_REGISTRY, "pair", "verify")).toHaveLength(0);
  });

  it("全カードが既知の helpKey を持つ", () => {
    for (const c of CARD_REGISTRY) {
      expect(typeof c.helpKey).toBe("string");
      expect(c.helpKey.length).toBeGreaterThan(0);
    }
  });
});
