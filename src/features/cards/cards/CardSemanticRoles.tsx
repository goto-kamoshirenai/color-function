"use client";

import { parseHex, assignRoles } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { ColorCode } from "@/components/ColorCode";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const ROLE_KEY = {
  background: "card.roles.background",
  text: "card.roles.text",
  primary: "card.semroles.primary",
  accent: "card.roles.accent",
  neutral: "card.semroles.neutral",
} as const satisfies Record<string, MessageKey>;

/** セマンティックロール割当カード（背景/テキスト/プライマリ等の自動割当）。 */
export function CardSemanticRoles({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const roles = assignRoles(
    palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
  );

  return (
    <CardFrame
      number={number}
      title={t("card.semroles.title")}
      enLabel="Semantic Roles"
      helpKey="semroles"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {roles.map(({ role, index }) => (
            <li
              key={role}
              className="border-border rounded-control flex items-center justify-between gap-3 border px-3 py-2"
            >
              <span className="text-text-3 text-meta font-mono tracking-[0.12em] uppercase">
                {t(ROLE_KEY[role])}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="border-border-strong size-4 rounded-[2px] border"
                  style={{ backgroundColor: palette[index].hex }}
                  aria-hidden
                />
                <ColorCode hex={palette[index].hex} className="text-[12px]" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardFrame>
  );
}
