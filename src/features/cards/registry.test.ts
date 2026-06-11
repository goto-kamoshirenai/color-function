import { describe, it, expect } from "vitest";
import { CARD_REGISTRY } from "./registry";
import { filterCards } from "./types";
import { HELP } from "./help";

describe("カードレジストリ / filterCards", () => {
  it("単色×検証で9カード（基礎5 + 拡張色空間/知覚/不透明度/ガマット）", () => {
    const keys = filterCards(CARD_REGISTRY, "single", "verify").map(
      (c) => c.key,
    );
    expect(keys).toEqual([
      "value",
      "hsv",
      "luminance",
      "hue-wheel",
      "nearest-name",
      "spaces",
      "perception",
      "alpha",
      "gamut",
    ]);
  });

  it("ペア×検証で5カード（WCAG/ΔE/CVD + APCA/色差内訳）", () => {
    const keys = filterCards(CARD_REGISTRY, "pair", "verify").map((c) => c.key);
    expect(keys).toEqual([
      "wcag-contrast",
      "delta-e",
      "cvd",
      "apca",
      "delta-breakdown",
    ]);
  });

  it("パレット×検証で13カード（マトリクス系 + 統計/識別性/プレビュー）", () => {
    const keys = filterCards(CARD_REGISTRY, "palette", "verify").map(
      (c) => c.key,
    );
    expect(keys).toEqual([
      "contrast-matrix",
      "delta-matrix",
      "hue-distribution",
      "ls-distribution",
      "warm-cool",
      "grayscale",
      "cvd-matrix",
      "redundancy",
      "roles",
      "scheme-match",
      "ui-preview",
      "svg-preview",
      "chart-preview",
    ]);
  });

  it("設計ビューは単位共通で16カード", () => {
    for (const unit of ["single", "pair", "palette"] as const) {
      const keys = filterCards(CARD_REGISTRY, unit, "design").map((c) => c.key);
      expect(keys).toHaveLength(16);
      expect(keys).toContain("harmony");
      expect(keys).toContain("tokens");
    }
  });

  it("全カードの helpKey に ja/en のヘルプ文言が存在する", () => {
    for (const c of CARD_REGISTRY) {
      expect(HELP.ja[c.helpKey], `ja help: ${c.helpKey}`).toBeDefined();
      expect(HELP.en[c.helpKey], `en help: ${c.helpKey}`).toBeDefined();
    }
  });
});
