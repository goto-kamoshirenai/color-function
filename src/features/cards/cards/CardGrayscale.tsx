"use client";

import {
  parseHex,
  toHex,
  grayscaleOf,
  rgbToLab,
  deltaE2000,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** グレースケール耐性カード（脱色時の見え方と、潰れるペアの検出）。 */
export function CardGrayscale({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const grays = palette.map((c) =>
    toHex(grayscaleOf(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 })).toUpperCase(),
  );
  const labs = grays.map((g) => rgbToLab(parseHex(g) ?? { r: 0, g: 0, b: 0 }));
  const collisions: { i: number; j: number; de: number }[] = [];
  for (let i = 0; i < labs.length; i++) {
    for (let j = i + 1; j < labs.length; j++) {
      const de = deltaE2000(labs[i], labs[j]);
      if (de < 10) collisions.push({ i, j, de });
    }
  }

  return (
    <CardFrame
      number={number}
      title={t("card.grayscale.title")}
      enLabel="Grayscale"
      helpKey="grayscale"
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          {/* 上段カラー / 下段グレースケール */}
          <div>
            <div className="border-border-strong flex h-9 overflow-hidden rounded-t-[2px] border border-b-0">
              {palette.map((c) => (
                <div
                  key={c.id}
                  className="flex-1"
                  style={{ backgroundColor: c.hex }}
                  title={c.hex}
                />
              ))}
            </div>
            <div className="border-border-strong flex h-9 overflow-hidden rounded-b-[2px] border">
              {grays.map((g, i) => (
                <div
                  key={palette[i].id}
                  className="flex-1"
                  style={{ backgroundColor: g }}
                  title={g}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {collisions.length === 0 ? (
              <p className="text-text-2 text-meta font-mono">
                {t("card.grayscale.ok")}
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {collisions.map(({ i, j, de }) => (
                  <li
                    key={`${i}-${j}`}
                    className="text-text-2 flex items-center gap-2 font-mono text-[12px]"
                  >
                    <span
                      className="border-border-strong size-3.5 rounded-[2px] border"
                      style={{ backgroundColor: palette[i].hex }}
                      aria-hidden
                    />
                    <span
                      className="border-border-strong size-3.5 rounded-[2px] border"
                      style={{ backgroundColor: palette[j].hex }}
                      aria-hidden
                    />
                    {t("card.grayscale.collision", {
                      a: String(i + 1).padStart(2, "0"),
                      b: String(j + 1).padStart(2, "0"),
                      de: de.toFixed(1),
                    })}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
