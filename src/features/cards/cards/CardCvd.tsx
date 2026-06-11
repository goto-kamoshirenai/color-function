"use client";

import {
  parseHex,
  toHex,
  simulateCvd,
  contrastRatio,
  type CvdType,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const TYPES: { type: CvdType; nameKey: MessageKey; sub: string }[] = [
  { type: "protan", nameKey: "card.cvd.protan", sub: "Protanopia" },
  { type: "deutan", nameKey: "card.cvd.deutan", sub: "Deuteranopia" },
  { type: "tritan", nameKey: "card.cvd.tritan", sub: "Tritanopia" },
];

/** 色覚シミュレーションカード（v2: 行=名前120px＋サンプルバー38px＋比）。 */
export function CardCvd({ number }: CardProps) {
  const pair = usePairColors();
  const t = useT();

  return (
    <CardFrame number={number} title={t("card.cvd.title")} helpKey="cvd">
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="flex flex-col gap-[9px]">
          {TYPES.map(({ type, nameKey, sub }) => {
            const fg = parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 };
            const bg = parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 };
            const simFg = simulateCvd(fg, type, 1);
            const simBg = simulateCvd(bg, type, 1);
            const ratio = contrastRatio(simFg, simBg);
            return (
              <div
                key={type}
                className="flex items-center gap-2.5 sm:gap-[13px]"
              >
                <div className="w-[96px] flex-none sm:w-[120px]">
                  <div className="text-control font-semibold">{t(nameKey)}</div>
                  <div className="text-text-3 text-meta font-mono">{sub}</div>
                </div>
                <div
                  className="border-border-strong rounded-control flex h-[38px] flex-1 items-center border px-[13px] text-[13px] font-bold"
                  style={{ backgroundColor: toHex(simBg), color: toHex(simFg) }}
                >
                  {t("card.cvd.sample")}
                </div>
                <div className="w-[54px] flex-none text-right font-mono text-[13px] font-medium">
                  {ratio.toFixed(2)}:1
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CardFrame>
  );
}
