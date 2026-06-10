"use client";

import {
  parseHex,
  toHex,
  simulateCvd,
  contrastRatio,
  type CvdType,
} from "@/core/color";
import { usePairColors } from "../hooks";

const TYPES: { type: CvdType; name: string; sub: string }[] = [
  { type: "protan", name: "P型 (1型)", sub: "Protanopia" },
  { type: "deutan", name: "D型 (2型)", sub: "Deuteranopia" },
  { type: "tritan", name: "T型 (3型)", sub: "Tritanopia" },
];

export function CardCvd() {
  const pair = usePairColors();
  if (!pair)
    return <p className="text-text-3 text-xs">ペアには2色以上が必要です</p>;

  const fg = parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 };
  const bg = parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 };

  return (
    <div className="space-y-2">
      {TYPES.map(({ type, name, sub }) => {
        const simFg = simulateCvd(fg, type, 1);
        const simBg = simulateCvd(bg, type, 1);
        const ratio = contrastRatio(simFg, simBg);
        return (
          <div
            key={type}
            className="border-border flex items-center gap-3 rounded border p-2"
          >
            <div className="w-28 shrink-0">
              <p className="text-text text-xs">{name}</p>
              <p className="text-text-3 font-mono text-[9px]">{sub}</p>
            </div>
            <div
              className="flex flex-1 items-center justify-center rounded px-3 py-2"
              style={{ backgroundColor: toHex(simBg) }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: toHex(simFg) }}
              >
                サンプル文字 Ag
              </span>
            </div>
            <span className="text-text-2 w-16 text-right font-mono text-xs">
              {ratio.toFixed(2)}:1
            </span>
          </div>
        );
      })}
    </div>
  );
}
