"use client";

import { parseHex, apcaContrast, apcaUsage } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const USAGE_KEY = {
  body: "card.apca.body",
  large: "card.apca.large",
  ui: "card.apca.ui",
  fail: "card.apca.fail",
} as const satisfies Record<string, MessageKey>;

/** APCA コントラストカード（WCAG 3 ドラフト系 Lc 値）。 */
export function CardApca({ number }: CardProps) {
  const pair = usePairColors();
  const t = useT();

  const lc = pair
    ? apcaContrast(
        parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 },
        parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 },
      )
    : 0;
  const usage = apcaUsage(lc);
  const abs = Math.abs(lc);

  return (
    <CardFrame
      number={number}
      title={t("card.apca.title")}
      enLabel="APCA"
      helpKey="apca"
    >
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-4xl leading-none font-medium tracking-[-0.03em] sm:text-5xl">
              {lc.toFixed(1)}
            </span>
            <span className="text-accent font-mono text-[15px] font-medium">
              Lc
            </span>
          </div>
          <div className="mt-2.5 mb-4 text-[13px] font-bold">
            {t(USAGE_KEY[usage])}
          </div>
          <div className="bg-surface-3 border-border relative mt-auto h-[7px] overflow-hidden border">
            <div
              className="absolute inset-0 bg-(--text)"
              style={{
                width: `${Math.min(100, (abs / 106) * 100).toFixed(0)}%`,
              }}
            />
            {/* 本文目安 Lc75 のしきい線 */}
            <div
              className="bg-accent absolute inset-y-0 w-0.5"
              style={{ left: `${((75 / 106) * 100).toFixed(0)}%` }}
              aria-hidden
            />
          </div>
          <div className="text-text-3 text-meta mt-[5px] flex justify-between font-mono">
            <span>0</span>
            <span>Lc 75 = {t("card.apca.bodyShort")}</span>
            <span>±106</span>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
