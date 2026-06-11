"use client";

import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useLocale, useT } from "@/lib/i18n/locale";
import { PALETTE_TEMPLATES } from "../templates";
import type { CardProps } from "../types";

/** 配色テンプレート適用カード（用途別の出発点でパレットを置換）。 */
export function CardTemplates({ number }: CardProps) {
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const locale = useLocale();
  const t = useT();

  const applyTemplate = (id: string) => {
    const template = PALETTE_TEMPLATES.find((tp) => tp.id === id);
    if (!template) return;
    apply({ kind: "replaceAll", hexes: template.hexes });
    showToast(t("card.templates.applied", { name: template.name[locale] }));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.templates.title")}
      enLabel="Templates"
      helpKey="templates"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PALETTE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => applyTemplate(template.id)}
            aria-label={t("card.templates.apply", {
              name: template.name[locale],
            })}
            className="border-border hover:border-border-strong rounded-control group border p-2 text-left"
          >
            <span className="border-border-strong flex h-7 overflow-hidden rounded-[2px] border">
              {template.hexes.map((hex) => (
                <span
                  key={hex}
                  className="flex-1"
                  style={{ backgroundColor: hex }}
                  aria-hidden
                />
              ))}
            </span>
            <span className="text-text-2 group-hover:text-text mt-1.5 block text-[12px] font-semibold">
              {template.name[locale]}
            </span>
          </button>
        ))}
      </div>
      <p className="text-text-3 text-meta mt-2.5 font-mono tracking-[0.04em]">
        {t("card.templates.note")}
      </p>
    </CardFrame>
  );
}
