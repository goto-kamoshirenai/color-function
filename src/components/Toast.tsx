"use client";

import { useColorStore } from "@/store/useColorStore";

/** 操作フィードバックのトースト（docs/10 §5）。 */
export function Toast() {
  const toast = useColorStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-border bg-surface text-text pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border px-4 py-2 text-xs shadow-lg"
      style={{ animation: "cffToast 0.2s ease-out" }}
    >
      {toast}
    </div>
  );
}
