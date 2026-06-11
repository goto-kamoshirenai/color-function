import { describe, it, expect, beforeEach } from "vitest";
import { useColorStore, resetColorStore } from "./useColorStore";

const get = () => useColorStore.getState();

describe("useColorStore", () => {
  beforeEach(() => resetColorStore(["#1F2933", "#2D6CDF", "#E4572E"]));

  it("既定状態（pair × verify, 参照IDが実在）", () => {
    const s = get();
    expect(s.unit).toBe("pair");
    expect(s.view).toBe("verify");
    expect(s.palette).toHaveLength(3);
    expect(s.fgId).toBe(s.palette[0].id);
    expect(s.bgId).toBe(s.palette[2].id);
    expect(s.accentId).toBe(s.palette[0].id);
  });

  describe("apply", () => {
    it("add で末尾に追加", () => {
      get().apply({ kind: "add", hex: "#ffffff" });
      const p = get().palette;
      expect(p).toHaveLength(4);
      expect(p[3].hex).toBe("#FFFFFF");
    });

    it("set で指定色を変更", () => {
      const id = get().palette[1].id;
      get().apply({ kind: "set", id, hex: "#000000" });
      expect(get().palette[1].hex).toBe("#000000");
    });

    it("remove 後に参照IDを補正（消えたfgは先頭へ）", () => {
      const fg = get().fgId!;
      get().apply({ kind: "remove", id: fg });
      const s = get();
      expect(s.palette).toHaveLength(2);
      expect(s.palette.some((c) => c.id === s.fgId)).toBe(true);
    });

    it("replaceAll で全消去すると参照IDは null", () => {
      get().apply({ kind: "replaceAll", hexes: [] });
      const s = get();
      expect(s.palette).toHaveLength(0);
      expect(s.fgId).toBeNull();
      expect(s.accentId).toBeNull();
    });

    it("reorder は order 通りに並べ替え", () => {
      const [a, b, c] = get().palette.map((x) => x.id);
      get().apply({ kind: "reorder", order: [c, a, b] });
      expect(get().palette.map((x) => x.id)).toEqual([c, a, b]);
    });
  });

  describe("selectSwatch（pair）", () => {
    it("bg をクリックで fg/bg 入替", () => {
      const before = get();
      const fg0 = before.fgId;
      const bg0 = before.bgId!;
      get().selectSwatch(bg0);
      const after = get();
      expect(after.fgId).toBe(bg0);
      expect(after.bgId).toBe(fg0);
    });
    it("他をクリックで fg に設定", () => {
      const mid = get().palette[1].id;
      get().selectSwatch(mid);
      expect(get().fgId).toBe(mid);
    });
  });

  describe("selectSwatch（design）", () => {
    it("設計ビューではペア単位でも selectedId（基準色）を更新する", () => {
      get().setView("design");
      const fg0 = get().fgId;
      const mid = get().palette[1].id;
      get().selectSwatch(mid);
      expect(get().selectedId).toBe(mid);
      expect(get().fgId).toBe(fg0); // FG/BG は変化しない
    });
  });

  it("setAccent でアクセント色を指定", () => {
    const id = get().palette[2].id;
    get().setAccent(id);
    expect(get().accentId).toBe(id);
  });

  describe("picker", () => {
    it("openAdd → commit で色が追加される", () => {
      get().openAdd();
      get().setPickerHex("#abcdef");
      get().commitPicker();
      const p = get().palette;
      expect(p[p.length - 1].hex).toBe("#ABCDEF");
      expect(get().picker.open).toBe(false);
    });
    it("openEdit → commit で対象色が変わる", () => {
      const id = get().palette[0].id;
      get().openEdit(id);
      get().setPickerHex("#123456");
      get().commitPicker();
      expect(get().palette[0].hex).toBe("#123456");
    });
  });

  describe("clear", () => {
    it("askClear → clearAll で空に", () => {
      get().askClear();
      expect(get().confirmOpen).toBe(true);
      get().clearAll();
      expect(get().palette).toHaveLength(0);
      expect(get().confirmOpen).toBe(false);
    });
  });
});
