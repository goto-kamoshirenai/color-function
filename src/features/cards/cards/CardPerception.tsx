"use client";

import {
  parseHex,
  toHex,
  hspBrightness,
  rgbToOklch,
  grayscaleOf,
  correlatedColorTemp,
  warmCoolOf,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { ColorCode } from "@/components/ColorCode";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 知覚明度・色温度カード（HSP / OKLab L / グレースケール等価 / 暖寒・CCT）。 */
export function CardPerception({ number }: CardProps) {
  const color = useSelectedColor();
  const t = useT();

  const rgb = color
    ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const hsp = hspBrightness(rgb);
  const okL = rgbToOklch(rgb).l;
  const gray = toHex(grayscaleOf(rgb)).toUpperCase();
  const cct = correlatedColorTemp(rgb);
  const kind = warmCoolOf(rgb);
  const cctValid = cct > 1000 && cct < 25000;

  const meters: { label: string; value: number }[] = [
    { label: "HSP", value: hsp },
    { label: "OKLab L", value: okL },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.perception.title")}
      enLabel="Perceived"
      helpKey="perception"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {meters.map((m) => (
            <div key={m.label}>
              <div className="mb-[5px] flex items-baseline justify-between">
                <span className="text-text-2 text-meta font-mono">
                  {m.label}
                </span>
                <span className="font-mono text-[15px] font-medium">
                  {m.value.toFixed(3)}
                </span>
              </div>
              <div className="bg-surface-3 border-border relative h-[7px] overflow-hidden border">
                <div
                  className="absolute inset-0 bg-(--text)"
                  style={{ width: `${(m.value * 100).toFixed(1)}%` }}
                />
              </div>
            </div>
          ))}

          <div className="bg-border border-border rounded-control grid grid-cols-2 gap-px overflow-hidden border">
            <div className="bg-surface px-3 py-2">
              <div className="text-text-3 text-meta mb-1 font-mono tracking-[0.1em] uppercase">
                {t("card.perception.gray")}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="border-border-strong rounded-control size-[18px] flex-none border"
                  style={{ backgroundColor: gray }}
                  aria-hidden
                />
                <ColorCode hex={gray} className="text-[12px]" />
              </div>
            </div>
            <div className="bg-surface px-3 py-2">
              <div className="text-text-3 text-meta mb-1 font-mono tracking-[0.1em] uppercase">
                {t("card.perception.temp")}
              </div>
              <div className="font-mono text-[13px] font-medium">
                {t(
                  kind === "warm"
                    ? "card.perception.warm"
                    : kind === "cool"
                      ? "card.perception.cool"
                      : "card.perception.neutral",
                )}
                {cctValid ? ` · ${Math.round(cct)}K` : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
