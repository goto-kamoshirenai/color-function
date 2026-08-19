import { describe, it, expect, beforeEach } from "vitest";
import {
  useColorStore,
  resetColorStore,
  MAX_PALETTE_COLORS,
} from "./useColorStore";

/** 色数に対する単位の自動クランプ（パレット≥3 / ペア≥2 / 単色=常時）。 */
describe("単位の自動クランプ", () => {
  beforeEach(() => resetColorStore());

  it("3色→2色に減るとパレットはペアに下がる", () => {
    resetColorStore(["#000000", "#111111", "#222222"]);
    useColorStore.getState().setUnit("palette");
    const id = useColorStore.getState().palette[0].id;
    useColorStore.getState().apply({ kind: "remove", id });
    expect(useColorStore.getState().palette.length).toBe(2);
    expect(useColorStore.getState().unit).toBe("pair");
  });

  it("2色→1色に減るとペアは単色に下がる", () => {
    resetColorStore(["#000000", "#111111"]);
    useColorStore.getState().setUnit("pair");
    const id = useColorStore.getState().palette[0].id;
    useColorStore.getState().apply({ kind: "remove", id });
    expect(useColorStore.getState().palette.length).toBe(1);
    expect(useColorStore.getState().unit).toBe("single");
  });

  it("色を増やしても単位は自動で上がらない", () => {
    resetColorStore(["#000000"]);
    expect(useColorStore.getState().unit).toBe("single");
    useColorStore.getState().apply({ kind: "add", hex: "#111111" });
    expect(useColorStore.getState().palette.length).toBe(2);
    expect(useColorStore.getState().unit).toBe("single");
  });

  it("初期状態は色数に対して妥当な単位になる", () => {
    resetColorStore(["#000000"]);
    expect(useColorStore.getState().unit).toBe("single");
    resetColorStore(["#000000", "#111111", "#222222", "#333333"]);
    expect(useColorStore.getState().unit).toBe("pair");
  });

  it("復元（hydratePalette）では色数に見合う単位へ戻る", () => {
    // 1色で single に下がった状態から、5色の共有リンクを復元する
    resetColorStore(["#000000"]);
    expect(useColorStore.getState().unit).toBe("single");
    useColorStore
      .getState()
      .hydratePalette(["#111111", "#222222", "#333333", "#444444", "#555555"]);
    expect(useColorStore.getState().unit).toBe("pair");
  });

  it("復元した色数が足りなければ単位は下がる", () => {
    resetColorStore(["#000000", "#111111", "#222222"]);
    useColorStore.getState().setUnit("palette");
    useColorStore.getState().hydratePalette(["#111111"]);
    expect(useColorStore.getState().unit).toBe("single");
  });
});

describe("色数の上限", () => {
  beforeEach(() => resetColorStore());

  it("上限を超える追加は無視し、理由を通知する", () => {
    resetColorStore(
      Array.from(
        { length: MAX_PALETTE_COLORS },
        (_, i) => `#${i.toString(16).padStart(2, "0")}0000`,
      ),
    );
    useColorStore.getState().apply({ kind: "add", hex: "#ABCDEF" });
    expect(useColorStore.getState().palette).toHaveLength(MAX_PALETTE_COLORS);
    expect(useColorStore.getState().toast).toContain(
      String(MAX_PALETTE_COLORS),
    );
  });

  it("復元・全置換は上限で切り詰める", () => {
    const many = Array.from(
      { length: MAX_PALETTE_COLORS + 5 },
      () => "#123456",
    );
    useColorStore.getState().hydratePalette(many);
    expect(useColorStore.getState().palette).toHaveLength(MAX_PALETTE_COLORS);
    useColorStore.getState().apply({ kind: "replaceAll", hexes: many });
    expect(useColorStore.getState().palette).toHaveLength(MAX_PALETTE_COLORS);
  });
});
