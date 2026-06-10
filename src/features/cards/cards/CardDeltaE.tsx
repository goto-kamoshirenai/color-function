"use client";

import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { usePairColors } from "../hooks";

/** CIEDE2000 の読み方の目安（docs/07 §7.3 に基づき再較正）。 */
function label(de: number): string {
  if (de < 1) return "ほぼ識別不能";
  if (de < 2) return "訓練された目で識別";
  if (de < 10) return "一見して違う";
  if (de < 50) return "明確に別色";
  return "非常に大きな差";
}

export function CardDeltaE() {
  const pair = usePairColors();
  if (!pair)
    return <p className="text-text-3 text-xs">ペアには2色以上が必要です</p>;

  const de = deltaE2000(
    rgbToLab(parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 }),
    rgbToLab(parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 }),
  );

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-text font-mono text-3xl">{de.toFixed(2)}</span>
        <span className="text-text-2 text-xs">{label(de)}</span>
      </div>
      <div className="bg-surface-2 mt-2 h-1.5 rounded">
        <div
          className="bg-accent h-full rounded"
          style={{ width: `${Math.min(100, de)}%` }}
        />
      </div>
      <div className="text-text-3 mt-1 flex justify-between font-mono text-[10px]">
        <span>0</span>
        <span>100+</span>
      </div>
    </div>
  );
}
