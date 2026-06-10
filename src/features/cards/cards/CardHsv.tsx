"use client";

import { parseHex, rgbToHsv } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor } from "../hooks";
import type { CardProps } from "../types";

const HUE_BAR =
  "linear-gradient(90deg,hsl(0 70% 55%),hsl(60 70% 55%),hsl(120 70% 55%),hsl(180 70% 55%),hsl(240 70% 55%),hsl(300 70% 55%),hsl(360 70% 55%))";

/** HSV カード（v2: H=色相グラデ＋マーカー、S/V=塗りつぶしバー）。 */
export function CardHsv({ number }: CardProps) {
  const color = useSelectedColor();
  const hsv = rgbToHsv(
    color
      ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
      : { r: 0, g: 0, b: 0 },
  );

  return (
    <CardFrame
      number={number}
      title="HSV"
      enLabel="Hue · Sat · Value"
      helpKey="hsv"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : (
        <div className="flex flex-col gap-[18px]">
          <div>
            <div className="mb-[7px] flex items-baseline justify-between">
              <span className="text-text-2 font-mono text-[11px]">
                H · 色相
              </span>
              <span className="font-mono text-[17px] font-medium">
                {Math.round(hsv.h)}°
              </span>
            </div>
            <div
              className="border-border relative h-[7px] border"
              style={{ background: HUE_BAR }}
            >
              <div
                className="bg-surface absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 border-2 border-(--ring)"
                style={{ left: `${((hsv.h / 360) * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
          {(
            [
              ["S · 彩度", hsv.s],
              ["V · 明度", hsv.v],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <div className="mb-[7px] flex items-baseline justify-between">
                <span className="text-text-2 font-mono text-[11px]">
                  {label}
                </span>
                <span className="font-mono text-[17px] font-medium">
                  {Math.round(value)}%
                </span>
              </div>
              <div className="bg-surface-3 border-border relative h-[7px] overflow-hidden border">
                <div
                  className="absolute inset-0 bg-(--text)"
                  style={{ width: `${value.toFixed(1)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </CardFrame>
  );
}
