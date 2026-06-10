"use client";

import { parseHex, rgbToHsl, rgbToHsv } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor, useCopy } from "../hooks";
import type { CardProps } from "../types";

const r0 = (n: number) => Math.round(n);

/** 色値カード（v2: 110px スウォッチ＋2×2 コピーグリッド）。 */
export function CardValue({ number }: CardProps) {
  const color = useSelectedColor();
  const copy = useCopy();

  const rgb = color
    ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);

  const cells = color
    ? [
        { label: "HEX", value: color.hex, copyText: color.hex },
        {
          label: "RGB",
          value: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
          copyText: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        },
        {
          label: "HSL",
          value: `${r0(hsl.h)}°, ${r0(hsl.s)}%, ${r0(hsl.l)}%`,
          copyText: `hsl(${r0(hsl.h)}, ${r0(hsl.s)}%, ${r0(hsl.l)}%)`,
        },
        {
          label: "HSV",
          value: `${r0(hsv.h)}°, ${r0(hsv.s)}%, ${r0(hsv.v)}%`,
          copyText: `hsv(${r0(hsv.h)}, ${r0(hsv.s)}%, ${r0(hsv.v)}%)`,
        },
      ]
    : [];

  return (
    <CardFrame
      number={number}
      title="色値"
      enLabel="Color Value"
      helpKey="value"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : (
        <>
          <div className="flex items-stretch gap-5">
            <div
              className="border-border-strong size-[110px] flex-none rounded-[2px] border"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <div className="bg-border border-border grid flex-1 grid-cols-2 gap-px overflow-hidden rounded-[2px] border">
              {cells.map((cell) => (
                <button
                  key={cell.label}
                  type="button"
                  onClick={() => copy(cell.copyText)}
                  className="bg-surface hover:bg-surface-2 px-3.5 py-[11px] text-left"
                >
                  <div className="text-text-3 mb-1 font-mono text-[9px] tracking-[0.14em] uppercase">
                    {cell.label}
                  </div>
                  <div className="font-mono text-lg font-medium tracking-[0.01em]">
                    {cell.value}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <p className="text-text-3 mt-[11px] font-mono text-[9.5px] tracking-[0.04em]">
            CLICK TO COPY — 値をクリックでコピー
          </p>
        </>
      )}
    </CardFrame>
  );
}
