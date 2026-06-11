"use client";

import { Check, Xmark } from "iconoir-react";
import { parseHex, rolesCoverage } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const ROLE_KEY = {
  background: "card.roles.background",
  text: "card.roles.text",
  accent: "card.roles.accent",
  surface: "card.roles.surface",
} as const satisfies Record<string, MessageKey>;

/** 役割カバレッジカード（背景/テキスト/強調/中間面が揃うか）。 */
export function CardRoles({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const checks = rolesCoverage(
    palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
  );

  return (
    <CardFrame
      number={number}
      title={t("card.roles.title")}
      enLabel="Role Coverage"
      helpKey="roles"
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {checks.map((check) => (
            <li
              key={check.key}
              className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
            >
              <span className="flex items-center gap-2 text-[12.5px] font-semibold">
                {check.ok ? (
                  <Check
                    width={14}
                    height={14}
                    strokeWidth={2.5}
                    className="text-accent"
                    aria-hidden
                  />
                ) : (
                  <Xmark
                    width={14}
                    height={14}
                    strokeWidth={2}
                    className="text-text-3"
                    aria-hidden
                  />
                )}
                {t(ROLE_KEY[check.key])}
              </span>
              {check.ok && check.index >= 0 && palette[check.index] ? (
                <span className="flex items-center gap-1.5">
                  <span
                    className="border-border-strong size-3.5 rounded-[2px] border"
                    style={{ backgroundColor: palette[check.index].hex }}
                    aria-hidden
                  />
                  <span className="text-text-3 text-meta font-mono">
                    {String(check.index + 1).padStart(2, "0")}
                  </span>
                </span>
              ) : (
                <span className="text-text-3 text-meta font-mono">—</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}
