import { describe, it, expect } from "vitest";
import { parseNamesAsset } from "./assets";

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
