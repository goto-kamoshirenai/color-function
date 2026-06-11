"use client";

import { parseHex, toHex, suggestGapFill } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

/** 不足色の補完提案カード（色相環の最大の隙間を埋める色）。 */
export function CardComplement({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const fill = suggestGapFill(
    palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
  );
  const hex = fill ? toHex(fill).toUpperCase() : null;

  const add = () => {
    if (!hex) return;
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.complement.title")}
      enLabel="Gap Fill"
      helpKey="complement"
    >
      {!hex ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.complement.tooFew")}
        </p>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-text-2 text-[13px] leading-[1.6]">
            {t("card.complement.lead")}
          </p>
          <div className="mt-auto grid grid-cols-3">
            <ScaleChip
              hex={hex}
              label={t("card.complement.label")}
              isBase={false}
              ariaLabel={t("toast.add", { hex: fmt(hex) })}
              onAdd={add}
            />
          </div>
        </div>
      )}
    </CardFrame>
  );
}
