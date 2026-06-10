"use client";

import { parseHex, relativeLuminance, contrastRatio } from "@/core/color";
import { useSelectedColor } from "../hooks";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

export function CardLuminance() {
  const color = useSelectedColor();
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;
  const rgb = parseHex(color.hex) ?? BLACK;
  const lum = relativeLuminance(rgb);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-text font-mono text-2xl">{lum.toFixed(4)}</span>
        <span className="text-text-3 font-mono text-[10px]">
          0.0000 – 1.0000
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded bg-gradient-to-r from-black to-white">
        <div
          className="bg-accent h-full w-px"
          style={{ marginLeft: `${lum * 100}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="border-border rounded border px-2 py-1">
          <span className="text-text-3">対 白 </span>
          <span className="text-text font-mono">
            {contrastRatio(rgb, WHITE).toFixed(2)}:1
          </span>
        </div>
        <div className="border-border rounded border px-2 py-1">
          <span className="text-text-3">対 黒 </span>
          <span className="text-text font-mono">
            {contrastRatio(rgb, BLACK).toFixed(2)}:1
          </span>
        </div>
      </div>
    </div>
  );
}
