"use client";

import { Xmark, FillColor } from "iconoir-react";
import type { Color } from "@/store/useColorStore";

type Props = {
  color: Color;
  index: number;
  badge: "FG" | "BG" | "";
  highlighted: boolean;
  dimmed: boolean;
  isAccent: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onSetAccent: () => void;
};

/** v2 スウォッチ: 連番上・50px色面・FG/BGバッジ・×削除・HEXラベル=編集。 */
export function Swatch({
  color,
  index,
  badge,
  highlighted,
  dimmed,
  isAccent,
  onSelect,
  onEdit,
  onRemove,
  onSetAccent,
}: Props) {
  return (
    <div className="relative flex flex-none flex-col items-center gap-[5px]">
      <span className="text-text-3 font-mono text-[11px] tracking-[0.1em]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={onSelect}
          onDoubleClick={onEdit}
          aria-label={`色 ${index + 1} ${color.hex}${badge ? ` (${badge})` : ""} を選択`}
          aria-pressed={highlighted}
          title="クリックで選択 / ダブルクリックで編集"
          className="border-border-strong block size-[50px] rounded-[3px] border p-0"
          style={{
            backgroundColor: color.hex,
            // 非アクティブの減光は色面のみ（ラベルの可読性を保つ・a11y）
            opacity: dimmed ? 0.5 : 1,
            boxShadow: highlighted
              ? "0 0 0 2px var(--surface),0 0 0 4px var(--ring)"
              : "none",
          }}
        />
        {badge ? (
          <span className="absolute -top-[7px] -left-1.5 rounded-[2px] bg-(--text) px-[5px] py-px font-mono text-[11px] font-semibold tracking-[0.05em] text-(--bg)">
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`色 ${index + 1} を削除`}
          title="削除"
          className="border-border-strong bg-surface text-text-2 hover:bg-surface-3 hover:text-text absolute -top-[7px] -right-[7px] flex size-[18px] items-center justify-center rounded-full border p-0 before:absolute before:-inset-1.5 before:content-['']"
        >
          <Xmark width={12} height={12} strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onSetAccent}
          aria-label={`色 ${index + 1} をアクセントに設定`}
          aria-pressed={isAccent}
          title="アクセントに設定（画面の差し色に反映）"
          className={
            "absolute -right-[7px] -bottom-[7px] flex size-[18px] items-center justify-center rounded-full border p-0 before:absolute before:-inset-1.5 before:content-[''] " +
            (isAccent
              ? "border-accent text-accent bg-surface"
              : "border-border-strong bg-surface text-text-3 hover:text-text")
          }
        >
          <FillColor width={12} height={12} strokeWidth={2} aria-hidden />
        </button>
        {isAccent ? (
          <span
            className="bg-accent absolute inset-x-1 -bottom-[3px] h-0.5 rounded"
            aria-hidden
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`色 ${index + 1} を編集`}
        title="クリックで編集"
        className="text-text-2 hover:text-text decoration-border-strong bg-transparent p-0 font-mono text-[12px] tracking-[0.02em] underline-offset-2 hover:underline"
      >
        {color.hex}
      </button>
    </div>
  );
}
