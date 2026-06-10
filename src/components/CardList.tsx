"use client";

import { useColorStore } from "@/store/useColorStore";
import { Card } from "./Card";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { filterCards } from "@/features/cards/types";

const UNIT_LABEL = {
  single: "単色",
  pair: "ペア",
  palette: "パレット",
} as const;
const VIEW_LABEL = { verify: "検証", design: "設計" } as const;

/** 現在のモードに該当するカードを並べる（docs/03 §1）。 */
export function CardList() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const cards = filterCards(CARD_REGISTRY, unit, view);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-text-3 font-mono text-[11px] tracking-widest">
          {UNIT_LABEL[unit]} × {VIEW_LABEL[view]}
        </span>
        <span className="text-text-3 font-mono text-[11px]">
          · {cards.length} カード
        </span>
      </div>

      {cards.length === 0 ? (
        <p className="text-text-3 text-sm">
          このモードのカードは順次追加されます。
        </p>
      ) : (
        <div className="space-y-3">
          {cards.map((c) => (
            <Card key={c.key} title={c.title} helpKey={c.helpKey}>
              <c.Component />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
