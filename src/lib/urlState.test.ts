import { describe, it, expect, beforeEach } from "vitest";
import {
  encodePalette,
  decodePalette,
  savePaletteToStorage,
  readPaletteFromStorage,
  readPaletteFromHash,
  syncPaletteToHash,
  PALETTE_STORAGE_KEY,
} from "./urlState";

describe("encodePalette / decodePalette", () => {
  it("#p= にカンマ連結・大文字HEX（# 抜き, docs/10 §3）", () => {
    expect(encodePalette(["#1f2933", "#2d6cdf"])).toBe("#p=1F2933,2D6CDF");
  });

  it("往復で元の色（大文字 # 付き）に戻る", () => {
    const hexes = ["#1F2933", "#2D6CDF", "#E4572E"];
    expect(decodePalette(encodePalette(hexes))).toEqual(hexes);
  });

  it("6桁HEX以外は除外する", () => {
    expect(decodePalette("#p=1F2933,zzz,2D6CDF")).toEqual([
      "#1F2933",
      "#2D6CDF",
    ]);
  });

  it("p= が無ければ null", () => {
    expect(decodePalette("#foo=bar")).toBeNull();
    expect(decodePalette("")).toBeNull();
  });

  it("有効な色が無ければ null", () => {
    expect(decodePalette("#p=zzz")).toBeNull();
  });
});

describe("localStorage への保持（保存）", () => {
  beforeEach(() => localStorage.clear());

  it("保存・復元の往復", () => {
    savePaletteToStorage(["#1F2933", "#2d6cdf"]);
    expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("1F2933,2D6CDF");
    expect(readPaletteFromStorage()).toEqual(["#1F2933", "#2D6CDF"]);
  });

  it("空配列はキーを削除する（次回は既定に戻る）", () => {
    savePaletteToStorage(["#1F2933"]);
    savePaletteToStorage([]);
    expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBeNull();
    expect(readPaletteFromStorage()).toBeNull();
  });

  it("不正な値は保存時に除外する", () => {
    savePaletteToStorage(["#1F2933", "zzz", "#12345"]);
    expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("1F2933");
  });

  it("壊れた保存値は null（既定にフォールバック）", () => {
    localStorage.setItem(PALETTE_STORAGE_KEY, "zzz,12");
    expect(readPaletteFromStorage()).toBeNull();
    localStorage.setItem(PALETTE_STORAGE_KEY, "");
    expect(readPaletteFromStorage()).toBeNull();
  });

  it("未設定は null", () => {
    expect(readPaletteFromStorage()).toBeNull();
  });
});

describe("URL ハッシュへの反映（共有）", () => {
  it("反映と読み出しの往復（履歴は汚さない）", () => {
    syncPaletteToHash(["#1F2933", "#2D6CDF"]);
    expect(window.location.hash).toBe("#p=1F2933,2D6CDF");
    expect(readPaletteFromHash()).toEqual(["#1F2933", "#2D6CDF"]);
  });

  it("ハッシュが無い・不正なら null", () => {
    window.location.hash = "";
    expect(readPaletteFromHash()).toBeNull();
    window.location.hash = "#p=zzz";
    expect(readPaletteFromHash()).toBeNull();
  });
});
