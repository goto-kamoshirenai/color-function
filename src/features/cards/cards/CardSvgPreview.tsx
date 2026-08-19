"use client";

import { cloneElement } from "react";
import { CardFrame } from "@/components/Card";
import { CardEmpty } from "./CardEmpty";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/**
 * SVG プレビューカード（抽象図形にパレットを順番適用した見え方）。
 * 図形は「背景＋色数-1 個」だけ描く。色数で割った余りを使って同色の図形を
 * 反復させると、少色時に同じ色が並ぶだけの見本になってしまうため。
 */
export function CardSvgPreview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  /** 背景（色1）に重ねる図形。色2 以降を順番に割り当てる。 */
  const shapes = [
    <circle key="c1" cx="62" cy="66" r="40" />,
    <rect key="r1" x="124" y="26" width="80" height="80" rx="6" />,
    <polygon key="p1" points="262,26 302,106 222,106" />,
    <rect key="r2" x="124" y="112" width="180" height="8" rx="4" />,
    <circle key="c2" cx="290" cy="44" r="12" />,
  ];
  const shown = shapes.slice(0, Math.max(0, palette.length - 1));

  return (
    <CardFrame
      number={number}
      title={t("card.svgpreview.title")}
      enLabel="SVG Preview"
      helpKey="svgpreview"
    >
      {palette.length === 0 ? (
        <CardEmpty messageKey="card.empty" />
      ) : (
        <svg
          viewBox="0 0 320 132"
          className="border-border-strong rounded-control w-full border"
          role="img"
          aria-label={t("card.svgpreview.aria")}
        >
          <rect width="320" height="132" fill={palette[0].hex} />
          {shown.map((shape, i) =>
            cloneElement(shape, { fill: palette[i + 1].hex }),
          )}
        </svg>
      )}
    </CardFrame>
  );
}
