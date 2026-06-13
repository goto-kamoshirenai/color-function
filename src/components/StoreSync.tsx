"use client";

import { useEffect, useLayoutEffect } from "react";
import { useColorStore } from "@/store/useColorStore";
import {
  syncPaletteToHash,
  readPaletteFromHash,
  readPaletteFromStorage,
  savePaletteToStorage,
} from "@/lib/urlState";
import { parseHex, toHex, ensureReadableAccent } from "@/core/color";

// 復元はペイント前（useLayoutEffect）に行い、既定パレットの一瞬の表示を防ぐ。
// SSR では useLayoutEffect が警告になるため useEffect に差し替える。
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * 副作用同期（Reactステートは持たない）:
 *  - 起動時に URL ハッシュからパレット復元（docs/10 §3）。ハッシュは
 *    サーバーへ送られず SSR は常に既定5色のため、復元完了までは
 *    ペイント前スクリプトが立てる data-palette-restore でスウォッチ列を隠す
 *  - パレット変更を URL ハッシュへ反映
 *  - アクセント指定色 → a11y 補正 → `--accent` をルートへ注入（docs/10 §1.1）
 */
export function StoreSync() {
  useIsomorphicLayoutEffect(() => {
    // 優先: URL ハッシュ → localStorage → 既定（hydrate しない）
    const restored = readPaletteFromHash() ?? readPaletteFromStorage();
    if (restored) useColorStore.getState().hydratePalette(restored);
    // 復元待ちカバーを解除（ハッシュが不正だった場合も含めて必ず）
    delete document.documentElement.dataset.paletteRestore;

    const applyAccent = () => {
      const { palette, accentId } = useColorStore.getState();
      const root = document.documentElement;
      const color = palette.find((c) => c.id === accentId);
      if (!color) {
        root.style.removeProperty("--accent");
        return;
      }
      const accent = parseHex(color.hex);
      if (!accent) return;
      const bgVar = getComputedStyle(root).getPropertyValue("--bg").trim();
      const bg = parseHex(bgVar) ?? { r: 255, g: 255, b: 255 };
      // アクセントは小さなテキスト（カード連番等）にも使うため AA 4.5:1 を基準に補正。
      root.style.setProperty(
        "--accent",
        toHex(ensureReadableAccent(accent, bg, 4.5)),
      );
    };

    const persist = () => {
      const hexes = useColorStore.getState().palette.map((c) => c.hex);
      syncPaletteToHash(hexes);
      savePaletteToStorage(hexes);
    };

    applyAccent();
    persist();

    const unsub = useColorStore.subscribe(() => {
      applyAccent();
      persist();
    });
    window.addEventListener("cff-theme-change", applyAccent);

    return () => {
      unsub();
      window.removeEventListener("cff-theme-change", applyAccent);
    };
  }, []);

  return null;
}
