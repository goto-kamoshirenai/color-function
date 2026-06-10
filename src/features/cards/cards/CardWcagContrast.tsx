"use client";

import { parseHex, contrastRatio, judgeWcag } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";
import { usePairColors, useCopy } from "../hooks";

const VERDICT_LABEL = {
  AAA: "AAA 準拠",
  AA: "AA 準拠",
  "AA-large": "大字のみ AA",
  fail: "不適合",
} as const;

function Badge({
  pass,
  label,
  sub,
}: {
  pass: boolean;
  label: string;
  sub: string;
}) {
  return (
    <div
      className={
        "flex items-center justify-between rounded border px-2 py-1 text-[11px] " +
        (pass
          ? "border-text bg-text text-bg"
          : "border-border-strong text-text-3")
      }
    >
      <span>
        {pass ? "✓" : "✕"} {label}
      </span>
      <span className="font-mono">≥ {sub}</span>
    </div>
  );
}

export function CardWcagContrast() {
  const pair = usePairColors();
  const swap = useColorStore((s) => s.selectSwatch);
  const copy = useCopy();
  if (!pair)
    return <p className="text-text-3 text-xs">ペアには2色以上が必要です</p>;

  const fgRgb = parseHex(pair.fg.hex) ?? { r: 0, g: 0, b: 0 };
  const bgRgb = parseHex(pair.bg.hex) ?? { r: 255, g: 255, b: 255 };
  const ratio = contrastRatio(fgRgb, bgRgb);
  const v = judgeWcag(ratio);

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <button
          type="button"
          onClick={() =>
            copy(`${pair.fg.hex} on ${pair.bg.hex} — ${ratio.toFixed(2)}:1`)
          }
          className="text-text font-mono text-3xl hover:opacity-80"
          aria-label="コントラスト比をコピー"
        >
          {ratio.toFixed(2)}
          <span className="text-text-3 text-base"> : 1</span>
        </button>
        <span className="text-text-2 text-xs font-medium">
          {VERDICT_LABEL[v.verdict]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Badge pass={v.aaNormal} label="通常テキスト AA" sub="4.5:1" />
        <Badge pass={v.aaaNormal} label="通常テキスト AAA" sub="7:1" />
        <Badge pass={v.aaLarge} label="大きな文字 AA" sub="3:1" />
        <Badge pass={v.aaaLarge} label="大きな文字 AAA" sub="4.5:1" />
      </div>

      <div className="text-text-3 flex items-center gap-2 text-[10px]">
        <span className="font-mono">FG {pair.fg.hex}</span>
        <button
          type="button"
          onClick={() => swap(pair.bg.id)}
          className="border-border hover:text-text rounded border px-1.5 py-0.5"
        >
          ⇄ 入替
        </button>
        <span className="font-mono">BG {pair.bg.hex}</span>
      </div>

      <div
        className="border-border rounded-md border p-4"
        style={{ backgroundColor: pair.bg.hex }}
      >
        <p className="text-2xl font-bold" style={{ color: pair.fg.hex }}>
          大きな見出しテキスト
        </p>
        <p className="mt-1 text-sm" style={{ color: pair.fg.hex }}>
          通常の本文テキストです。コントラスト比 {ratio.toFixed(2)}:1
          でこの組み合わせが読みやすいかを確認できます。
        </p>
        <p className="mt-1 text-xs" style={{ color: pair.fg.hex }}>
          小さな注釈テキスト 12px — 細部の可読性をチェック。
        </p>
      </div>
    </div>
  );
}
