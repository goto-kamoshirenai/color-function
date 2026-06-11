"use client";

import { parseHex, matchScheme } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useHarmonyRules } from "@/lib/useHarmonyRules";
import { useLocale, useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** 調和スキーム判定カード（既知スキームへの合致と調和スコア）。 */
export function CardSchemeMatch({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const rules = useHarmonyRules();
  const locale = useLocale();
  const t = useT();

  const match = matchScheme(
    palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
    rules,
  );
  const rule = match ? rules.find((r) => r.id === match.ruleId) : undefined;
  const ruleName = rule
    ? locale === "en"
      ? (rule.sub ?? rule.label)
      : rule.label
    : null;

  return (
    <CardFrame
      number={number}
      title={t("card.scheme.title")}
      enLabel="Scheme Match"
      helpKey="scheme"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : rules.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.harmony.loading")}
        </p>
      ) : !match ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.scheme.tooFew")}
        </p>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[18px] font-extrabold tracking-[-0.01em]">
              {ruleName}
            </span>
            <span className="font-mono text-[26px] leading-none font-medium">
              {match.score}
              <span className="text-text-3 text-[13px]"> / 100</span>
            </span>
          </div>
          <div className="bg-surface-3 border-border relative mt-3.5 h-[7px] overflow-hidden border">
            <div
              className="absolute inset-0 bg-(--text)"
              style={{ width: `${match.score}%` }}
            />
          </div>
          <p className="text-text-3 text-meta mt-auto pt-3 font-mono tracking-[0.04em]">
            {t("card.scheme.note")}
          </p>
        </div>
      )}
    </CardFrame>
  );
}
