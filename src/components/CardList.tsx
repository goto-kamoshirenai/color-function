"use client";

import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { filterCards } from "@/features/cards/types";

const UNIT_LABEL = {
  single: "単色",
  pair: "ペア",
  palette: "パレット",
} as const;
const VIEW_LABEL = { verify: "検証", design: "設計" } as const;
const MODE_WORD = {
  single: "SINGLE",
  pair: "CONTRAST",
  palette: "PALETTE",
} as const;
const FIG_TAG = {
  single: "CFF·01",
  pair: "CFF·02",
  palette: "CFF·03",
} as const;

/** モード別のカード配置（v2 のグリッド構成。キーは registry のカード）。 */
const LAYOUT: Record<string, { className: string; keys: string[] }[]> = {
  "single|verify": [
    { className: "", keys: ["value"] },
    { className: "md:grid-cols-[1.35fr_1fr]", keys: ["hsv", "luminance"] },
    { className: "md:grid-cols-2", keys: ["hue-wheel", "nearest-name"] },
  ],
  "pair|verify": [
    { className: "", keys: ["wcag-contrast"] },
    { className: "md:grid-cols-[1fr_1.3fr]", keys: ["delta-e", "cvd"] },
  ],
  "palette|verify": [
    { className: "", keys: ["contrast-matrix"] },
    {
      className: "md:grid-cols-[1.4fr_1fr]",
      keys: ["delta-matrix", "hue-distribution"],
    },
  ],
  design: [
    { className: "", keys: ["harmony"] },
    { className: "", keys: ["tone"] },
  ],
};

function layoutFor(unit: Unit, view: View) {
  return view === "design" ? LAYOUT.design : LAYOUT[`${unit}|verify`];
}

/** マストヘッド＋モード別カードグリッド（v2 メイン領域）。 */
export function CardList() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const paletteCount = useColorStore((s) => s.palette.length);

  const cards = filterCards(CARD_REGISTRY, unit, view);
  const byKey = new Map(cards.map((c) => [c.key, c]));
  const rows = layoutFor(unit, view);

  const modeWord = view === "design" ? "SCHEME" : MODE_WORD[unit];
  const figTag = view === "design" ? "CFF·04" : FIG_TAG[unit];
  const modeSub =
    (view === "design"
      ? "DESIGN"
      : MODE_WORD[unit] === "CONTRAST"
        ? "PAIR"
        : MODE_WORD[unit]) +
    " / " +
    (view === "verify" ? "VERIFY" : "DESIGN");

  let n = 0;
  const nextNumber = () => String(++n).padStart(2, "0");

  return (
    <div className="mx-auto max-w-[900px] px-[26px] pb-[52px]">
      {/* マストヘッド（v2: 巨大背景ワード＋figタグ＋タイトル＋カウンタ） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="text-surface-2 pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[128px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap select-none"
        >
          {modeWord}
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent font-mono text-[10px] tracking-[0.14em]">
                {figTag}
              </span>
              <span className="bg-border-strong h-px w-[22px]" aria-hidden />
              <span className="text-text-3 font-mono text-[10px] tracking-[0.14em]">
                {modeSub}
              </span>
            </div>
            <h1 className="text-[32px] leading-none font-extrabold tracking-[-0.025em]">
              {UNIT_LABEL[unit]} × {VIEW_LABEL[view]}
            </h1>
          </div>
          <div className="text-text-3 text-right font-mono text-[10px] leading-[1.9] tracking-[0.08em] whitespace-nowrap">
            <div>CARDS — {cards.length}</div>
            <div>SWATCHES — {paletteCount}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {rows.map((row, ri) => (
          <div key={ri} className={`grid grid-cols-1 gap-3.5 ${row.className}`}>
            {row.keys.map((key) => {
              const def = byKey.get(key);
              if (!def) return null;
              return <def.Component key={key} number={nextNumber()} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
