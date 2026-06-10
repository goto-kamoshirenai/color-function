"use client";

import { parseHex, relativeLuminance, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor } from "../hooks";
import type { CardProps } from "../types";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

/** 相対輝度カード（v2: 42px モノ数値＋黒→白バー＋対白/対黒セル）。 */
export function CardLuminance({ number }: CardProps) {
  const color = useSelectedColor();
  const rgb = color ? (parseHex(color.hex) ?? BLACK) : BLACK;
  const lum = relativeLuminance(rgb);

  return (
    <CardFrame number={number} title="相対輝度" helpKey="luminance">
      {!color ? (
        <p className="text-text-3 font-mono text-xs">
          色がありません — 下の ＋ から追加してください
        </p>
      ) : (
        <div className="flex h-full flex-col">
          <div className="font-mono text-[42px] leading-none font-medium tracking-[-0.03em]">
            {lum.toFixed(4)}
          </div>
          <div className="text-text-3 mt-1.5 mb-3.5 font-mono text-[11px] tracking-[0.04em]">
            0.0000 – 1.0000
          </div>
          <div className="border-border-strong relative mb-4 h-[7px] border bg-gradient-to-r from-black to-white">
            <div
              className="absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 border-2 border-(--ring)"
              style={{
                left: `${(lum * 100).toFixed(1)}%`,
                backgroundColor: color.hex,
              }}
            />
          </div>
          <div className="bg-border border-border mt-auto grid grid-cols-2 gap-px border">
            {(
              [
                ["対 白", contrastRatio(rgb, WHITE)],
                ["対 黒", contrastRatio(rgb, BLACK)],
              ] as const
            ).map(([label, ratio]) => (
              <div key={label} className="bg-surface px-2.5 py-2">
                <div className="text-text-3 mb-0.5 font-mono text-[11px] tracking-[0.1em] uppercase">
                  {label}
                </div>
                <div className="font-mono text-sm font-medium">
                  {ratio.toFixed(2)}:1
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
