"use client";

import { useColorStore } from "@/store/useColorStore";

/** 操作フィードバックのトースト（v2: 反転色＋左アクセント縁・モノ12px）。 */
export function Toast() {
  const toast = useColorStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-l-accent pointer-events-none fixed bottom-[150px] left-1/2 z-40 -translate-x-1/2 rounded-[2px] border-l-[3px] bg-(--text) px-4 py-[9px] font-mono text-xs text-(--bg) shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
      style={{ animation: "cffToast 0.2s ease-out" }}
    >
      {toast}
    </div>
  );
}
