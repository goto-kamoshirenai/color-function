"use client";

import {
  parseHex,
  contrastRatio,
  rgbToLab,
  deltaE2000,
  paletteEntropy,
  grayscaleOf,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

const BLACK = { r: 0, g: 0, b: 0 };

/**
 * パレット×検証のサマリーヒーロー（docs/adr/0002）。
 * パレット全体の健全性を 1 枚に要約（色数・最小コントラスト・紛らわしいペア・
 * 色相エントロピー・グレースケール耐性）。詳細カードは下に残す。
 */
export function CardPaletteOverview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? BLACK);
  const labs = rgbs.map(rgbToLab);

  let minContrast = Infinity;
  let confusing = 0;
  let grayMerge = 0;
  const grayLabs = rgbs.map((c) => rgbToLab(grayscaleOf(c)));
  for (let i = 0; i < rgbs.length; i++) {
    for (let j = i + 1; j < rgbs.length; j++) {
      minContrast = Math.min(minContrast, contrastRatio(rgbs[i], rgbs[j]));
      if (deltaE2000(labs[i], labs[j]) < 10) confusing++;
      if (deltaE2000(grayLabs[i], grayLabs[j]) < 10) grayMerge++;
    }
  }
  const hasPairs = rgbs.length >= 2;
  const entropy = paletteEntropy(rgbs);

  const stats = [
    { label: t("card.overview.colors"), value: String(palette.length) },
    {
      label: t("card.overview.minContrast"),
      value: hasPairs ? `${minContrast.toFixed(2)}:1` : "—",
    },
    {
      label: t("card.overview.confusing"),
      value: String(confusing),
    },
    {
      label: t("card.overview.entropy"),
      value: entropy.toFixed(2),
    },
    {
      label: t("card.overview.grayscale"),
      value:
        grayMerge === 0
          ? t("card.overview.grayOk")
          : t("card.overview.grayNg", { n: grayMerge }),
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.overview.title")}
      enLabel="Palette Overview"
      helpKey="overview"
      hero
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <>
          <div className="border-border-strong rounded-control flex h-[60px] overflow-hidden border">
            {palette.map((c) => (
              <div
                key={c.id}
                className="flex-1"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
            ))}
          </div>

          <div className="bg-border border-border rounded-control mt-5 grid grid-cols-1 gap-px overflow-hidden border sm:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface px-3 py-2.5">
                <div className="text-text-3 text-meta mb-0.5 font-mono tracking-[0.08em] uppercase">
                  {s.label}
                </div>
                <div className="font-mono text-[17px] font-medium">
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
