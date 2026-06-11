"use client";

import {
  parseHex,
  toHex,
  sortOrder,
  equalizeLightness,
  type SortKey,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

/** 並べ替え・正規化カード（色相順/明度順ソート・明度ステップ均等化）。 */
export function CardSortNormalize({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  const sort = (key: SortKey) => {
    const order = sortOrder(rgbs, key).map((i) => palette[i].id);
    apply({ kind: "reorder", order });
    showToast(t("card.sort.done"));
  };

  const equalize = () => {
    const hexes = equalizeLightness(rgbs).map((c) => toHex(c).toUpperCase());
    apply({ kind: "replaceAll", hexes });
    showToast(t("card.sort.equalized"));
  };

  const actions: {
    key: string;
    label: MessageKey;
    run: () => void;
    disabled?: boolean;
  }[] = [
    { key: "hue", label: "card.sort.byHue", run: () => sort("hue") },
    {
      key: "lightness",
      label: "card.sort.byLightness",
      run: () => sort("lightness"),
    },
    {
      key: "equalize",
      label: "card.sort.equalize",
      run: equalize,
      disabled: palette.length < 3,
    },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.sort.title")}
      enLabel="Sort / Normalize"
      helpKey="sort"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-text-2 text-[13px] leading-[1.6]">
            {t("card.sort.lead")}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={action.run}
                disabled={action.disabled}
                className="cff-control text-text-2 hover:text-text px-3 py-2 font-mono text-[12px] tracking-[0.04em] whitespace-nowrap disabled:opacity-40"
              >
                {t(action.label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
