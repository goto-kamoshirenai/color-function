"use client";

import { parseHex, toHex, rotateHueOklch } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useHarmonyRules } from "@/lib/useHarmonyRules";
import { useLocale, useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

/** 相手色提案カード（基準色に合う相手候補を調和ルールから抽出）。 */
export function CardPartner({ number }: CardProps) {
  const color = useSelectedColor();
  const rules = useHarmonyRules();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const locale = useLocale();
  const t = useT();
  const fmt = useFormatColor();

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  // 各ルールの非ゼロオフセット → 相手候補（HEX 単位で重複排除）
  const base = color ? (parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }) : null;
  const seen = new Set<string>();
  const partners =
    base === null
      ? []
      : rules.flatMap((rule) =>
          rule.hueOffsets
            .filter((o) => o !== 0)
            .map((offset) => {
              const hex = toHex(rotateHueOklch(base, offset)).toUpperCase();
              const label =
                locale === "en" ? (rule.sub ?? rule.label) : rule.label;
              return { hex, label, key: `${rule.id}-${offset}` };
            })
            .filter((p) => {
              if (seen.has(p.hex)) return false;
              seen.add(p.hex);
              return true;
            }),
        );

  return (
    <CardFrame
      number={number}
      title={t("card.partner.title")}
      enLabel="Partner"
      helpKey="partner"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : rules.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.harmony.loading")}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-[7px] sm:grid-cols-6">
          {partners.map((p) => (
            <ScaleChip
              key={p.key}
              hex={p.hex}
              label={p.label}
              isBase={false}
              ariaLabel={t("card.harmony.add", {
                label: p.label,
                hex: fmt(p.hex),
              })}
              onAdd={() => add(p.hex)}
            />
          ))}
        </div>
      )}
    </CardFrame>
  );
}
