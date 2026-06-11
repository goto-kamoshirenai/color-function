"use client";

import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

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
