"use client";

import { Check, WarningTriangle } from "iconoir-react";
import {
  parseHex,
  toHex,
  isWebSafe,
  toWebSafe,
  rgbToCmyk,
  rgbToLab,
  deltaE2000,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { ColorCode } from "@/components/ColorCode";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";
import type { RGB } from "@/core/color";

/** ナイーブ CMYK を sRGB に戻す（往復誤差 = 印刷近似の劣化度合い）。 */
function cmykRoundtrip(rgb: RGB): RGB {
  const { c, m, y, k } = rgbToCmyk(rgb);
  const K = k / 100;
  return {
    r: 255 * (1 - c / 100) * (1 - K),
    g: 255 * (1 - m / 100) * (1 - K),
    b: 255 * (1 - y / 100) * (1 - K),
  };
}

/** ガマット・出力適合カード（sRGB/広色域・Webセーフ・印刷近似）。 */
export function CardGamut({ number }: CardProps) {
  const color = useSelectedColor();
  const t = useT();

  const rgb = color
    ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const websafe = color ? isWebSafe(color.hex) : false;
  const nearestSafe = toHex(toWebSafe(rgb)).toUpperCase();
  const printDelta = deltaE2000(rgbToLab(rgb), rgbToLab(cmykRoundtrip(rgb)));
  const printWarn = printDelta >= 5;

  const rows = [
    {
      label: "sRGB / Display-P3 / Rec.2020",
      value: t("card.gamut.inGamut"),
      ok: true,
    },
    {
      label: t("card.gamut.websafe"),
      value: websafe ? t("card.gamut.safe") : nearestSafe,
      ok: websafe,
    },
    {
      label: t("card.gamut.print"),
      value: `ΔE ${printDelta.toFixed(1)}`,
      ok: !printWarn,
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.gamut.title")}
      enLabel="Gamut"
      helpKey="gamut"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {rows.map((row) => (
              <li
                key={row.label}
                className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
              >
                <span className="text-text-2 min-w-0 truncate font-mono text-[12px]">
                  {row.label}
                </span>
                <span className="flex flex-none items-center gap-1.5 font-mono text-[12px] font-medium">
                  {row.ok ? (
                    <Check
                      width={13}
                      height={13}
                      strokeWidth={2.5}
                      className="text-accent"
                      aria-hidden
                    />
                  ) : (
                    <WarningTriangle
                      width={13}
                      height={13}
                      strokeWidth={2}
                      className="text-text-2"
                      aria-hidden
                    />
                  )}
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
          {!websafe ? (
            <p className="text-text-3 text-meta mt-2.5 flex items-center gap-1.5 font-mono">
              {t("card.gamut.nearest")}
              <ColorCode hex={nearestSafe} />
            </p>
          ) : null}
        </>
      )}
    </CardFrame>
  );
}
