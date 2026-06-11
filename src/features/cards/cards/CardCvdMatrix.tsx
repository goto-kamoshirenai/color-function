"use client";

import { parseHex, cvdConfusablePairs, type CvdType } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const TYPES: { type: CvdType; nameKey: MessageKey }[] = [
  { type: "protan", nameKey: "card.cvd.protan" },
  { type: "deutan", nameKey: "card.cvd.deutan" },
  { type: "tritan", nameKey: "card.cvd.tritan" },
];

/** 色覚識別性カード（型ごとにシミュレーション後 ΔE00<10 のペアを列挙）。 */
export function CardCvdMatrix({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  return (
    <CardFrame
      number={number}
      title={t("card.cvdmatrix.title")}
      enLabel="CVD Distinct"
      helpKey="cvdmatrix"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {TYPES.map(({ type, nameKey }) => {
            const pairs = cvdConfusablePairs(rgbs, type, 10);
            return (
              <div
                key={type}
                className="border-border rounded-control border px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-semibold">
                    {t(nameKey)}
                  </span>
                  <span
                    className={
                      "text-meta font-mono " +
                      (pairs.length === 0 ? "text-text-3" : "font-bold")
                    }
                  >
                    {pairs.length === 0
                      ? t("card.cvdmatrix.ok")
                      : t("card.cvdmatrix.count", { n: pairs.length })}
                  </span>
                </div>
                {pairs.length > 0 ? (
                  <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                    {pairs.map(({ i, j, value }) => (
                      <li
                        key={`${i}-${j}`}
                        className="text-text-2 flex items-center gap-1.5 font-mono text-[12px]"
                      >
                        <span
                          className="border-border-strong size-3.5 rounded-[2px] border"
                          style={{ backgroundColor: palette[i].hex }}
                          aria-hidden
                        />
                        <span
                          className="border-border-strong size-3.5 rounded-[2px] border"
                          style={{ backgroundColor: palette[j].hex }}
                          aria-hidden
                        />
                        ΔE {value.toFixed(1)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </CardFrame>
  );
}
