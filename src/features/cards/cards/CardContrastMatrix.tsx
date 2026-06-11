"use client";

import { Fragment } from "react";
import { parseHex, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { CardProps } from "../types";

/** コントラスト比マトリクス（v2: inline-grid・太字＋インセット枠=AA合格）。 */
export function CardContrastMatrix({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();
  const fmt = useFormatColor();
  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  return (
    <CardFrame
      number={number}
      title={t("card.cmatrix.title")}
      helpKey="cmatrix"
      rightSlot={
        <span className="text-text-3 text-meta font-mono tracking-[0.04em]">
          BOLD = AA (≥4.5)
        </span>
      }
    >
      {palette.length < 2 ? (
        <div className="text-text-3 p-10 text-center font-mono text-xs">
          {t("card.needMatrix")}
        </div>
      ) : (
        <div className="cff-scroll overflow-x-auto">
          <p className="sr-only">{t("card.cmatrix.sr")}</p>
          <div
            className="bg-border border-border inline-grid min-w-full gap-px border"
            style={{
              gridTemplateColumns: `54px repeat(${palette.length}, minmax(54px, 1fr))`,
            }}
          >
            <div className="bg-surface min-w-[54px]" />
            {palette.map((c) => (
              <div
                key={c.id}
                className="bg-surface flex justify-center px-1.5 py-2"
              >
                <span
                  className="border-border-strong rounded-control size-5 border"
                  style={{ backgroundColor: c.hex }}
                  title={fmt(c.hex)}
                />
              </div>
            ))}
            {palette.map((row, ri) => (
              <Fragment key={row.id}>
                <div className="bg-surface flex items-center justify-center px-1.5 py-2">
                  <span
                    className="border-border-strong rounded-control size-5 border"
                    style={{ backgroundColor: row.hex }}
                    title={fmt(row.hex)}
                  />
                </div>
                {palette.map((col, ci) => {
                  if (ri === ci)
                    return (
                      <div
                        key={col.id}
                        className="bg-surface-2 text-text-3 min-w-[54px] px-1 py-2.5 text-center font-mono text-xs"
                      >
                        —
                      </div>
                    );
                  const ratio = contrastRatio(rgbs[ri], rgbs[ci]);
                  const pass = ratio >= 4.5;
                  return (
                    <div
                      key={col.id}
                      className={
                        "bg-surface min-w-[54px] px-1 py-2.5 text-center font-mono text-xs " +
                        (pass
                          ? "font-bold shadow-[inset_0_0_0_1.5px_var(--text)]"
                          : "text-text-3 font-normal")
                      }
                    >
                      {ratio.toFixed(2)}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
