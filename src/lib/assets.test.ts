import { describe, it, expect } from "vitest";
import {
  parseNamesAsset,
  parseHarmonyRulesAsset,
  COLOR_NAMES,
  HARMONY_RULES,
} from "./assets";

const valid = {
  schemaVersion: "1.0.0",
  version: "1.0.0",
  kind: "names",
  data: {
    system: "css",
    locale: "en",
    colors: [
      { id: "css-red", name: "Red", hex: "#FF0000" },
      { id: "wa-asagi", name: "浅葱色", hex: "#00A3AF", reading: "あさぎいろ" },
    ],
  },
};

describe("parseNamesAsset", () => {
  it("正しいアセットを name/hex に変換", () => {
    expect(parseNamesAsset(valid)).toEqual([
      { name: "Red", hex: "#FF0000" },
      { name: "浅葱色", hex: "#00A3AF" },
    ]);
  });

  it("不正なHEXは検証で弾く", () => {
    const bad = {
      ...valid,
      data: { ...valid.data, colors: [{ id: "x", name: "X", hex: "red" }] },
    };
    expect(() => parseNamesAsset(bad)).toThrow();
  });

  it("kind 不一致は弾く", () => {
    expect(() => parseNamesAsset({ ...valid, kind: "standards" })).toThrow();
  });
});

describe("ビルド同梱の静的データ", () => {
  it("色名辞書は検証済みで空でない（fetch を伴わない）", () => {
    expect(COLOR_NAMES.length).toBeGreaterThan(0);
    for (const c of COLOR_NAMES) {
      expect(c.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  it("調和ルールは検証済みで空でない", () => {
    expect(HARMONY_RULES.length).toBeGreaterThan(0);
    for (const r of HARMONY_RULES) {
      expect(r.hueOffsets.length).toBeGreaterThan(0);
    }
  });

  it("調和ルールの kind 不一致は弾く", () => {
    expect(() =>
      parseHarmonyRulesAsset({
        schemaVersion: "1.0.0",
        version: "1.0.0",
        kind: "names",
        data: { rules: [] },
      }),
    ).toThrow();
  });
});
