import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { StoreSync } from "./StoreSync";
import { useColorStore, resetColorStore } from "@/store/useColorStore";
import { PALETTE_STORAGE_KEY } from "@/lib/urlState";

const hexes = () => useColorStore.getState().palette.map((c) => c.hex);

/** 副作用層（復元優先度・保存・アクセント注入・購読の絞り込み）。 */
describe("StoreSync", () => {
  beforeEach(() => {
    resetColorStore(["#080808", "#E83015"]);
    localStorage.clear();
    window.location.hash = "";
    document.documentElement.removeAttribute("style");
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.paletteRestore = "1";
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("復元", () => {
    it("URL ハッシュを localStorage より優先する", () => {
      localStorage.setItem(PALETTE_STORAGE_KEY, "112233,445566");
      window.location.hash = "#p=AABBCC,DDEEFF";
      render(<StoreSync />);
      expect(hexes()).toEqual(["#AABBCC", "#DDEEFF"]);
    });

    it("ハッシュが無ければ localStorage から復元する", () => {
      localStorage.setItem(PALETTE_STORAGE_KEY, "112233,445566");
      render(<StoreSync />);
      expect(hexes()).toEqual(["#112233", "#445566"]);
    });

    it("どちらも無ければ既定パレットのまま", () => {
      render(<StoreSync />);
      expect(hexes()).toEqual(["#080808", "#E83015"]);
    });

    it("復元待ちカバーは必ず解除する（ハッシュが不正でも）", () => {
      window.location.hash = "#p=zzz";
      render(<StoreSync />);
      expect(document.documentElement.dataset.paletteRestore).toBeUndefined();
    });
  });

  describe("共有リンクと保存の分離", () => {
    it("共有リンクを開くだけでは保存済み配色を上書きしない", () => {
      localStorage.setItem(PALETTE_STORAGE_KEY, "112233,445566");
      window.location.hash = "#p=AABBCC,DDEEFF";
      render(<StoreSync />);
      expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("112233,445566");
    });

    it("共有リンクを開いた後にユーザーが編集したら保存する", () => {
      vi.useFakeTimers();
      localStorage.setItem(PALETTE_STORAGE_KEY, "112233,445566");
      window.location.hash = "#p=AABBCC,DDEEFF";
      render(<StoreSync />);

      act(() => {
        useColorStore.getState().apply({ kind: "add", hex: "#123456" });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe(
        "AABBCC,DDEEFF,123456",
      );
    });

    it("localStorage 由来の復元では最初から保存してよい", () => {
      vi.useFakeTimers();
      localStorage.setItem(PALETTE_STORAGE_KEY, "112233");
      render(<StoreSync />);
      act(() => {
        useColorStore.getState().apply({ kind: "add", hex: "#123456" });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(localStorage.getItem(PALETTE_STORAGE_KEY)).toBe("112233,123456");
    });
  });

  describe("購読の絞り込み", () => {
    it("配色と無関係な更新では URL も保存も触らない", () => {
      vi.useFakeTimers();
      render(<StoreSync />);
      const replaceState = vi.spyOn(window.history, "replaceState");
      const setItem = vi.spyOn(Storage.prototype, "setItem");

      act(() => {
        useColorStore.getState().showToast("メッセージ");
        useColorStore.getState().openAdd();
        useColorStore.getState().setPickerHsv({ h: 100 });
        useColorStore.getState().setPickerHsv({ h: 120 });
        useColorStore.getState().setView("design");
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(replaceState).not.toHaveBeenCalled();
      expect(setItem).not.toHaveBeenCalled();
    });

    it("色の変更は 1 回にまとめて反映する（デバウンス）", () => {
      vi.useFakeTimers();
      render(<StoreSync />);
      const replaceState = vi.spyOn(window.history, "replaceState");

      act(() => {
        const id = useColorStore.getState().palette[0].id;
        useColorStore.getState().apply({ kind: "set", id, hex: "#111111" });
        useColorStore.getState().apply({ kind: "set", id, hex: "#222222" });
        useColorStore.getState().apply({ kind: "set", id, hex: "#333333" });
      });
      expect(replaceState).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(replaceState).toHaveBeenCalledTimes(1);
      expect(window.location.hash).toBe("#p=333333,E83015");
    });
  });

  describe("アクセント注入", () => {
    it("アクセント色を a11y 補正して --accent に注入する", () => {
      render(<StoreSync />);
      const accent =
        document.documentElement.style.getPropertyValue("--accent");
      expect(accent).toMatch(/^#[0-9a-f]{6}$/);
    });

    it("テーマ変更時は次フレームでも再補正する（旧背景基準を残さない）", () => {
      render(<StoreSync />);
      const before =
        document.documentElement.style.getPropertyValue("--accent");

      const raf = vi.spyOn(window, "requestAnimationFrame");
      act(() => {
        document.documentElement.dataset.theme = "dark";
        window.dispatchEvent(new Event("cff-theme-change"));
      });
      expect(raf).toHaveBeenCalled();
      expect(
        document.documentElement.style.getPropertyValue("--accent"),
      ).toMatch(/^#[0-9a-f]{6}$/);
      expect(before).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});
