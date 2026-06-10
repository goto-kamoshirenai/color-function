"use client";

import { useColorStore, type Color } from "@/store/useColorStore";

/** 現在フォーカス中の単色（selectedId、無ければ先頭）。 */
export function useSelectedColor(): Color | null {
  return useColorStore(
    (s) => s.palette.find((c) => c.id === s.selectedId) ?? s.palette[0] ?? null,
  );
}

/** クリップボードコピー＋トースト。 */
export function useCopy(): (text: string) => void {
  const showToast = useColorStore((s) => s.showToast);
  return (text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // 失敗は無視
    }
    showToast("コピー: " + text);
  };
}
