"use client";

import { Check } from "iconoir-react";
import { parseHex, confusablePairs } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 冗長性検出カード（ΔE00<10 の似すぎペアを列挙）。 */
export function CardRedundancy({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const pairs = confusablePairs(
    palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
    10,
  );

  return (
    <CardFrame
      number={number}
      title={t("card.redundancy.title")}
      enLabel="Redundancy"
      helpKey="redundancy"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : pairs.length === 0 ? (
        <p className="text-text-2 flex items-center gap-2 font-mono text-xs">
          <Check
            width={14}
            height={14}
            strokeWidth={2.5}
            className="text-accent"
            aria-hidden
          />
          {t("card.redundancy.ok")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pairs.map(({ i, j, value }) => (
            <li
              key={`${i}-${j}`}
              className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <span
                  className="border-border-strong size-4 rounded-[2px] border"
                  style={{ backgroundColor: palette[i].hex }}
                  aria-hidden
                />
                <span
                  className="border-border-strong size-4 rounded-[2px] border"
                  style={{ backgroundColor: palette[j].hex }}
                  aria-hidden
                />
                <span className="text-text-2 font-mono text-[12px]">
                  {String(i + 1).padStart(2, "0")} ×{" "}
                  {String(j + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="font-mono text-[12px] font-bold">
                ΔE {value.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}
