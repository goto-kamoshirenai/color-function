"use client";

import { parseHex, toHex, generateScheme, contrastRatio } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useHarmonyRules } from "@/lib/useHarmonyRules";
import type { CardProps } from "../types";

function chipColors(hex: string): { bg: string; fg: string } {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const onWhite = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const onBlack = contrastRatio(rgb, { r: 0, g: 0, b: 0 });
  return onWhite >= onBlack
    ? { bg: "rgba(0,0,0,0.45)", fg: "#fff" }
    : { bg: "rgba(255,255,255,0.6)", fg: "#000" };
}

/** 調和スキーム生成カード（v2: 行=名前148px＋52pxチップ列・クリックで追加）。 */
export function CardHarmony({ number }: CardProps) {
  const color = useSelectedColor();
  const rules = useHarmonyRules();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast("追加: " + hex.toUpperCase());
  };

  return (
    <CardFrame
      number={number}
      title="調和スキーム生成"
      enLabel="Harmony"
      helpKey="harmony"
    >
      {!color ? (
        <p className="text-text-3 font-mono text-xs">色がありません</p>
      ) : rules.length === 0 ? (
        <p className="text-text-3 font-mono text-xs">調和ルールを読み込み中…</p>
      ) : (
        <>
          <p className="text-text-3 mt-[5px] mb-[18px] font-mono text-[9.5px] tracking-[0.03em]">
            BASE {color.hex} — クリックでパレットに追加
          </p>
          <div className="flex flex-col gap-[13px]">
            {rules.map((rule) => {
              const base = parseHex(color.hex) ?? { r: 0, g: 0, b: 0 };
              const scheme = generateScheme(base, rule.hueOffsets).map((rgb) =>
                toHex(rgb).toUpperCase(),
              );
              return (
                <div key={rule.id} className="flex items-center gap-4">
                  <div className="w-[148px] flex-none">
                    <div className="text-[13px] font-bold">{rule.label}</div>
                    {rule.sub ? (
                      <div className="text-text-3 font-mono text-[9px] tracking-[0.08em] uppercase">
                        {rule.sub}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-1 gap-[7px]">
                    {scheme.map((hex, i) => {
                      const chip = chipColors(hex);
                      return (
                        <button
                          key={`${rule.id}-${i}`}
                          type="button"
                          onClick={() => add(hex)}
                          aria-label={`${rule.label}の色 ${hex} をパレットに追加`}
                          className="border-border-strong relative flex h-[52px] flex-1 items-end rounded-[2px] border p-1.5 transition-transform hover:-translate-y-0.5"
                          style={{ backgroundColor: hex }}
                        >
                          <span
                            className="rounded-[2px] px-[5px] py-0.5 font-mono text-[9px]"
                            style={{ background: chip.bg, color: chip.fg }}
                          >
                            {hex}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </CardFrame>
  );
}
