"use client";

import type { DragEvent, KeyboardEvent } from "react";
import { Xmark, FillColor } from "iconoir-react";
import type { Color } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ColorCode } from "./ColorCode";

type Props = {
  color: Color;
  index: number;
  badge: "FG" | "BG" | "";
  highlighted: boolean;
  dimmed: boolean;
  isAccent: boolean;
  dragging: boolean;
  dropTarget: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onSetAccent: () => void;
  onDragStart: () => void;
  onDragEnterItem: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMove: (dir: -1 | 1) => void;
};

/**
 * v2 スウォッチ: 連番上・50px色面・FG/BGバッジ・×削除・HEXラベル=編集。
 * 色面そのものをドラッグして並べ替え（←→ キーでも移動）。並び順が役割割当の基準。
 */
export function Swatch({
  color,
  index,
  badge,
  highlighted,
  dimmed,
  isAccent,
  dragging,
  dropTarget,
  onSelect,
  onEdit,
  onRemove,
  onSetAccent,
  onDragStart,
  onDragEnterItem,
  onDrop,
  onDragEnd,
  onMove,
}: Props) {
  const t = useT();
  const fmt = useFormatColor();
  const n = index + 1;

  const handleDragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // Firefox はデータが無いと drag を開始しない
      e.dataTransfer.setData("text/plain", color.id);
    }
    onDragStart();
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onMove(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onMove(1);
    }
  };

  return (
    <div
      onDragEnter={onDragEnterItem}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={
        "rounded-panel relative flex flex-none flex-col items-center gap-[5px] transition-[box-shadow,opacity] " +
        (dragging ? "opacity-40 " : "") +
        (dropTarget ? "shadow-[inset_0_0_0_2px_var(--accent)]" : "")
      }
    >
      <span className="text-text-3 text-meta font-mono tracking-[0.1em]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative">
        <button
          type="button"
          draggable
          onDragStart={handleDragStart}
          onClick={onSelect}
          onDoubleClick={onEdit}
          onKeyDown={handleKeyDown}
          aria-label={t("swatch.select", {
            n,
            hex: fmt(color.hex),
            badge: badge ? ` (${badge})` : "",
          })}
          aria-pressed={highlighted}
          title={t("swatch.selectTitle")}
          className="border-border-strong rounded-panel block size-[50px] cursor-grab border p-0 active:cursor-grabbing"
          style={{
            backgroundColor: color.hex,
            // 非アクティブの減光は色面のみ（ラベルの可読性を保つ・a11y）
            opacity: dimmed ? 0.5 : 1,
            boxShadow: highlighted ? "var(--shadow-selected)" : "none",
          }}
        />
        {badge ? (
          <span className="rounded-control text-meta absolute -top-[7px] -left-1.5 bg-(--text) px-[5px] py-px font-mono font-semibold tracking-[0.05em] text-(--bg)">
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("swatch.remove", { n })}
          title={t("common.delete")}
          className="cff-control bg-surface text-text-2 hover:bg-surface-3 hover:text-text absolute -top-[7px] -right-[7px] flex size-[18px] items-center justify-center rounded-full p-0 before:absolute before:-inset-1.5 before:content-['']"
        >
          <Xmark width={12} height={12} strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onSetAccent}
          aria-label={t("swatch.accent", { n })}
          aria-pressed={isAccent}
          title={t("swatch.accentTitle")}
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
      {/* カラーコードはクリックでコピー（編集はスウォッチのダブルクリック） */}
      <ColorCode hex={color.hex} className="text-[12px] tracking-[0.02em]" />
    </div>
  );
}
