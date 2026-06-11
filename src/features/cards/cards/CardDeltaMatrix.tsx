"use client";

import { Fragment } from "react";
import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 色差 ΔE マトリクス（v2: 16px スウォッチ＋11px セル。太字=紛らわしい近さ）。 */
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
        <div className="text-text-3 p-10 text-center font-mono text-xs">
          {t("card.needMatrix")}
        </div>
      ) : (
        <div className="cff-scroll overflow-x-auto">
          <p className="sr-only">{t("card.dmatrix.sr")}</p>
          <div
            className="bg-border border-border inline-grid gap-px border"
            style={{
              gridTemplateColumns: `30px repeat(${palette.length}, minmax(36px, 1fr))`,
            }}
          >
            <div className="bg-surface min-w-[30px]" />
            {palette.map((c) => (
              <div key={c.id} className="bg-surface flex justify-center p-1.5">
                <span
                  className="border-border-strong rounded-control size-4 border"
                  style={{ backgroundColor: c.hex }}
                  title={c.hex}
                />
              </div>
            ))}
            {palette.map((row, ri) => (
              <Fragment key={row.id}>
                <div className="bg-surface flex justify-center p-1.5">
                  <span
                    className="border-border-strong rounded-control size-4 border"
                    style={{ backgroundColor: row.hex }}
                    title={row.hex}
                  />
                </div>
                {palette.map((col, ci) => {
                  if (ri === ci)
                    return (
                      <div
                        key={col.id}
                        className="bg-surface-2 text-text-3 text-meta min-w-[36px] px-1 py-2 text-center font-mono"
                      >
                        —
                      </div>
                    );
                  const de = deltaE2000(labs[ri], labs[ci]);
                  const close = de < 10; // CIEDE2000: 10未満は紛らわしい近さ
                  return (
                    <div
                      key={col.id}
                      className={
                        "bg-surface text-meta min-w-[36px] px-1 py-2 text-center font-mono " +
                        (close ? "font-bold" : "text-text-3")
                      }
                    >
                      {Math.round(de)}
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
