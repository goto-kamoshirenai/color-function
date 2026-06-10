"use client";

import { Fragment } from "react";
import { parseHex, hueDistribution, paletteEntropy } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import type { CardProps } from "../types";

const HUE_BAR =
  "linear-gradient(90deg,hsl(0 70% 55%),hsl(60 70% 55%),hsl(120 70% 55%),hsl(180 70% 55%),hsl(240 70% 55%),hsl(300 70% 55%),hsl(360 70% 55%))";

/** 色相分布カード（v2: 46px グラデ帯＋縦リング線＋ドット）。 */
export function CardHueDistribution({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
  const hues = hueDistribution(rgbs);
  const entropy = paletteEntropy(rgbs);

  return (
    <CardFrame number={number} title="色相分布" helpKey="huedist">
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : (
        <>
          <div
            className="border-border relative h-[46px] rounded-[2px] border"
            style={{ background: HUE_BAR }}
          >
            {palette.map((c, i) => {
              const left = `${((hues[i] / 360) * 100).toFixed(1)}%`;
              return (
                <Fragment key={c.id}>
                  <div
                    className="absolute -top-1.5 -bottom-1.5 w-0.5 -translate-x-1/2 bg-(--ring)"
                    style={{ left }}
                  />
                  <div
                    className="border-surface absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1.5px_var(--ring)]"
                    style={{ left, backgroundColor: c.hex }}
                    title={`${c.hex} · ${Math.round(hues[i])}°`}
                  />
                </Fragment>
              );
            })}
          </div>
          <div className="text-text-3 mt-[9px] flex justify-between font-mono text-[9px]">
            <span>0°</span>
            <span>120°</span>
            <span>240°</span>
            <span>360°</span>
          </div>
          <div className="border-border mt-4 flex items-baseline justify-between border-t pt-3">
            <span className="text-text-2 font-mono text-[11px]">
              色相エントロピー
            </span>
            <span className="font-mono text-base font-medium">
              {entropy.toFixed(2)}
            </span>
          </div>
        </>
      )}
    </CardFrame>
  );
}
