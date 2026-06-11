"use client";

import {
  parseHex,
  rgbToOklch,
  rgbToOklab,
  rgbToLab,
  labToLch,
  rgbToXyz,
  xyzToXy,
  rgbToHwb,
  rgbToCmyk,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useSelectedColor, useCopy } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

const f = (n: number, d = 1) => n.toFixed(d);

/** 拡張色空間カード（OKLCH/OKLab/CIELAB/CIELCH/XYZ/xy/HWB/CMYK）。 */
export function CardSpaces({ number }: CardProps) {
  const color = useSelectedColor();
  const copy = useCopy();
  const t = useT();

  const rgb = color
    ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const ok = rgbToOklch(rgb);
  const okl = rgbToOklab(rgb);
  const lab = rgbToLab(rgb);
  const lch = labToLch(lab);
  const xyz = rgbToXyz(rgb);
  const xy = xyzToXy(xyz);
  const hwb = rgbToHwb(rgb);
  const cmyk = rgbToCmyk(rgb);

  const rows: { label: string; value: string; copyText: string }[] = [
    {
      label: "OKLCH",
      value: `${f(ok.l, 3)}, ${f(ok.c, 3)}, ${f(ok.h, 1)}°`,
      copyText: `oklch(${f(ok.l, 3)} ${f(ok.c, 3)} ${f(ok.h, 1)})`,
    },
    {
      label: "OKLab",
      value: `${f(okl.l, 3)}, ${f(okl.a, 3)}, ${f(okl.b, 3)}`,
      copyText: `oklab(${f(okl.l, 3)} ${f(okl.a, 3)} ${f(okl.b, 3)})`,
    },
    {
      label: "CIELAB",
      value: `${f(lab.L)}, ${f(lab.a)}, ${f(lab.b)}`,
      copyText: `lab(${f(lab.L)}% ${f(lab.a)} ${f(lab.b)})`,
    },
    {
      label: "CIELCH",
      value: `${f(lch.L)}, ${f(lch.c)}, ${f(lch.h)}°`,
      copyText: `lch(${f(lch.L)}% ${f(lch.c)} ${f(lch.h)})`,
    },
    {
      label: "XYZ",
      value: `${f(xyz.x * 100)}, ${f(xyz.y * 100)}, ${f(xyz.z * 100)}`,
      copyText: `xyz(${f(xyz.x * 100)}, ${f(xyz.y * 100)}, ${f(xyz.z * 100)})`,
    },
    {
      label: "xy",
      value: `${f(xy.x, 4)}, ${f(xy.y, 4)}`,
      copyText: `${f(xy.x, 4)}, ${f(xy.y, 4)}`,
    },
    {
      label: "HWB",
      value: `${f(hwb.h, 0)}°, ${f(hwb.w, 0)}%, ${f(hwb.b, 0)}%`,
      copyText: `hwb(${f(hwb.h, 0)} ${f(hwb.w, 0)}% ${f(hwb.b, 0)}%)`,
    },
    {
      label: "CMYK*",
      value: `${f(cmyk.c, 0)}, ${f(cmyk.m, 0)}, ${f(cmyk.y, 0)}, ${f(cmyk.k, 0)}`,
      copyText: `cmyk(${f(cmyk.c, 0)}%, ${f(cmyk.m, 0)}%, ${f(cmyk.y, 0)}%, ${f(cmyk.k, 0)}%)`,
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.spaces.title")}
      enLabel="Color Spaces"
      helpKey="spaces"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <>
          <div className="bg-border border-border rounded-control grid grid-cols-1 gap-px overflow-hidden border sm:grid-cols-2">
            {rows.map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => copy(row.copyText)}
                className="bg-surface hover:bg-surface-2 px-3.5 py-2 text-left"
              >
                <div className="text-text-3 text-meta mb-0.5 font-mono tracking-[0.14em] uppercase">
                  {row.label}
                </div>
                <div className="font-mono text-[14px] font-medium tracking-[0.01em]">
                  {row.value}
                </div>
              </button>
            ))}
          </div>
          <p className="text-text-3 text-meta mt-[11px] font-mono tracking-[0.04em]">
            {t("card.spaces.note")}
          </p>
        </>
      )}
    </CardFrame>
  );
}
