"use client";

import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { CardFrame } from "@/components/Card";
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
  const labs = palette.map((c) =>
    rgbToLab(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
  );

  return (
    <CardFrame
      number={number}
      title={t("card.dmatrix.title")}
      helpKey="dmatrix"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <MatrixGrid
          palette={palette}
          leadWidth={30}
          cellMinWidth={36}
          srText={t("card.dmatrix.sr")}
          diagonalClassName={`bg-surface-2 text-text-3 ${CELL}`}
          cell={(ri, ci) => {
            const de = deltaE2000(labs[ri], labs[ci]);
            // CIEDE2000: 10未満は紛らわしい近さ
            return {
              content: Math.round(de),
              className: `bg-surface ${CELL} ${de < 10 ? "font-bold" : "text-text-3"}`,
            };
          }}
        />
      )}
    </CardFrame>
  );
}
