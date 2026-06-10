import type { ComponentType } from "react";
import type { Unit, View } from "@/store/useColorStore";

export type CardCategory =
  | "space"
  | "luminance"
  | "contrast"
  | "difference"
  | "cvd"
  | "stats"
  | "harmony"
  | "generate"
  | "naming"
  | "preview";

export type ModeMatch = { unit: Unit; view: View };

/** カード定義（docs/05 §6 / docs/11 §4）。Component はカード本体（シェルは CardList が付与）。 */
export type CardDef = {
  key: string;
  title: string;
  category: CardCategory;
  appliesTo: ModeMatch[];
  helpKey: string;
  Component: ComponentType;
};

/** 現在の単位×観点に該当するカードを抽出（docs/03 §1）。 */
export function filterCards(
  cards: CardDef[],
  unit: Unit,
  view: View,
): CardDef[] {
  return cards.filter((c) =>
    c.appliesTo.some((m) => m.unit === unit && m.view === view),
  );
}
