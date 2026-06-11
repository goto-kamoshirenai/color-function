"use client";

import { Check } from "iconoir-react";
import {
  parseHex,
  toHex,
  cvdConfusablePairs,
  suggestCvdSafe,
  type CvdType,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { CardProps } from "../types";

const TYPES: CvdType[] = ["protan", "deutan", "tritan"];
const THRESHOLD = 10;

/** 色覚セーフ提案カード（全型で識別できるよう紛らわしい色の補正を提案）。 */
export function CardCvdSafe({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  // どの型かで紛らわしいペア（重複は除外）
  const seen = new Set<string>();
  const conflicts = TYPES.flatMap((type) =>
    cvdConfusablePairs(rgbs, type, THRESHOLD).filter(({ i, j }) => {
      const key = `${i}-${j}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  ).slice(0, 4);

  const applyFix = (index: number, hex: string) => {
    apply({ kind: "set", id: palette[index].id, hex });
    showToast(t("toast.update", { hex: fmt(hex) }));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.cvdsafe.title")}
      enLabel="CVD Safe"
      helpKey="cvdsafe"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : conflicts.length === 0 ? (
        <p className="text-text-2 flex items-center gap-2 font-mono text-xs">
          <Check
            width={14}
            height={14}
            strokeWidth={2.5}
            className="text-accent"
            aria-hidden
          />
          {t("card.cvdsafe.ok")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {conflicts.map(({ i, j }) => {
            const others = rgbs.filter((_, k) => k !== j);
            const fix = suggestCvdSafe(rgbs[j], others, THRESHOLD);
            const hex = toHex(fix.rgb).toUpperCase();
            return (
              <li
                key={`${i}-${j}`}
                className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="border-border-strong size-4 flex-none rounded-[2px] border"
                    style={{ backgroundColor: palette[i].hex }}
                    aria-hidden
                  />
                  <span
                    className="border-border-strong size-4 flex-none rounded-[2px] border"
                    style={{ backgroundColor: palette[j].hex }}
                    aria-hidden
                  />
                  <span className="text-text-2 truncate font-mono text-[12px]">
                    {String(j + 1).padStart(2, "0")} → {fmt(hex)}
                    {fix.reached ? "" : ` · ${t("card.nudge.bestEffort")}`}
                  </span>
                  <span
                    className="border-border-strong size-4 flex-none rounded-[2px] border"
                    style={{ backgroundColor: hex }}
                    aria-hidden
                  />
                </span>
                <button
                  type="button"
                  onClick={() => applyFix(j, hex)}
                  className="cff-control text-text-2 hover:text-text flex-none px-2.5 py-1 font-mono text-[12px]"
                >
                  {t("card.nudge.apply")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </CardFrame>
  );
}
