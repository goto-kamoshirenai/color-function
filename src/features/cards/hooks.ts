"use client";

import { useColorStore, type Color } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** 現在フォーカス中の単色（selectedId、無ければ先頭）。 */
export function useSelectedColor(): Color | null {
  return useColorStore(
    (s) => s.palette.find((c) => c.id === s.selectedId) ?? s.palette[0] ?? null,
  );
}

/** ペアの前景/背景色（fgId/bgId、無ければ先頭/末尾にフォールバック）。 */
export function usePairColors(): { fg: Color; bg: Color } | null {
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  if (palette.length < 2) return null;
  const fg = palette.find((c) => c.id === fgId) ?? palette[0];
  const bg = palette.find((c) => c.id === bgId) ?? palette[palette.length - 1];
  return { fg, bg };
}

/** クリップボードコピー＋トースト。 */
export function useCopy(): (text: string) => void {
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  return (text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
      // 失敗は無視
    }
    showToast(t("toast.copy", { text }));
  };
}
