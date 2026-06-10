"use client";

import { nearestName, parseHex } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor } from "../hooks";
import { useColorNames } from "@/lib/useColorNames";
import type { CardProps } from "../types";

/** 最寄り色名カード（v2: 30px 名前＋スウォッチ＋下端 ΔE 行）。 */
export function CardNearestName({ number }: CardProps) {
  const color = useSelectedColor();
  const names = useColorNames();
  const result = color
    ? nearestName(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }, names)
    : null;

  return (
    <CardFrame number={number} title="最寄り色名" helpKey="name">
      {!color ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : !result ? (
        <p className="text-text-3 font-mono text-xs">辞書を読み込み中…</p>
      ) : (
        <div className="flex h-full flex-col">
          <div className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">
            {result.entry.name}
          </div>
          <div className="mb-[18px] flex items-center gap-[9px]">
            <span
              className="border-border-strong size-[18px] rounded-[2px] border"
              style={{ backgroundColor: result.entry.hex }}
              aria-hidden
            />
            <span className="text-text-2 font-mono text-[13px]">
              {result.entry.hex}
            </span>
          </div>
          <div className="border-border mt-auto flex items-baseline justify-between border-t pt-3.5">
            <span className="text-text-2 font-mono text-[11px]">色差 ΔE</span>
            <span className="font-mono text-xl font-medium">
              {result.deltaE.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
