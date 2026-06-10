"use client";

import { parseHex, contrastRatio, judgeWcag } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { usePairColors, useCopy } from "../hooks";
import type { CardProps } from "../types";

const VERDICT_LABEL = {
  AAA: "AAA 準拠",
  AA: "AA 準拠",
  "AA-large": "大字のみ AA",
  fail: "不適合",
} as const;

/** WCAG コントラスト比カード（v2 ヒーロー: ブラケット・76px比・判定チップ・プレビュー）。 */
export function CardWcagContrast({ number }: CardProps) {
  const pair = usePairColors();
  const selectSwatch = useColorStore((s) => s.selectSwatch);
  const copy = useCopy();

  const fgRgb = pair
    ? (parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 })
    : { r: 0, g: 0, b: 0 };
  const bgRgb = pair
    ? (parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 })
    : { r: 255, g: 255, b: 255 };
  const ratio = contrastRatio(fgRgb, bgRgb);
  const v = judgeWcag(ratio);

  const badges = [
    { label: "通常テキスト AA", sub: "4.5:1", pass: v.aaNormal },
    { label: "通常テキスト AAA", sub: "7:1", pass: v.aaaNormal },
    { label: "大きな文字 AA", sub: "3:1", pass: v.aaLarge },
    { label: "大きな文字 AAA", sub: "4.5:1", pass: v.aaaLarge },
  ];

  return (
    <CardFrame
      number={number}
      title="WCAG コントラスト比"
      enLabel="Contrast Ratio"
      helpKey="contrast"
      hero
      rightSlot={
        pair ? (
          <button
            type="button"
            onClick={() =>
              copy(`${pair.fg.hex} on ${pair.bg.hex} — ${ratio.toFixed(2)}:1`)
            }
            className="border-border-strong text-text-2 hover:bg-surface-2 rounded-[2px] border bg-transparent px-2.5 py-1.5 font-mono text-[10px] tracking-[0.06em] whitespace-nowrap"
          >
            COPY
          </button>
        ) : undefined
      }
    >
      {!pair ? (
        <p className="text-text-3 font-mono text-xs">
          ペアには2色以上が必要です
        </p>
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
                  {VERDICT_LABEL[v.verdict]}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-[9px] sm:grid-cols-2">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="bg-surface flex items-center gap-[11px] rounded-[2px] border px-3 py-2.5"
                  style={{
                    borderColor: b.pass
                      ? "var(--text)"
                      : "var(--border-strong)",
                  }}
                >
                  <span
                    className="inline-flex size-[25px] flex-none items-center justify-center rounded-[2px] border-[1.5px] text-[13px] font-bold"
                    style={{
                      borderColor: b.pass
                        ? "var(--text)"
                        : "var(--border-strong)",
                      background: b.pass ? "var(--text)" : "transparent",
                      color: b.pass ? "var(--bg)" : "var(--text-3)",
                    }}
                  >
                    {b.pass ? "✓" : "✕"}
                  </span>
                  <div>
                    <div className="text-xs font-semibold">{b.label}</div>
                    <div className="text-text-3 font-mono text-[9.5px]">
                      ≥ {b.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border mt-5 overflow-hidden rounded-[2px] border">
            <div className="bg-surface-2 border-border flex flex-wrap items-center justify-between gap-2 border-b px-[13px] py-2">
              <span className="text-text-2 font-mono text-[9.5px] tracking-[0.14em] uppercase">
                テキスト可読性プレビュー / Preview
              </span>
              <div className="text-text-2 flex items-center gap-[9px] font-mono text-[11px]">
                <span className="inline-flex items-center gap-[5px]">
                  <span
                    className="border-border-strong size-[11px] rounded-[2px] border"
                    style={{ backgroundColor: pair.fg.hex }}
                  />
                  FG {pair.fg.hex}
                </span>
                <span className="inline-flex items-center gap-[5px]">
                  <span
                    className="border-border-strong size-[11px] rounded-[2px] border"
                    style={{ backgroundColor: pair.bg.hex }}
                  />
                  BG {pair.bg.hex}
                </span>
                <button
                  type="button"
                  onClick={() => selectSwatch(pair.bg.id)}
                  className="border-border-strong hover:bg-surface-3 rounded-[2px] border bg-transparent px-[9px] py-1 text-[11px]"
                >
                  ⇄ 入替
                </button>
              </div>
            </div>
            <div
              className="px-[22px] py-6"
              style={{ backgroundColor: pair.bg.hex, color: pair.fg.hex }}
            >
              <div className="mb-2 text-[26px] font-extrabold tracking-[-0.01em]">
                大きな見出しテキスト 24px Bold
              </div>
              <div className="mb-1.5 text-[15px]">
                通常の本文テキストです。コントラスト比 {ratio.toFixed(2)}:1
                でこの組み合わせが読みやすいかを確認できます。
              </div>
              <div className="text-xs opacity-85">
                小さな注釈テキスト 12px — 細部の可読性をチェック。
              </div>
            </div>
          </div>
        </>
      )}
    </CardFrame>
  );
}
