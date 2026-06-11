"use client";

import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

// 系列ごとの固定データ（決定的な見本。値に意味はない）
const SERIES = [
  [42, 70, 55, 86, 64],
  [30, 48, 76, 52, 88],
  [66, 36, 58, 44, 72],
  [50, 82, 38, 68, 46],
  [78, 56, 90, 34, 60],
  [38, 62, 46, 74, 52],
];

/** データビズプレビューカード（棒グラフに系列色として適用・識別性の確認）。 */
export function CardChartPreview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const seriesCount = Math.min(palette.length, SERIES.length);
  const groups = 5;
  const barW = 6;
  const groupW = seriesCount * (barW + 2) + 14;
  const width = Math.max(280, groups * groupW + 20);
  const height = 120;

  return (
    <CardFrame
      number={number}
      title={t("card.chartpreview.title")}
      enLabel="Chart Preview"
      helpKey="chartpreview"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="img"
          aria-label={t("card.chartpreview.aria")}
        >
          {/* 目盛線 */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={0}
              x2={width}
              y1={height - 14 - (height - 24) * f}
              y2={height - 14 - (height - 24) * f}
              stroke="var(--border)"
              strokeWidth={1}
            />
          ))}
          <line
            x1={0}
            x2={width}
            y1={height - 14}
            y2={height - 14}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />
          {Array.from({ length: groups }, (_, g) =>
            Array.from({ length: seriesCount }, (_, s) => {
              const value = SERIES[s][g] / 100;
              const h = (height - 24) * value;
              return (
                <rect
                  key={`${g}-${s}`}
                  x={10 + g * groupW + s * (barW + 2)}
                  y={height - 14 - h}
                  width={barW}
                  height={h}
                  rx={1}
                  fill={palette[s].hex}
                />
              );
            }),
          )}
        </svg>
      )}
    </CardFrame>
  );
}
