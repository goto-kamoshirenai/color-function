"use client";

import { parseHex, toHex, invertLightness } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

/** ダーク/ライト変換カード（OKLCH 明度反転で明暗モード版を生成）。 */
export function CardDarkLight({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const converted = palette.map((c) =>
    toHex(
      invertLightness(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
    ).toUpperCase(),
  );

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const replaceAll = () => {
    apply({ kind: "replaceAll", hexes: converted });
    showToast(t("card.darklight.applied"));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.darklight.title")}
      enLabel="Dark / Light"
      helpKey="darklight"
      rightSlot={
        palette.length > 0 ? (
          <button
            type="button"
            onClick={replaceAll}
            className="cff-control text-text-2 hover:text-text px-2.5 py-1.5 font-mono text-[12px] tracking-[0.04em] whitespace-nowrap"
          >
            {t("card.darklight.applyAll")}
          </button>
        ) : undefined
      }
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-[7px] sm:grid-cols-5">
          {converted.map((hex, i) => (
            <ScaleChip
              key={palette[i].id}
              hex={hex}
              label={String(i + 1).padStart(2, "0")}
              isBase={false}
              ariaLabel={t("toast.add", { hex: fmt(hex) })}
              onAdd={() => add(hex)}
            />
          ))}
        </div>
      )}
    </CardFrame>
  );
}
