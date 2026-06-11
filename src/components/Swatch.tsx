"use client";

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
  const t = useT();
  const fmt = useFormatColor();
  const n = index + 1;
  return (
    <div className="relative flex flex-none flex-col items-center gap-[5px]">
      <span className="text-text-3 text-meta font-mono tracking-[0.1em]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={onSelect}
          onDoubleClick={onEdit}
          aria-label={t("swatch.select", {
            n,
            hex: fmt(color.hex),
            badge: badge ? ` (${badge})` : "",
          })}
          aria-pressed={highlighted}
          title={t("swatch.selectTitle")}
          className="border-border-strong rounded-panel block size-[50px] border p-0"
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
