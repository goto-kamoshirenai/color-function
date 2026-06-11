"use client";

import { useState } from "react";
import { Search } from "iconoir-react";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useColorNames } from "@/lib/useColorNames";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

const MAX_RESULTS = 8;

/** 色名検索カード（色名辞書から名前で検索してパレットに追加）。 */
export function CardNameSearch({ number }: CardProps) {
  const names = useColorNames();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();
  const [query, setQuery] = useState("");

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const q = query.trim().toLowerCase();
  const matches =
    q === ""
      ? []
      : names
          .filter((n) => n.name.toLowerCase().includes(q))
          .slice(0, MAX_RESULTS);

  return (
    <CardFrame
      number={number}
      title={t("card.namesearch.title")}
      enLabel="Name Search"
      helpKey="namesearch"
    >
      {names.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">
          {t("card.name.loading")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-[9px]">
            <Search
              width={14}
              height={14}
              className="text-text-3 flex-none"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("card.namesearch.placeholder")}
              aria-label={t("card.namesearch.title")}
              spellCheck={false}
              className="border-border-strong bg-bg rounded-control placeholder:text-text-3 flex-1 border px-[11px] py-2 text-[13px]"
            />
          </div>
          {q === "" ? (
            <p className="text-text-3 text-meta font-mono">
              {t("card.namesearch.hint", { n: names.length })}
            </p>
          ) : matches.length === 0 ? (
            <p className="text-text-3 text-meta font-mono">
              {t("card.namesearch.none")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-[7px] sm:grid-cols-4">
              {matches.map((m) => (
                <ScaleChip
                  key={`${m.name}-${m.hex}`}
                  hex={m.hex.toUpperCase()}
                  label={m.name}
                  isBase={false}
                  ariaLabel={t("toast.add", { hex: fmt(m.hex) })}
                  onAdd={() => add(m.hex.toUpperCase())}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </CardFrame>
  );
}
