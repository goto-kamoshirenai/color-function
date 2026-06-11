"use client";

import { useFormatColor } from "@/lib/colorFormat";

/**
 * トーン展開・色相シフト共通のチップ（クリックでパレットに追加）。
 * 色面＋フッター2行（段階ラベル / カラーコード）。コードは表示形式に追従。
 */
export function ScaleChip({
  hex,
  label,
  isBase,
  ariaLabel,
  onAdd,
}: {
  hex: string;
  label: string;
  isBase: boolean;
  ariaLabel: string;
  onAdd: () => void;
}) {
  const fmt = useFormatColor();
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={ariaLabel}
      className="border-border-strong rounded-control overflow-hidden border bg-transparent p-0 transition-transform hover:-translate-y-0.5"
    >
      <div className="h-10" style={{ backgroundColor: hex }} />
      <div className="bg-surface px-1 py-1 text-center">
        <div
          className={
            "text-meta font-mono font-semibold " + (isBase ? "text-accent" : "")
          }
        >
          {label}
        </div>
        <div className="text-text-2 text-meta truncate font-mono">
          {fmt(hex)}
        </div>
      </div>
    </button>
  );
}
