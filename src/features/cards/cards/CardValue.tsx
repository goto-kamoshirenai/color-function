"use client";

import { parseHex, rgbToHsl, rgbToHsv } from "@/core/color";
import { useSelectedColor, useCopy } from "../hooks";

const r0 = (n: number) => Math.round(n);

export function CardValue() {
  const color = useSelectedColor();
  const copy = useCopy();
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;

  const rgb = parseHex(color.hex) ?? { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);

  const rows = [
    { label: "HEX", value: color.hex },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    { label: "HSL", value: `${r0(hsl.h)}°, ${r0(hsl.s)}%, ${r0(hsl.l)}%` },
    { label: "HSV", value: `${r0(hsv.h)}°, ${r0(hsv.s)}%, ${r0(hsv.v)}%` },
  ];

  return (
    <div className="space-y-1">
      {rows.map((row) => (
        <button
          key={row.label}
          type="button"
          onClick={() => copy(row.value)}
          className="hover:bg-surface-2 flex w-full items-center justify-between gap-3 rounded px-2 py-1 text-left"
        >
          <span className="text-text-3 font-mono text-[10px] tracking-widest">
            {row.label}
          </span>
          <span className="text-text font-mono text-sm">{row.value}</span>
        </button>
      ))}
      <p className="text-text-3 pt-1 text-[10px]">値をクリックでコピー</p>
    </div>
  );
}
