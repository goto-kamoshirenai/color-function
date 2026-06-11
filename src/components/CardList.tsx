"use client";

import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { filterCards } from "@/features/cards/types";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

const UNIT_KEY = {
  single: "unit.single",
  pair: "unit.pair",
  palette: "unit.palette",
} as const satisfies Record<Unit, MessageKey>;
const VIEW_KEY = {
  verify: "view.verify",
  design: "view.design",
} as const satisfies Record<View, MessageKey>;
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
    { className: "", keys: ["hue-shift"] },
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
  const t = useT();

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
    <div className="mx-auto max-w-[900px] px-4 pb-10 sm:px-[26px] sm:pb-[52px]">
      {/* マストヘッド（v2: 巨大背景ワード＋figタグ＋タイトル＋カウンタ）。
          透かしの色はテーマ相対の color-mix（surface-2 はライトで bg より明るく潰れるため） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[72px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-[color-mix(in_srgb,var(--text)_7%,var(--bg))] select-none sm:text-[128px]"
        >
          {modeWord}
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                {figTag}
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                {modeSub}
              </span>
            </div>
            <h1 className="text-[24px] leading-none font-extrabold tracking-[-0.025em] sm:text-[32px]">
              {t(UNIT_KEY[unit])} × {t(VIEW_KEY[view])}
            </h1>
          </div>
          <div className="text-text-3 text-meta text-right font-mono leading-[1.9] tracking-[0.08em] whitespace-nowrap">
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
