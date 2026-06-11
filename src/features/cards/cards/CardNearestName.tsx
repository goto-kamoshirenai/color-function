"use client";

import { nearestName, parseHex } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor } from "../hooks";
import { useColorNames } from "@/lib/useColorNames";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { CardProps } from "../types";

/** 最寄り色名カード（v2: 30px 名前＋スウォッチ＋下端 ΔE 行）。 */
export function CardNearestName({ number }: CardProps) {
  const color = useSelectedColor();
  const names = useColorNames();
  const t = useT();
  const fmt = useFormatColor();
  const result = color
    ? nearestName(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }, names)
    : null;

  return (
    <CardFrame number={number} title={t("card.name.title")} helpKey="name">
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : !result ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.name.loading")}
        </p>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="mb-1.5 text-[30px] font-extrabold tracking-[-0.02em]">
            {result.entry.name}
          </div>
          <div className="mb-[18px] flex items-center gap-[9px]">
            <span
              className="border-border-strong rounded-control size-[18px] border"
              style={{ backgroundColor: result.entry.hex }}
              aria-hidden
            />
            <span className="text-text-2 font-mono text-[13px]">
              {fmt(result.entry.hex)}
            </span>
          </div>
          <div className="border-border mt-auto flex items-baseline justify-between border-t pt-3.5">
            <span className="text-text-2 text-meta font-mono">
              {t("card.name.deltaE")}
            </span>
            <span className="font-mono text-xl font-medium">
              {result.deltaE.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
