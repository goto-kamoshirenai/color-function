"use client";

import { parseHex, rgbToHsv } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";

const HUE_GRADIENT =
  "conic-gradient(from 0deg, hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%), hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))";

export function CardHueWheel() {
  const palette = useColorStore((s) => s.palette);
  const selectedId = useColorStore((s) => s.selectedId);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative size-44 rounded-full"
        style={{ background: HUE_GRADIENT }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--surface) 8%, transparent 62%)",
          }}
          aria-hidden
        />
        {palette.map((c) => {
          const v = rgbToHsv(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
          const ang = ((v.h - 90) * Math.PI) / 180;
          const rad = (v.s / 100) * 42;
          const left = 50 + Math.cos(ang) * rad;
          const top = 50 + Math.sin(ang) * rad;
          const sel = c.id === selectedId;
          return (
            <span
              key={c.id}
              className="border-surface absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: sel ? 18 : 12,
                height: sel ? 18 : 12,
                backgroundColor: c.hex,
                boxShadow: sel ? "0 0 0 2px var(--ring)" : "none",
              }}
            />
          );
        })}
      </div>
      <p className="text-text-3 font-mono text-[10px]">
        角度 = 色相 / 中心からの距離 = 彩度
      </p>
    </div>
  );
}
