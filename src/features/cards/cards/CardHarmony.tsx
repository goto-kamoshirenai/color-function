"use client";

import { parseHex, toHex, generateScheme, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useHarmonyRules } from "@/lib/useHarmonyRules";
import { useLocale, useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ColorCode } from "@/components/ColorCode";
import type { CardProps } from "../types";

function chipColors(hex: string): { bg: string; fg: string } {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const onWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const onBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 });
  return onWhite >= onBlack
    ? { bg: "rgba(0,0,0,0.45)", fg: "#fff" }
    : { bg: "rgba(255,255,255,0.6)", fg: "#000" };
}

/** 調和スキーム生成カード（v2: 行=名前148px＋52pxチップ列・クリックで追加）。 */
export function CardHarmony({ number }: CardProps) {
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

  return (
    <CardFrame
      number={number}
      title={t("card.harmony.title")}
      enLabel="Harmony"
      helpKey="harmony"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : rules.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.harmony.loading")}
        </p>
      ) : (
        <>
          <p className="text-text-3 text-meta mt-[5px] mb-[18px] font-mono tracking-[0.03em]">
            BASE <ColorCode hex={color.hex} /> — {t("card.harmony.hint")}
          </p>
          <div className="flex flex-col gap-[13px]">
            {rules.map((rule) => {
              const base = parseHex(color.hex) ?? { r: 0, g: 0, b: 0 };
              const scheme = generateScheme(base, rule.hueOffsets).map((rgb) =>
                toHex(rgb).toUpperCase(),
              );
              // ルール名はアセット側が ja(label) / en(sub) を持つ
              const ruleName =
                locale === "en" ? (rule.sub ?? rule.label) : rule.label;
              return (
                <div key={rule.id} className="flex items-center gap-4">
                  <div className="w-[148px] flex-none">
                    <div className="text-[13px] font-bold">{ruleName}</div>
                    {locale === "ja" && rule.sub ? (
                      <div className="text-text-3 text-meta font-mono tracking-[0.08em] uppercase">
                        {rule.sub}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 gap-[7px]">
                    {scheme.map((hex, i) => {
                      const chip = chipColors(hex);
                      return (
                        <button
                          key={`${rule.id}-${i}`}
                          type="button"
                          onClick={() => add(hex)}
                          aria-label={t("card.harmony.add", {
                            label: ruleName,
                            hex: fmt(hex),
                          })}
                          className="border-border-strong rounded-control relative flex h-[52px] flex-1 items-end border p-1.5 transition-transform hover:-translate-y-0.5"
                          style={{ backgroundColor: hex }}
                        >
                          <span
                            className="rounded-control text-meta px-[5px] py-0.5 font-mono"
                            style={{ background: chip.bg, color: chip.fg }}
                          >
                            {fmt(hex)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </CardFrame>
  );
}
