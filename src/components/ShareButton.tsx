"use client";

import { useColorStore } from "@/store/useColorStore";

/** 現在の配色（URLハッシュに同期済み）を共有リンクとしてコピー（v2: ↗ SHARE）。 */
export function ShareButton() {
  const showToast = useColorStore((s) => s.showToast);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("共有リンクをコピーしました");
    } catch {
      showToast("コピーに失敗しました");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label="共有リンクをコピー"
      className="border-border-strong hover:bg-surface-2 inline-flex items-center gap-[7px] rounded-[2px] border bg-transparent px-[13px] py-2 font-mono text-[11px] tracking-[0.06em] whitespace-nowrap"
    >
      ↗ SHARE
    </button>
  );
}
