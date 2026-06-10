"use client";

import { parseHex, rgbToHsv } from "@/core/color";
import { useSelectedColor } from "../hooks";

function Meter({
  label,
  name,
  value,
  pct,
}: {
  label: string;
  name: string;
  value: string;
  pct: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-text-3 font-mono text-[10px] tracking-widest">
          {label} · {name}
        </span>
        <span className="text-text font-mono text-sm">{value}</span>
      </div>
      <div className="bg-surface-2 mt-1 h-1.5 rounded">
        <div
          className="bg-accent h-full rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CardHsv() {
  const color = useSelectedColor();
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;
  const hsv = rgbToHsv(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 });

  return (
    <div className="space-y-3">
      <Meter
        label="H"
        name="色相"
        value={`${Math.round(hsv.h)}°`}
        pct={(hsv.h / 360) * 100}
      />
      <Meter
        label="S"
        name="彩度"
        value={`${Math.round(hsv.s)}%`}
        pct={hsv.s}
      />
      <Meter
        label="V"
        name="明度"
        value={`${Math.round(hsv.v)}%`}
        pct={hsv.v}
      />
    </div>
  );
}
