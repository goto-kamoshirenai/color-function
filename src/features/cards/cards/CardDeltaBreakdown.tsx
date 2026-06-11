"use client";

import {
  parseHex,
  rgbToLab,
  rgbToOklab,
  deltaE76,
  deltaE94,
  deltaE2000,
  okLabDistance,
  deltaComponents,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

const sign = (n: number, d = 1) => `${n >= 0 ? "+" : ""}${n.toFixed(d)}`;

/** 色差の内訳カード（ΔE76/ΔE94/ΔE00/OKLab 距離と ΔL/ΔC/Δh 成分）。 */
export function CardDeltaBreakdown({ number }: CardProps) {
  const pair = usePairColors();
  const t = useT();

  const fg = pair
    ? (parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const bg = pair
    ? (parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 })
    : { r: 255, g: 255, b: 255 };
  const lab1 = rgbToLab(fg);
  const lab2 = rgbToLab(bg);
  const comp = deltaComponents(lab1, lab2);

  const metrics = [
    { label: "ΔE00", value: deltaE2000(lab1, lab2).toFixed(2) },
    { label: "ΔE94", value: deltaE94(lab1, lab2).toFixed(2) },
    { label: "ΔE76", value: deltaE76(lab1, lab2).toFixed(2) },
    {
      label: "OKLab",
      value: okLabDistance(rgbToOklab(fg), rgbToOklab(bg)).toFixed(2),
    },
  ];
  const components = [
    { label: "ΔL*", value: sign(comp.dL) },
    { label: "ΔC*", value: sign(comp.dC) },
    { label: "Δh", value: `${sign(comp.dHdeg)}°` },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.dbreak.title")}
      enLabel="ΔE Breakdown"
      helpKey="dbreak"
    >
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-border border-border rounded-control grid grid-cols-2 gap-px overflow-hidden border sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-surface px-3 py-2">
                <div className="text-text-3 text-meta mb-0.5 font-mono tracking-[0.08em]">
                  {m.label}
                </div>
                <div className="font-mono text-[15px] font-medium">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-text-3 text-meta mb-1.5 font-mono tracking-[0.14em] uppercase">
              {t("card.dbreak.components")}
            </div>
            <div className="bg-border border-border rounded-control grid grid-cols-3 gap-px overflow-hidden border">
              {components.map((m) => (
                <div key={m.label} className="bg-surface px-3 py-2">
                  <div className="text-text-3 text-meta mb-0.5 font-mono">
                    {m.label}
                  </div>
                  <div className="font-mono text-[14px] font-medium">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
