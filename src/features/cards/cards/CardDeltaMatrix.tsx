"use client";

import { useMemo } from "react";
import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { CardEmpty } from "./CardEmpty";
import { MatrixGrid } from "./MatrixGrid";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 値セル共通のレイアウト（背景色は用途ごとに前置）。 */
const CELL = "px-1 py-2 text-center font-mono text-meta";

/** 色差 ΔE マトリクス（v2: スウォッチ塗りセル。太字=紛らわしい近さ）。 */
export function CardDeltaMatrix({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();
  // CIEDE2000 を n² 回回すため、パレットが変わったときだけ計算する
  const deltas = useMemo(() => {
    const labs = palette.map((c) =>
      rgbToLab(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
    );
    return labs.map((a) => labs.map((b) => deltaE2000(a, b)));
  }, [palette]);

  return (
    <CardFrame
      number={number}
      title={t("card.dmatrix.title")}
      helpKey="dmatrix"
    >
      {palette.length < 2 ? (
        <CardEmpty messageKey="card.needMatrix" />
      ) : (
        <MatrixGrid
          palette={palette}
          leadWidth={30}
          cellMinWidth={36}
          srText={t("card.dmatrix.sr")}
          diagonalClassName={`bg-surface-2 text-text-3 ${CELL}`}
          cell={(ri, ci) => {
            const de = deltas[ri][ci];
            // CIEDE2000: 10未満は紛らわしい近さ（太字だけでなく文字でも伝える）
            const close = de < 10;
            return {
              content: Math.round(de),
              srLabel: close
                ? t("card.dmatrix.close")
                : t("card.dmatrix.distinct"),
              className: `bg-surface ${CELL} ${close ? "font-bold" : "text-text-3"}`,
            };
          }}
        />
      )}
    </CardFrame>
  );
}
