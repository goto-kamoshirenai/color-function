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

/** 永続化のデバウンス（ピッカードラッグ中の replaceState / setItem 連打を抑える）。 */
const PERSIST_DEBOUNCE_MS = 150;

/**
 * 副作用同期（Reactステートは持たない）:
 *  - 起動時に URL ハッシュ → localStorage の順でパレット復元（docs/10 §3）。
 *    ハッシュはサーバーへ送られず SSR は常に既定色のため、復元完了までは
 *    ペイント前スクリプトが立てる data-palette-restore で画面を隠す
 *  - パレット変更を URL ハッシュ（共有）と localStorage（保存）へ反映
 *  - アクセント指定色 → a11y 補正 → `--accent` をルートへ注入（docs/10 §1.1）
 *
 * 重要な取り決め:
 *  - **共有リンク（#p=）で開いたときは、ユーザーが編集するまで localStorage を
 *    書き換えない**。他人のリンクを開くだけで自分の保存配色が消えるのを防ぐ
 *    （共有=URL / 保存=localStorage の分離を保つ）。
 *  - 購読は「配色（HEX 列）とアクセント指定」の変化だけに絞る。トーストや
 *    ピッカーのドラッグなど配色と無関係な更新で replaceState / setItem /
 *    getComputedStyle（強制レイアウト）を走らせない。
 */
export function StoreSync() {
  useIsomorphicLayoutEffect(() => {
    const fromHash = readPaletteFromHash();
    const restored = fromHash ?? readPaletteFromStorage();
    if (restored) useColorStore.getState().hydratePalette(restored);
    // 復元待ちカバーを解除（ハッシュが不正だった場合も含めて必ず）
    delete document.documentElement.dataset.paletteRestore;

    // 共有リンク由来の復元では、ユーザー編集が入るまで保存しない
    let storageWritable = fromHash === null;

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

    // テーマ切替直後は data-theme 変更が style 再計算に反映されている保証がない。
    // 同期で一度当ててから、次フレームで（確実に新しい --bg で）再補正する。
    let raf = 0;
    const applyAccentAfterTheme = () => {
      applyAccent();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(applyAccent);
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const persistNow = (hexes: string[]) => {
      syncPaletteToHash(hexes);
      if (storageWritable) savePaletteToStorage(hexes);
    };
    const persistDebounced = (hexes: string[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        persistNow(hexes);
      }, PERSIST_DEBOUNCE_MS);
    };

    /** 配色として意味のある状態（これが変わったときだけ副作用を走らせる）。 */
    const paletteKey = () => {
      const { palette, accentId } = useColorStore.getState();
      return `${palette.map((c) => c.hex).join(",")}|${accentId ?? ""}`;
    };

    applyAccent();
    // 起動直後の反映は待たない（共有リンクを開いた直後の URL 整形も含む）
    persistNow(useColorStore.getState().palette.map((c) => c.hex));

    let prevKey = paletteKey();
    const unsub = useColorStore.subscribe(() => {
      const key = paletteKey();
      if (key === prevKey) return;
      const prevHexes = prevKey.split("|")[0];
      prevKey = key;
      // ここへ来るのはユーザー操作による配色変更なので、以降は保存してよい
      storageWritable = true;
      applyAccent();
      const hexes = useColorStore.getState().palette.map((c) => c.hex);
      // 色自体が変わっていないアクセント指定のみの変更では URL/保存は不要
      if (hexes.join(",") !== prevHexes) persistDebounced(hexes);
    });
    window.addEventListener("cff-theme-change", applyAccentAfterTheme);

    return () => {
      unsub();
      window.removeEventListener("cff-theme-change", applyAccentAfterTheme);
      cancelAnimationFrame(raf);
      // 未反映の永続化を取りこぼさない
      if (timer !== undefined) {
        clearTimeout(timer);
        persistNow(useColorStore.getState().palette.map((c) => c.hex));
      }
    };
  }, []);

  return null;
}
