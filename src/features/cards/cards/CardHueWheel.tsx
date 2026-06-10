"use client";

import { parseHex, rgbToHsv } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import type { CardProps } from "../types";

const WHEEL =
  "conic-gradient(from -90deg,hsl(0 72% 55%),hsl(60 72% 55%),hsl(120 72% 55%),hsl(180 72% 55%),hsl(240 72% 55%),hsl(300 72% 55%),hsl(360 72% 55%))";

/** 色相環カード（v2: 208px ホイール＋パレットマーカー）。 */
export function CardHueWheel({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const selectedId = useColorStore((s) => s.selectedId);

  return (
    <CardFrame
      number={number}
      title="色相環"
      enLabel="Hue Wheel"
      helpKey="wheel"
    >
      <div
        role="img"
        aria-label="色相環。角度が色相、中心からの距離が彩度を表し、パレット各色の位置をマーカーで示す"
        className="border-border relative mx-auto mt-0.5 mb-2 size-[208px] rounded-full border"
        style={{ background: WHEEL }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle,var(--surface) 10%,transparent 64%)",
          }}
          aria-hidden
        />
        {palette.map((c) => {
          const v = rgbToHsv(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
          const ang = ((v.h - 90) * Math.PI) / 180;
          const rad = (v.s / 100) * 42;
          const sel = c.id === selectedId;
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${(50 + Math.cos(ang) * rad).toFixed(1)}%`,
                top: `${(50 + Math.sin(ang) * rad).toFixed(1)}%`,
                width: sel ? 18 : 12,
                height: sel ? 18 : 12,
                backgroundColor: c.hex,
                boxShadow: sel
                  ? "0 0 0 2px var(--surface),0 0 0 4px var(--ring)"
                  : "0 0 0 1.5px var(--surface)",
              }}
            />
          );
        })}
      </div>
      <p className="text-text-3 text-center font-mono text-[11px] tracking-[0.04em]">
        ANGLE = HUE / RADIUS = SATURATION
      </p>
    </CardFrame>
  );
}
