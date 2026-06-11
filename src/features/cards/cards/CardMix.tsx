"use client";

import {
  parseHex,
  toHex,
  mixColors,
  BLEND_MODES,
  type BlendMode,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { usePairColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

const MODE_LABEL: Record<BlendMode, string> = {
  normal: "MIX",
  multiply: "MULTIPLY",
  screen: "SCREEN",
  overlay: "OVERLAY",
};

/** 色のミックスカード（FG×BG の合成結果）。 */
export function CardMix({ number }: CardProps) {
  const pair = usePairColors();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const fg = pair ? (parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 }) : null;
  const bg = pair ? (parseHex(pair.bg.hex) ?? { r: 0, g: 0, b: 0 }) : null;

  return (
    <CardFrame
      number={number}
      title={t("card.mix.title")}
      enLabel="Blend"
      helpKey="mix"
    >
      {!pair || !fg || !bg ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-[7px] sm:grid-cols-4">
          {BLEND_MODES.map((mode) => {
            const hex = toHex(mixColors(fg, bg, mode)).toUpperCase();
            return (
              <ScaleChip
                key={mode}
                hex={hex}
                label={MODE_LABEL[mode]}
                isBase={false}
                ariaLabel={t("card.mix.add", {
                  mode: MODE_LABEL[mode],
                  hex: fmt(hex),
                })}
                onAdd={() => add(hex)}
              />
            );
          })}
        </div>
      )}
    </CardFrame>
  );
}
