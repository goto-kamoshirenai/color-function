"use client";

import { nearestName, parseHex } from "@/core/color";
import { useSelectedColor } from "../hooks";
import { useColorNames } from "@/lib/useColorNames";

export function CardNearestName() {
  const color = useSelectedColor();
  const names = useColorNames();
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;

  const result = nearestName(
    parseHex(color.hex) ?? { r: 0, g: 0, b: 0 },
    names,
  );
  if (!result) return <p className="text-text-3 text-xs">辞書を読み込み中…</p>;

  return (
    <div className="flex items-center gap-3">
      <span
        className="border-border size-10 shrink-0 rounded-md border"
        style={{ backgroundColor: result.entry.hex }}
        aria-hidden
      />
      <div>
        <p className="text-text text-lg">{result.entry.name}</p>
        <p className="text-text-3 font-mono text-[10px]">
          {result.entry.hex} · 色差 ΔE {result.deltaE.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
