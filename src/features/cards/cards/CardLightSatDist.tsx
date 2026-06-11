"use client";

import { Fragment } from "react";
import { parseHex, rgbToOklch, rgbToHsv } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 明度・彩度分布カード（OKLCH L と HSV S の軸上にパレットを配置）。 */
export function CardLightSatDist({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const points = palette.map((c) => {
    const rgb = parseHex(c.hex) ?? { r: 0, g: 0, b: 0 };
    return { hex: c.hex, id: c.id, l: rgbToOklch(rgb).l, s: rgbToHsv(rgb).s };
  });

  const axes = [
    {
      key: "l",
      label: t("card.lsdist.lightness"),
      bg: "linear-gradient(90deg,#000,#fff)",
      at: (p: (typeof points)[number]) => p.l * 100,
      ticks: ["0", "0.5", "1.0"],
    },
    {
      key: "s",
      label: t("card.lsdist.saturation"),
      bg: "linear-gradient(90deg,#9b9b9b,#e83015)",
      at: (p: (typeof points)[number]) => p.s,
      ticks: ["0%", "50%", "100%"],
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.lsdist.title")}
      enLabel="L / S Distribution"
      helpKey="lsdist"
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {axes.map((axis) => (
            <div key={axis.key}>
              <div className="text-text-2 text-meta mb-1.5 font-mono">
                {axis.label}
              </div>
              <div
                className="border-border rounded-control relative h-[30px] border"
                style={{ background: axis.bg }}
              >
                {points.map((p) => (
                  <Fragment key={p.id}>
                    <div
                      className="border-surface absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-[0_0_0_1.5px_var(--ring)]"
                      style={{
                        left: `${axis.at(p).toFixed(1)}%`,
                        backgroundColor: p.hex,
                      }}
                      title={p.hex}
                    />
                  </Fragment>
                ))}
              </div>
              <div className="text-text-3 text-meta mt-1 flex justify-between font-mono">
                {axis.ticks.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardFrame>
  );
}
