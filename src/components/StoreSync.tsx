"use client";

import { useEffect } from "react";
import { useColorStore } from "@/store/useColorStore";
import { syncPaletteToHash, readPaletteFromHash } from "@/lib/urlState";
import { parseHex, toHex, ensureReadableAccent } from "@/core/color";

/**
 * 副作用同期（Reactステートは持たない）:
 *  - 起動時に URL ハッシュからパレット復元（docs/10 §3）
 *  - パレット変更を URL ハッシュへ反映
 *  - アクセント指定色 → a11y 補正 → `--accent` をルートへ注入（docs/10 §1.1）
 */
export function StoreSync() {
  useEffect(() => {
    const restored = readPaletteFromHash();
    if (restored) useColorStore.getState().hydratePalette(restored);

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

    const syncHash = () => {
      syncPaletteToHash(useColorStore.getState().palette.map((c) => c.hex));
    };

    applyAccent();
    syncHash();

    const unsub = useColorStore.subscribe(() => {
      applyAccent();
      syncHash();
    });
    window.addEventListener("cff-theme-change", applyAccent);

    return () => {
      unsub();
      window.removeEventListener("cff-theme-change", applyAccent);
    };
  }, []);

  return null;
}
