"use client";

import { parseHex, toHex, rgbToHsv, hsvToRgb } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

const clamp = (v: number) => Math.max(4, Math.min(100, v));
const S_OFFSETS = [-30, 0, 30];
const V_OFFSETS = [-30, -15, 0, 15, 30];

/** 明度・彩度バリエーションカード（S×V を振った 3×5 の派生）。 */
export function CardLsVariations({ number }: CardProps) {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const base = color
    ? rgbToHsv(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : null;

  return (
    <CardFrame
      number={number}
      title={t("card.lsvar.title")}
      enLabel="S/V Variations"
      helpKey="lsvar"
    >
      {!color || !base ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-[7px]">
          {S_OFFSETS.map((ds) => (
            <div key={ds} className="grid grid-cols-3 gap-[7px] sm:grid-cols-5">
              {V_OFFSETS.map((dv) => {
                const s = clamp(base.s + ds);
                const v = clamp(base.v + dv);
                const hex = toHex(hsvToRgb({ h: base.h, s, v })).toUpperCase();
                const isBase = ds === 0 && dv === 0;
                const label = isBase
                  ? "BASE"
                  : `S${Math.round(s)} V${Math.round(v)}`;
                return (
                  <ScaleChip
                    key={`${ds}-${dv}`}
                    hex={hex}
                    label={label}
                    isBase={isBase}
                    ariaLabel={t("card.lsvar.add", {
                      label,
                      hex: fmt(hex),
                    })}
                    onAdd={() => add(hex)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </CardFrame>
  );
}
