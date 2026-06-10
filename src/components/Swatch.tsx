"use client";

import { parseHex, contrastRatio } from "@/core/color";
import type { Color } from "@/store/useColorStore";

function labelColor(hex: string): string {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  return contrastRatio(rgb, white) >= contrastRatio(rgb, black)
    ? "#fff"
    : "#000";
}

type Props = {
  color: Color;
  index: number;
  badge: "FG" | "BG" | "";
  selected: boolean;
  isAccent: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onSetAccent: () => void;
};

export function Swatch({
  color,
  index,
  badge,
  selected,
  isAccent,
  onSelect,
  onEdit,
  onRemove,
  onSetAccent,
}: Props) {
  const fg = labelColor(color.hex);
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onSelect}
        onDoubleClick={onEdit}
        aria-label={`色 ${index + 1} ${color.hex}${badge ? ` (${badge})` : ""} を選択`}
        aria-pressed={selected}
        className="ring-offset-surface relative flex h-12 w-12 flex-col items-center justify-between rounded-md p-1 ring-offset-1"
        style={{
          backgroundColor: color.hex,
          boxShadow: selected
            ? "0 0 0 2px var(--surface), 0 0 0 4px var(--ring)"
            : "none",
        }}
      >
        <span
          className="self-start font-mono text-[9px] leading-none"
          style={{ color: fg }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {badge ? (
          <span
            className="self-end font-mono text-[9px] leading-none font-bold"
            style={{ color: fg }}
          >
            {badge}
          </span>
        ) : null}
        {isAccent ? (
          <span
            className="bg-accent absolute inset-x-1 bottom-1 h-0.5 rounded"
            aria-hidden
          />
        ) : null}
      </button>

      <div className="pointer-events-none absolute -top-2 -right-2 flex gap-0.5 opacity-0 transition-opacity group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
        <button
          type="button"
          onClick={onSetAccent}
          aria-label={`色 ${index + 1} をアクセントに設定`}
          aria-pressed={isAccent}
          className="border-border bg-surface text-text-2 hover:text-text flex size-4 items-center justify-center rounded-full border text-[9px]"
        >
          ◎
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`色 ${index + 1} を編集`}
          className="border-border bg-surface text-text-2 hover:text-text flex size-4 items-center justify-center rounded-full border text-[9px]"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`色 ${index + 1} を削除`}
          className="border-border bg-surface text-text-2 hover:text-text flex size-4 items-center justify-center rounded-full border text-[9px]"
        >
          ×
        </button>
      </div>
    </div>
  );
}
