"use client";

import { useColorStore } from "@/store/useColorStore";

/** 現在の配色（URLハッシュに同期済み）を共有リンクとしてコピー（docs/10 §5）。 */
export function ShareButton() {
  const showToast = useColorStore((s) => s.showToast);

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("共有リンクをコピーしました");
    } catch {
      showToast("コピーに失敗しました");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="border-border text-text-2 hover:text-text rounded-md border px-2 py-1 text-xs transition-colors"
    >
      ↗ 共有リンク
    </button>
  );
}
