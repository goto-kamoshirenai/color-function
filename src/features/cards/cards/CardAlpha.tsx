"use client";

import { useState } from "react";
import { parseHex, toHex } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { ColorCode } from "@/components/ColorCode";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 白・黒・市松の上に α 合成した結果（単純アルファブレンド）。 */
function over(
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number },
  a: number,
) {
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
  };
}

/** 不透明度カード（αスライダーと白/黒/市松上での見え方・合成結果値）。 */
export function CardAlpha({ number }: CardProps) {
  const color = useSelectedColor();
  const t = useT();
  const [alpha, setAlpha] = useState(60);

  const rgb = color
    ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const a = alpha / 100;
  const onWhite = toHex(over(rgb, { r: 255, g: 255, b: 255 }, a)).toUpperCase();
  const onBlack = toHex(over(rgb, { r: 0, g: 0, b: 0 }, a)).toUpperCase();

  return (
    <CardFrame
      number={number}
      title={t("card.alpha.title")}
      enLabel="Alpha"
      helpKey="alpha"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div>
            <div className="mb-[5px] flex justify-between">
              <span className="text-text-2 font-mono text-[12px]">α</span>
              <span className="font-mono text-xs font-medium">{alpha}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              aria-label={t("card.alpha.title")}
              className="w-full accent-(--accent)"
            />
          </div>

          {/* 市松の上の見え方 */}
          <div
            className="border-border-strong rounded-control h-12 border"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(45deg,#bbb 25%,transparent 25%,transparent 75%,#bbb 75%),linear-gradient(45deg,#bbb 25%,#eee 25%,#eee 75%,#bbb 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,8px 8px",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                backgroundColor: color.hex,
                opacity: a,
              }}
            />
          </div>

          <div className="bg-border border-border rounded-control grid grid-cols-2 gap-px overflow-hidden border">
            {[
              { label: t("card.alpha.onWhite"), hex: onWhite },
              { label: t("card.alpha.onBlack"), hex: onBlack },
            ].map((cell) => (
              <div key={cell.label} className="bg-surface px-3 py-2">
                <div className="text-text-3 text-meta mb-1 font-mono tracking-[0.1em] uppercase">
                  {cell.label}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="border-border-strong rounded-control size-[18px] flex-none border"
                    style={{ backgroundColor: cell.hex }}
                    aria-hidden
                  />
                  <ColorCode hex={cell.hex} className="text-[12px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
