"use client";

import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

/** CIEDE2000 の読み方の目安（docs/07 §7.3 に基づき再較正）。 */
function labelKey(de: number): MessageKey {
  if (de < 1) return "card.deltae.l0";
  if (de < 2) return "card.deltae.l1";
  if (de < 10) return "card.deltae.l2";
  if (de < 50) return "card.deltae.l3";
  return "card.deltae.l4";
}

/** 色差 ΔE カード（v2: 48px モノ数値＋太字ラベル＋下端バー）。 */
export function CardDeltaE({ number }: CardProps) {
  const pair = usePairColors();
  const t = useT();
  const de = pair
    ? deltaE2000(
        rgbToLab(parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 }),
        rgbToLab(parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 }),
      )
    : 0;

  return (
    <CardFrame number={number} title={t("card.deltae.title")} helpKey="deltae">
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="font-mono text-4xl leading-none font-medium tracking-[-0.03em] sm:text-5xl">
            {de.toFixed(2)}
          </div>
          <div className="mt-2.5 mb-4 text-[13px] font-bold">
            {t(labelKey(de))}
          </div>
          <div className="bg-surface-3 border-border relative mt-auto h-[7px] overflow-hidden border">
            <div
              className="absolute inset-0 bg-(--text)"
              style={{ width: `${Math.min(100, de).toFixed(0)}%` }}
            />
          </div>
          <div className="text-text-3 text-meta mt-[5px] flex justify-between font-mono">
            <span>0</span>
            <span>100+</span>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
