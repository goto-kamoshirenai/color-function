"use client";

import { useColorStore } from "@/store/useColorStore";

/**
 * 操作フィードバックのトースト（v2: 反転色＋左アクセント縁・モノ12px）。
 * ライブリージョンは常設し、内容だけ差し替える（SR が確実に読み上げるため）。
 */
export function Toast() {
  const toast = useColorStore((s) => s.toast);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[150px] left-1/2 z-40 -translate-x-1/2"
    >
      {toast ? (
        <div
          key={toast}
          className="border-l-accent rounded-[2px] border-l-[3px] bg-(--text) px-4 py-[9px] font-mono text-xs text-(--bg) shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
          style={{ animation: "cffToast 0.2s ease-out" }}
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
