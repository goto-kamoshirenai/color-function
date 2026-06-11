"use client";

import { parseHex, toHex, generateTones } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

/** トーン展開カード（MUI 流の 50〜900・10段階。500=基準色）。 */
export function CardTone({ number }: CardProps) {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.tone.title")}
      enLabel="Tone Scale"
      helpKey="tone"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-[7px] sm:grid-cols-5">
          {generateTones(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }).map(
            ({ step, rgb }) => {
              const hex = toHex(rgb).toUpperCase();
              return (
                <ScaleChip
                  key={step}
                  hex={hex}
                  label={String(step)}
                  isBase={step === 500}
                  ariaLabel={t("card.tone.add", { step, hex: fmt(hex) })}
                  onAdd={() => add(hex)}
                />
              );
            },
          )}
        </div>
      )}
    </CardFrame>
  );
}
