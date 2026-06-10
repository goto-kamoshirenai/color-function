"use client";

import { parseHex, hueDistribution, paletteEntropy } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";

/** 色相 0–360° 軸上の分布＋エントロピー（docs/10 §4 / docs/04 F）。 */
export function CardHueDistribution() {
  const palette = useColorStore((s) => s.palette);
  if (palette.length === 0)
    return <p className="text-text-3 text-xs">色がありません</p>;

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
  const hues = hueDistribution(rgbs);
  const entropy = paletteEntropy(rgbs);

  return (
    <div>
      <div className="relative mt-2 h-8">
        <div
          className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded"
          style={{
            background:
              "linear-gradient(to right, hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%), hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))",
          }}
          aria-hidden
        />
        {palette.map((c, i) => (
          <span
            key={c.id}
            className="border-surface absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: `${(hues[i] / 360) * 100}%`,
              backgroundColor: c.hex,
            }}
            title={`${c.hex} · ${Math.round(hues[i])}°`}
          />
        ))}
      </div>
      <div className="text-text-3 mt-1 flex justify-between font-mono text-[10px]">
        <span>0°</span>
        <span>120°</span>
        <span>240°</span>
        <span>360°</span>
      </div>
      <p className="text-text-2 mt-3 text-xs">
        色相エントロピー{" "}
        <span className="text-text font-mono">{entropy.toFixed(2)}</span>
        <span className="text-text-3 ml-2 text-[10px]">
          点が散る=多彩 / 集まる=単調
        </span>
      </p>
    </div>
  );
}
