"use client";

import { parseHex, toHex, generateTones, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** チップ上のラベル色（色面とのコントラストが高い方の白/黒）。 */
function labelColor(hex: string): string {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const onWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const onBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 });
  return onBlack >= onWhite ? "#000" : "#fff";
}

/** トーン展開カード（MUI 流の 50〜900・10段階。500=基準色）。 */
export function CardTone({ number }: CardProps) {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex }));
  };

  return (
    <CardFrame
      number={number}
      title={t("card.tone.title")}
      enLabel="Tone Scale"
      helpKey="tone"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="grid grid-cols-5 gap-[7px] lg:grid-cols-10">
          {generateTones(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 }).map(
            ({ step, rgb }) => {
              const hex = toHex(rgb).toUpperCase();
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => add(hex)}
                  aria-label={t("card.tone.add", { step, hex })}
                  title={hex}
                  className="border-border-strong rounded-control relative h-[52px] border p-0 transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: hex }}
                >
                  {/* 500 = 基準色（下線で示す） */}
                  <span
                    className={
                      "text-meta absolute inset-x-0 bottom-1 text-center font-mono " +
                      (step === 500
                        ? "font-bold underline underline-offset-2"
                        : "font-medium")
                    }
                    style={{ color: labelColor(hex) }}
                  >
                    {step}
                  </span>
                </button>
              );
            },
          )}
        </div>
      )}
    </CardFrame>
  );
}
