"use client";

import { parseHex, toHex, generateHueShifts } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

const offsetLabel = (offset: number) =>
  offset === 0 ? "BASE" : `${offset > 0 ? "+" : ""}${offset}°`;

/** 色相シフトカード（OKLCH で色相のみ段階回転。アクセント検討用）。 */
export function CardHueShift({ number }: CardProps) {
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
      title={t("card.hueshift.title")}
      enLabel="Hue Shift"
      helpKey="hueshift"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="grid grid-cols-4 gap-[7px] md:grid-cols-6">
          {generateHueShifts(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }).map(
            ({ offset, rgb }) => {
              const hex = toHex(rgb).toUpperCase();
              return (
                <ScaleChip
                  key={offset}
                  hex={hex}
                  label={offsetLabel(offset)}
                  isBase={offset === 0}
                  ariaLabel={t("card.hueshift.add", {
                    offset: offsetLabel(offset),
                    hex: fmt(hex),
                  })}
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
