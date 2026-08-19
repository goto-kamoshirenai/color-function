import { describe, it, expect } from "vitest";
import { CARD_REGISTRY } from "./registry";
import { LAYOUT, layoutFor } from "./layout";
import { filterCards } from "./types";
import { HELP } from "./help";
import type { Unit, View } from "@/store/useColorStore";

describe("カードレジストリ / filterCards", () => {
  it("単色×検証で8カード（ヒーローが色値・最寄り色名を吸収）", () => {
    const keys = filterCards(CARD_REGISTRY, "single", "verify").map(
      (c) => c.key,
    );
    expect(keys).toEqual([
      "hsv",
      "luminance",
      "hue-wheel",
      "spaces",
      "perception",
      "alpha",
      "gamut",
      "single-hero",
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

  it("パレット×検証で14カード（マトリクス系 + 統計/識別性/プレビュー + ヒーロー）", () => {
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
      "palette-overview",
    ]);
  });

  it("設計ビューは単位共通で16カード（+ ヒーロー）", () => {
    for (const unit of ["single", "pair", "palette"] as const) {
      const keys = filterCards(CARD_REGISTRY, unit, "design").map((c) => c.key);
      expect(keys).toHaveLength(16);
      expect(keys).toContain("harmony");
      expect(keys).toContain("tokens");
      expect(keys).toContain("base-scheme");
    }
  });

  it("全カードの helpKey に ja/en のヘルプ文言が存在する", () => {
    for (const c of CARD_REGISTRY) {
      expect(HELP.ja[c.helpKey], `ja help: ${c.helpKey}`).toBeDefined();
      expect(HELP.en[c.helpKey], `en help: ${c.helpKey}`).toBeDefined();
    }
  });

  it("registry の key は一意", () => {
    const keys = CARD_REGISTRY.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

/**
 * registry（存在）と LAYOUT（配置）の整合。
 * 別ソースで管理しているため、片方だけの変更はカードが無言で消える／出ない
 * という形で表面化する。両方向を検査して防ぐ。
 */
describe("registry と LAYOUT の整合", () => {
  const MODES: { unit: Unit; view: View }[] = [
    { unit: "single", view: "verify" },
    { unit: "pair", view: "verify" },
    { unit: "palette", view: "verify" },
    { unit: "single", view: "design" },
  ];

  it("LAYOUT の全 key が registry に存在する（typo・古い key を検出）", () => {
    const known = new Set(CARD_REGISTRY.map((c) => c.key));
    for (const [mode, rows] of Object.entries(LAYOUT)) {
      for (const key of rows.flatMap((r) => r.keys)) {
        expect(known.has(key), `${mode} の "${key}" が registry にない`).toBe(
          true,
        );
      }
    }
  });

  it("LAYOUT 内で同じ key を二重に配置していない", () => {
    for (const [mode, rows] of Object.entries(LAYOUT)) {
      const keys = rows.flatMap((r) => r.keys);
      expect(new Set(keys).size, `${mode} に重複配置がある`).toBe(keys.length);
    }
  });

  it("各モードで registry 該当カードが過不足なく配置される", () => {
    for (const { unit, view } of MODES) {
      const registryKeys = filterCards(CARD_REGISTRY, unit, view)
        .map((c) => c.key)
        .sort();
      const layoutKeys = layoutFor(unit, view)
        .flatMap((r) => r.keys)
        .sort();
      expect(
        layoutKeys,
        `${unit}|${view} の配置が registry と一致しない`,
      ).toEqual(registryKeys);
    }
  });

  it("LAYOUT のモードキーは単位×観点を網羅する", () => {
    for (const { unit, view } of MODES) {
      expect(layoutFor(unit, view), `${unit}|${view}`).toBeDefined();
    }
  });
});
