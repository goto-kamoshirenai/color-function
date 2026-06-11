"use client";

import { Check } from "iconoir-react";
import { parseHex, toHex, contrastRatio, nudgeForContrast } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { CardProps } from "../types";

const TARGETS = [
  { key: "AA", ratio: 4.5 },
  { key: "AAA", ratio: 7 },
] as const;

/** アクセシブル化ナッジカード（FG を AA/AAA に届く最寄り色へ補正提案）。 */
export function CardNudge({ number }: CardProps) {
  const pair = usePairColors();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const fg = pair ? (parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 }) : null;
  const bg = pair
    ? (parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 })
    : null;
  const current = fg && bg ? contrastRatio(fg, bg) : 0;

  const applyFix = (hex: string, ratio: number) => {
    if (!pair) return;
    apply({ kind: "set", id: pair.fg.id, hex });
    showToast(
      t("card.nudge.applied", { hex: fmt(hex), ratio: ratio.toFixed(2) }),
    );
  };

  return (
    <CardFrame
      number={number}
      title={t("card.nudge.title")}
      enLabel="A11y Nudge"
      helpKey="nudge"
    >
      {!pair || !fg || !bg ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <p className="text-text-2 text-meta font-mono">
            {t("card.nudge.current", { ratio: current.toFixed(2) })}
          </p>
          {TARGETS.map(({ key, ratio }) => {
            const result = nudgeForContrast(fg, bg, ratio);
            if (result === null) {
              return (
                <div
                  key={key}
                  className="border-border rounded-control text-text-2 flex items-center gap-2 border px-3 py-2 font-mono text-[12px]"
                >
                  <Check
                    width={13}
                    height={13}
                    strokeWidth={2.5}
                    className="text-accent"
                    aria-hidden
                  />
                  {t("card.nudge.already", { level: key })}
                </div>
              );
            }
            const hex = toHex(result.rgb).toUpperCase();
            return (
              <div
                key={key}
                className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="border-border-strong size-5 flex-none rounded-[2px] border"
                    style={{ backgroundColor: hex }}
                    aria-hidden
                  />
                  <span className="text-text-2 truncate font-mono text-[12px]">
                    {key} → {fmt(hex)}（{result.ratio.toFixed(2)}:1
                    {result.reached ? "" : ` · ${t("card.nudge.bestEffort")}`}）
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => applyFix(hex, result.ratio)}
                  className="cff-control text-text-2 hover:text-text flex-none px-2.5 py-1 font-mono text-[12px]"
                >
                  {t("card.nudge.apply")}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </CardFrame>
  );
}
