"use client";

import { parseHex, warmCoolBalance } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const KIND_KEY = {
  warm: "card.perception.warm",
  cool: "card.perception.cool",
  neutral: "card.perception.neutral",
} as const satisfies Record<string, MessageKey>;

/** 暖寒バランスカード（分類チップ＋比率バー）。 */
export function CardWarmCool({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
  const balance = warmCoolBalance(rgbs);
  const total = Math.max(1, palette.length);
  const segments = [
    { key: "warm", count: balance.warm, className: "bg-[#d54e21]" },
    { key: "neutral", count: balance.neutral, className: "bg-[#9b9b9b]" },
    { key: "cool", count: balance.cool, className: "bg-[#3a6ea5]" },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.warmcool.title")}
      enLabel="Warm / Cool"
      helpKey="warmcool"
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-1 flex-col gap-3.5">
          <div className="border-border-strong rounded-control flex h-[14px] overflow-hidden border">
            {segments.map((seg) =>
              seg.count > 0 ? (
                <div
                  key={seg.key}
                  className={seg.className}
                  style={{ width: `${(seg.count / total) * 100}%` }}
                  aria-hidden
                />
              ) : null,
            )}
          </div>
          <div className="text-text-2 text-meta flex justify-between font-mono">
            <span>
              {t("card.perception.warm")} {balance.warm}
            </span>
            <span>
              {t("card.perception.neutral")} {balance.neutral}
            </span>
            <span>
              {t("card.perception.cool")} {balance.cool}
            </span>
          </div>
          <ul className="mt-auto flex flex-wrap gap-1.5">
            {palette.map((c, i) => (
              <li
                key={c.id}
                className="border-border rounded-control flex items-center gap-1.5 border px-2 py-1"
              >
                <span
                  className="border-border-strong rounded-control size-3.5 border"
                  style={{ backgroundColor: c.hex }}
                  aria-hidden
                />
                <span className="text-text-2 text-meta font-mono">
                  {t(KIND_KEY[balance.kinds[i]])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardFrame>
  );
}
