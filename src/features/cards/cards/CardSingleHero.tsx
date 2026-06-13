"use client";

import { Copy } from "iconoir-react";
import {
  parseHex,
  rgbToHsl,
  relativeLuminance,
  contrastRatio,
  nearestName,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor, useCopy } from "../hooks";
import { useColorNames } from "@/lib/useColorNames";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { CardProps } from "../types";

const r0 = (n: number) => Math.round(n);
const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

/**
 * 単色×検証のサマリーヒーロー（docs/adr/0002）。
 * 色のアイデンティティ（大スウォッチ＋値＋最寄り色名）と主要指標を 1 枚に集約。
 * 旧「色値」「最寄り色名」カードを吸収する。
 */
export function CardSingleHero({ number }: CardProps) {
  const color = useSelectedColor();
  const names = useColorNames();
  const copy = useCopy();
  const t = useT();
  const fmt = useFormatColor();

  const rgb = color ? (parseHex(color.hex) ?? BLACK) : BLACK;
  const hsl = rgbToHsl(rgb);
  const name = color ? nearestName(rgb, names) : null;
  const lum = relativeLuminance(rgb);

  const stats = [
    { label: t("card.lum.title"), value: lum.toFixed(4) },
    {
      label: t("card.lum.vsWhite"),
      value: `${contrastRatio(rgb, WHITE).toFixed(2)}:1`,
    },
    {
      label: t("card.lum.vsBlack"),
      value: `${contrastRatio(rgb, BLACK).toFixed(2)}:1`,
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.value.title")}
      enLabel="Color Value"
      helpKey="value"
      hero
      rightSlot={
        color ? (
          <button
            type="button"
            onClick={() => copy(color.hex)}
            className="cff-control text-text-2 inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[12px] tracking-[0.06em] whitespace-nowrap"
          >
            <Copy width={12} height={12} aria-hidden />
            COPY
          </button>
        ) : undefined
      }
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="border-border-strong rounded-control h-20 flex-none border sm:size-[120px]"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => copy(color.hex)}
                className="hover:text-accent font-mono text-[34px] leading-none font-semibold tracking-[-0.03em] sm:text-[44px]"
              >
                {fmt(color.hex)}
              </button>
              {name ? (
                <div className="text-text-2 mt-2.5 text-[14px]">
                  ≈{" "}
                  <span className="font-semibold text-(--text)">
                    {name.entry.name}
                  </span>{" "}
                  <span className="text-text-3 text-meta font-mono">
                    {t("card.name.deltaE")} {name.deltaE.toFixed(1)}
                  </span>
                </div>
              ) : null}
              <div className="text-text-3 text-meta mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono tracking-[0.04em]">
                <span>
                  RGB {rgb.r}, {rgb.g}, {rgb.b}
                </span>
                <span>
                  HSL {r0(hsl.h)}°, {r0(hsl.s)}%, {r0(hsl.l)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-border border-border rounded-control mt-5 grid grid-cols-3 gap-px overflow-hidden border">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface px-3 py-2.5">
                <div className="text-text-3 text-meta mb-0.5 font-mono tracking-[0.1em] uppercase">
                  {s.label}
                </div>
                <div className="font-mono text-[15px] font-medium">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </CardFrame>
  );
}
