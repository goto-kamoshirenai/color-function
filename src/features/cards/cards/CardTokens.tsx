"use client";

import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { Copy } from "iconoir-react";
import { parseHex, assignRoles, toHex } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useCopy } from "../hooks";
import { segCompactClass } from "@/components/segmented";
import type { CardProps } from "../types";

type TokenFormat = "css" | "tailwind" | "json";

/** ロール名（割当できた色はロール、それ以外は連番）。 */
function tokenNames(hexes: string[]): string[] {
  const roles = assignRoles(
    hexes.map((h) => parseHex(h) ?? { r: 0, g: 0, b: 0 }),
  );
  const names = hexes.map((_, i) => `color-${String(i + 1).padStart(2, "0")}`);
  for (const { role, index } of roles) names[index] = role;
  return names;
}

function render(format: TokenFormat, hexes: string[]): string {
  const names = tokenNames(hexes);
  const lower = hexes.map((h) => toHex(parseHex(h) ?? { r: 0, g: 0, b: 0 }));
  switch (format) {
    case "css":
      return [
        ":root {",
        ...names.map((n, i) => `  --color-${n}: ${lower[i]};`),
        "}",
      ].join("\n");
    case "tailwind":
      return [
        "// tailwind.config / @theme",
        ...names.map((n, i) => `--color-${n}: ${lower[i]};`),
      ].join("\n");
    case "json":
      return JSON.stringify(
        Object.fromEntries(names.map((n, i) => [n, lower[i]])),
        null,
        2,
      );
  }
}

/** デザイントークン出力カード（CSS 変数 / Tailwind / JSON）。 */
export function CardTokens({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const copy = useCopy();
  const t = useT();
  const [format, setFormat] = useState<TokenFormat>("css");

  const text = render(
    format,
    palette.map((c) => c.hex),
  );

  return (
    <CardFrame
      number={number}
      title={t("card.tokens.title")}
      enLabel="Design Tokens"
      helpKey="tokens"
      rightSlot={
        palette.length > 0 ? (
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            aria-label={t("card.tokens.format")}
            selectedKeys={[format]}
            onSelectionChange={(keys) => {
              const next = [...keys][0] as TokenFormat | undefined;
              if (next) setFormat(next);
            }}
            className="border-border-strong rounded-control inline-flex overflow-hidden border"
          >
            <ToggleButton id="css" className={segCompactClass}>
              CSS
            </ToggleButton>
            <ToggleButton id="tailwind" className={segCompactClass}>
              TW
            </ToggleButton>
            <ToggleButton id="json" className={segCompactClass}>
              JSON
            </ToggleButton>
          </ToggleButtonGroup>
        ) : undefined
      }
    >
      {palette.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          <pre className="border-border bg-surface-2 rounded-control overflow-x-auto border px-3.5 py-3 font-mono text-[12px] leading-[1.7]">
            {text}
          </pre>
          <button
            type="button"
            onClick={() => copy(text)}
            className="cff-control text-text-2 hover:text-text flex items-center gap-1.5 self-end px-3 py-1.5 font-mono text-[12px]"
          >
            <Copy width={13} height={13} aria-hidden />
            {t("card.tokens.copy")}
          </button>
        </div>
      )}
    </CardFrame>
  );
}
