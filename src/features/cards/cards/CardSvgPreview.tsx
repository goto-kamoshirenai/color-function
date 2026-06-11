"use client";

import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** SVG プレビューカード（抽象図形にパレットを順番適用した見え方）。 */
export function CardSvgPreview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const hex = (i: number) => palette[i % palette.length].hex;

  return (
    <CardFrame
      number={number}
      title={t("card.svgpreview.title")}
      enLabel="SVG Preview"
      helpKey="svgpreview"
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <svg
          viewBox="0 0 320 132"
          className="border-border-strong rounded-control w-full border"
          role="img"
          aria-label={t("card.svgpreview.aria")}
        >
          <rect width="320" height="132" fill={hex(0)} />
          <circle cx="62" cy="66" r="40" fill={hex(1)} />
          <rect x="124" y="26" width="80" height="80" rx="6" fill={hex(2)} />
          <polygon points="262,26 302,106 222,106" fill={hex(3)} />
          <rect x="124" y="112" width="180" height="8" rx="4" fill={hex(4)} />
          <circle cx="290" cy="44" r="12" fill={hex(5)} />
        </svg>
      )}
    </CardFrame>
  );
}
