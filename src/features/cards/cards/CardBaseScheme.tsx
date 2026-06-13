"use client";

import { parseHex, toHex, rotateHueOklch, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import { ColorCode } from "@/components/ColorCode";
import type { CardProps } from "../types";

const BLACK = { r: 0, g: 0, b: 0 };

/** チップ上の HEX ラベルの可読色（白/黒どちらが乗るか）。 */
function chipLabel(hex: string): { bg: string; fg: string } {
  const rgb = parseHex(hex) ?? BLACK;
  return contrastRatio(rgb, { r: 255, g: 255, b: 255 }) >=
    contrastRatio(rgb, BLACK)
    ? { bg: "rgba(0,0,0,0.45)", fg: "#fff" }
    : { bg: "rgba(255,255,255,0.6)", fg: "#000" };
}

/**
 * 設計（パレット×設計）のサマリーヒーロー（docs/adr/0002）。
 * ベース色を主役にし、代表的な調和（補色・類似色）をクリックで追加できる。
 * 詳細な調和スキーム生成カードは下に残す。
 */
export function CardBaseScheme({ number }: CardProps) {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();
  const fmt = useFormatColor();

  const base = color ? (parseHex(color.hex) ?? BLACK) : BLACK;
  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast(t("toast.add", { hex: fmt(hex) }));
  };

  const suggestions = [
    { label: t("card.basescheme.complement"), offset: 180 },
    { label: t("card.basescheme.analogous"), offset: -30 },
    { label: t("card.basescheme.analogous"), offset: 30 },
  ].map((s) => ({
    ...s,
    hex: toHex(rotateHueOklch(base, s.offset)).toUpperCase(),
  }));

  return (
    <CardFrame
      number={number}
      title={t("card.basescheme.title")}
      enLabel="Base Scheme"
      helpKey="harmony"
      hero
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>
      ) : (
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          <div className="flex items-center gap-3.5 sm:w-[180px] sm:flex-none sm:flex-col sm:items-start">
            <div
              className="border-border-strong rounded-control h-16 w-16 flex-none border sm:h-[88px] sm:w-full"
              style={{ backgroundColor: color.hex }}
              aria-hidden
            />
            <div>
              <div className="text-text-3 text-meta font-mono tracking-[0.14em] uppercase">
                Base
              </div>
              <ColorCode
                hex={color.hex}
                className="text-[14px] font-semibold"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-text-3 text-meta mb-2.5 font-mono tracking-[0.04em]">
              {t("card.basescheme.hint")}
            </div>
            <div className="flex gap-[9px]">
              {suggestions.map((s) => {
                const chip = chipLabel(s.hex);
                return (
                  <div
                    key={`${s.label}-${s.offset}`}
                    className="flex flex-1 flex-col gap-1"
                  >
                    <span className="text-text-2 text-meta font-mono">
                      {s.label}
                    </span>
                    <button
                      type="button"
                      data-specimen
                      onClick={() => add(s.hex)}
                      aria-label={t("card.harmony.add", {
                        label: s.label,
                        hex: fmt(s.hex),
                      })}
                      className="border-border-strong rounded-control relative flex h-[72px] w-full items-end border p-1.5 transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: s.hex }}
                    >
                      <span
                        className="rounded-control text-meta px-[5px] py-0.5 font-mono"
                        style={{ background: chip.bg, color: chip.fg }}
                      >
                        {fmt(s.hex)}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </CardFrame>
  );
}
