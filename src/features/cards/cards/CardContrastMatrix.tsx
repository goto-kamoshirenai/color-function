"use client";

import { parseHex, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { MatrixGrid } from "./MatrixGrid";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 値セル共通のレイアウト（背景色は用途ごとに前置）。 */
const CELL = "px-1 py-2.5 text-center font-mono text-xs";

/** コントラスト比マトリクス（v2: inline-grid・太字＋インセット枠=AA合格）。 */
export function CardContrastMatrix({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();
  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  return (
    <CardFrame
      number={number}
      title={t("card.cmatrix.title")}
      helpKey="cmatrix"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <>
          <MatrixGrid
            palette={palette}
            leadWidth={54}
            cellMinWidth={54}
            fillWidth
            srText={t("card.cmatrix.sr")}
            diagonalClassName={`bg-surface-2 text-text-3 ${CELL}`}
            cell={(ri, ci) => {
              const ratio = contrastRatio(rgbs[ri], rgbs[ci]);
              const pass = ratio >= 4.5;
              return {
                content: ratio.toFixed(2),
                className: `bg-surface ${CELL} ${
                  pass
                    ? "font-bold shadow-[inset_0_0_0_1.5px_var(--accent)]"
                    : "text-text-3 font-normal"
                }`,
              };
            }}
          />
          {/* 凡例はヘッダーではなくボディ側（小画面でタイトルを圧迫しないように） */}
          <p className="text-text-3 text-meta mt-[9px] text-right font-mono tracking-[0.04em]">
            BOLD = AA (≥4.5)
          </p>
        </>
      )}
    </CardFrame>
  );
}
