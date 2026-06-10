"use client";

import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import type { CardProps } from "../types";

/** CIEDE2000 の読み方の目安（docs/07 §7.3 に基づき再較正）。 */
function label(de: number): string {
  if (de < 1) return "ほぼ識別不能";
  if (de < 2) return "訓練された目で識別";
  if (de < 10) return "一見して違う";
  if (de < 50) return "明確に別色";
  return "非常に大きな差";
}

/** 色差 ΔE カード（v2: 48px モノ数値＋太字ラベル＋下端バー）。 */
export function CardDeltaE({ number }: CardProps) {
  const pair = usePairColors();
  const de = pair
    ? deltaE2000(
        rgbToLab(parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 }),
        rgbToLab(parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 }),
      )
    : 0;

  return (
    <CardFrame number={number} title="色差 ΔE" helpKey="deltae">
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">
          ペアには2色以上が必要です — 下の ＋ から色を追加
        </p>
      ) : (
        <div className="flex h-full flex-col">
          <div className="font-mono text-5xl leading-none font-medium tracking-[-0.03em]">
            {de.toFixed(2)}
          </div>
          <div className="mt-2.5 mb-4 text-[13px] font-bold">{label(de)}</div>
          <div className="bg-surface-3 border-border relative mt-auto h-[7px] overflow-hidden border">
            <div
              className="absolute inset-0 bg-(--text)"
              style={{ width: `${Math.min(100, de).toFixed(0)}%` }}
            />
          </div>
          <div className="text-text-3 mt-[5px] flex justify-between font-mono text-[11px]">
            <span>0</span>
            <span>100+</span>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
