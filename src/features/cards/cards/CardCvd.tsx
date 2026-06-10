"use client";

import {
  parseHex,
  toHex,
  simulateCvd,
  contrastRatio,
  type CvdType,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import type { CardProps } from "../types";

const TYPES: { type: CvdType; name: string; sub: string }[] = [
  { type: "protan", name: "P型 (1型)", sub: "Protanopia" },
  { type: "deutan", name: "D型 (2型)", sub: "Deuteranopia" },
  { type: "tritan", name: "T型 (3型)", sub: "Tritanopia" },
];

/** 色覚シミュレーションカード（v2: 行=名前120px＋サンプルバー38px＋比）。 */
export function CardCvd({ number }: CardProps) {
  const pair = usePairColors();

  return (
    <CardFrame number={number} title="色覚シミュレーション" helpKey="cvd">
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">
          ペアには2色以上が必要です
        </p>
      ) : (
        <div className="flex flex-col gap-[9px]">
          {TYPES.map(({ type, name, sub }) => {
            const fg = parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 };
            const bg = parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 };
            const simFg = simulateCvd(fg, type, 1);
            const simBg = simulateCvd(bg, type, 1);
            const ratio = contrastRatio(simFg, simBg);
            return (
              <div key={type} className="flex items-center gap-[13px]">
                <div className="w-[120px] flex-none">
                  <div className="text-[12.5px] font-semibold">{name}</div>
                  <div className="text-text-3 font-mono text-[9px]">{sub}</div>
                </div>
                <div
                  className="border-border-strong flex h-[38px] flex-1 items-center rounded-[2px] border px-[13px] text-[13px] font-bold"
                  style={{ backgroundColor: toHex(simBg), color: toHex(simFg) }}
                >
                  サンプル文字 Ag
                </div>
                <div className="w-[54px] flex-none text-right font-mono text-[13px] font-medium">
                  {ratio.toFixed(2)}:1
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardFrame>
  );
}
