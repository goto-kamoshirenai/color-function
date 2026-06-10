"use client";

import { parseHex, toHex, generateTones } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import type { CardProps } from "../types";

/** トーン展開カード（v2: 64px 色面＋HEXフッターのチップ列）。 */
export function CardTone({ number }: CardProps) {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast("追加: " + hex);
  };

  return (
    <CardFrame
      number={number}
      title="トーン展開"
      enLabel="Tone Scale"
      helpKey="tone"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : (
        <div className="flex gap-[7px]">
          {generateTones(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
            .map((rgb) => toHex(rgb).toUpperCase())
            .map((hex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => add(hex)}
                aria-label={`トーン ${hex} をパレットに追加`}
                className="border-border-strong flex-1 overflow-hidden rounded-[2px] border bg-transparent p-0 transition-transform hover:-translate-y-0.5"
              >
                <div className="h-16" style={{ backgroundColor: hex }} />
                <div className="bg-surface text-text-2 px-1 py-1.5 text-center font-mono text-[9.5px]">
                  {hex}
                </div>
              </button>
            ))}
        </div>
      )}
    </CardFrame>
  );
}
