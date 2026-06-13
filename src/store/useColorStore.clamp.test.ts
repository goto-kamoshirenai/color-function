import { describe, it, expect, beforeEach } from "vitest";
import { useColorStore, resetColorStore } from "./useColorStore";

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
});
