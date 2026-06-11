"use client";

import { Check, Xmark, Copy, DataTransferBoth } from "iconoir-react";
import { parseHex, contrastRatio, judgeWcag } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { usePairColors, useCopy } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";
import type { MessageKey } from "@/lib/i18n/messages";
import type { CardProps } from "../types";

const VERDICT_KEY = {
  AAA: "card.contrast.verdictAAA",
  AA: "card.contrast.verdictAA",
  "AA-large": "card.contrast.verdictAALarge",
  fail: "card.contrast.verdictFail",
} as const satisfies Record<string, MessageKey>;

/** WCAG コントラスト比カード（v2 ヒーロー: ブラケット・76px比・判定チップ・プレビュー）。 */
export function CardWcagContrast({ number }: CardProps) {
  const pair = usePairColors();
  const selectSwatch = useColorStore((s) => s.selectSwatch);
  const copy = useCopy();
  const t = useT();
  const fmt = useFormatColor();

  const fgRgb = pair
    ? (parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const bgRgb = pair
    ? (parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 })
    : { r: 255, g: 255, b: 255 };
  const ratio = contrastRatio(fgRgb, bgRgb);
  const v = judgeWcag(ratio);

  const badges = [
    { label: t("card.contrast.normalAA"), sub: "4.5:1", pass: v.aaNormal },
    { label: t("card.contrast.normalAAA"), sub: "7:1", pass: v.aaaNormal },
    { label: t("card.contrast.largeAA"), sub: "3:1", pass: v.aaLarge },
    { label: t("card.contrast.largeAAA"), sub: "4.5:1", pass: v.aaaLarge },
  ];

  return (
    <CardFrame
      number={number}
      title={t("card.contrast.title")}
      enLabel="Contrast Ratio"
      helpKey="contrast"
      hero
      rightSlot={
        pair ? (
          <button
            type="button"
            onClick={() =>
              copy(
                `${fmt(pair.fg.hex)} on ${fmt(pair.bg.hex)} — ${ratio.toFixed(2)}:1`,
              )
            }
            className="cff-control text-text-2 inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[12px] tracking-[0.06em] whitespace-nowrap"
          >
            <Copy width={12} height={12} aria-hidden />
            COPY
          </button>
        ) : undefined
      }
    >
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needPair")}</p>
      ) : (
        <>
          <div className="grid items-center gap-7 md:grid-cols-[auto_1fr]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[76px] leading-[0.85] font-semibold tracking-[-0.05em]">
                  {ratio.toFixed(2)}
                </span>
                <span className="text-accent font-mono text-[26px] font-medium">
                  :1
                </span>
              </div>
              <div className="border-accent mt-3.5 inline-flex items-center gap-[9px] rounded-r-[2px] border border-l-[3px] border-(--text) py-1.5 pr-3 pl-[11px]">
                <span className="text-xs font-bold tracking-[0.02em]">
                  {t(VERDICT_KEY[v.verdict])}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-[9px] sm:grid-cols-2">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="bg-surface rounded-control flex items-center gap-[11px] border px-3 py-2.5"
                  style={{
                    borderColor: b.pass
                      ? "var(--text)"
                      : "var(--border-strong)",
                  }}
                >
                  <span
                    className="rounded-control inline-flex size-[25px] flex-none items-center justify-center border-[1.5px] text-[13px] font-bold"
                    style={{
                      borderColor: b.pass
                        ? "var(--text)"
                        : "var(--border-strong)",
                      background: b.pass ? "var(--text)" : "transparent",
                      color: b.pass ? "var(--bg)" : "var(--text-3)",
                    }}
                  >
                    {b.pass ? (
                      <Check
                        width={14}
                        height={14}
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    ) : (
                      <Xmark
                        width={14}
                        height={14}
                        strokeWidth={2}
                        aria-hidden
                      />
                    )}
                  </span>
                  <div>
                    <div className="text-xs font-semibold">{b.label}</div>
                    <div className="text-text-3 text-meta font-mono">
                      ≥ {b.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border rounded-control mt-5 overflow-hidden border">
            <div className="bg-surface-2 border-border flex flex-wrap items-center justify-between gap-2 border-b px-[13px] py-2">
              <span className="text-text-2 text-meta font-mono tracking-[0.14em] uppercase">
                {t("card.contrast.preview")}
              </span>
              <div className="text-text-2 text-meta flex items-center gap-[9px] font-mono">
                <span className="inline-flex items-center gap-[5px]">
                  <span
                    className="border-border-strong rounded-control size-[11px] border"
                    style={{ backgroundColor: pair.fg.hex }}
                  />
                  FG {fmt(pair.fg.hex)}
                </span>
                <span className="inline-flex items-center gap-[5px]">
                  <span
                    className="border-border-strong rounded-control size-[11px] border"
                    style={{ backgroundColor: pair.bg.hex }}
                  />
                  BG {fmt(pair.bg.hex)}
                </span>
                <button
                  type="button"
                  onClick={() => selectSwatch(pair.bg.id)}
                  className="cff-control hover:bg-surface-3 inline-flex items-center gap-1 px-[9px] py-1 text-[12px]"
                >
                  <DataTransferBoth
                    width={12}
                    height={12}
                    className="rotate-90"
                    aria-hidden
                  />
                  {t("card.contrast.swap")}
                </button>
              </div>
            </div>
            <div
              className="px-[22px] py-6"
              style={{ backgroundColor: pair.bg.hex, color: pair.fg.hex }}
            >
              <div className="mb-2 text-[26px] font-extrabold tracking-[-0.01em]">
                {t("card.contrast.sampleHeading")}
              </div>
              <div className="mb-1.5 text-[15px]">
                {t("card.contrast.sampleBody", { ratio: ratio.toFixed(2) })}
              </div>
              <div className="text-xs opacity-85">
                {t("card.contrast.sampleCaption")}
              </div>
            </div>
          </div>
        </>
      )}
    </CardFrame>
  );
}
