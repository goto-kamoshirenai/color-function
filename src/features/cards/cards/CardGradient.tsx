"use client";

import { useState } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import {
  gradientSteps,
  GRADIENT_SPACES,
  type GradientSpace,
} from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useOrderedPair } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { segCompactClass } from "@/components/segmented";
import { ScaleChip } from "./ScaleChip";
import type { CardProps } from "../types";

const STEPS = 8;
const SPACE_LABEL: Record<GradientSpace, string> = {
  rgb: "sRGB",
  oklab: "OKLab",
  hsv: "HSV",
};

/** 2色間グラデーションカード（並び順1番目↔2番目・補間色空間を選択・段階チップ）。 */
export function CardGradient({ number }: CardProps) {
  const pair = useOrderedPair();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();
  const [space, setSpace] = useState<GradientSpace>("oklab");

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const steps = pair
    ? gradientSteps(pair.first.hex, pair.second.hex, space, STEPS)
    : [];

  return (
    <CardFrame
      number={number}
      title={t("card.gradient.title")}
      enLabel="Gradient"
      helpKey="gradient"
      rightSlot={
        pair ? (
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            aria-label={t("card.gradient.space")}
            selectedKeys={[space]}
            onSelectionChange={(keys) => {
              const next = [...keys][0] as GradientSpace | undefined;
              if (next) setSpace(next);
            }}
            className="border-border-strong rounded-control inline-flex overflow-hidden border"
          >
            {GRADIENT_SPACES.map((s) => (
              <ToggleButton key={s} id={s} className={segCompactClass}>
                {SPACE_LABEL[s]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        ) : undefined
      }
    >
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needTwo")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* 連続グラデーションプレビュー */}
          <div
            className="border-border-strong rounded-control h-9 border"
            aria-hidden
            style={{
              background: `linear-gradient(90deg, ${steps.join(",")})`,
            }}
          />
          <div className="grid grid-cols-4 gap-[7px] sm:grid-cols-8">
            {steps.map((hex, i) => (
              <ScaleChip
                key={i}
                hex={hex}
                label={String(i + 1)}
                isBase={i === 0 || i === steps.length - 1}
                ariaLabel={t("card.gradient.add", {
                  n: i + 1,
                  hex: fmt(hex),
                })}
                onAdd={() => add(hex)}
              />
            ))}
          </div>
        </div>
      )}
    </CardFrame>
  );
}
