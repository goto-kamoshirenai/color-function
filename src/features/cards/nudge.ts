"use client";

import { useMemo } from "react";
import {
  parseHex,
  contrastRatio,
  judgeWcag,
  apcaContrast,
  apcaUsage,
  cvdConfusablePairs,
  confusablePairs,
  grayscaleOf,
  rgbToLab,
  deltaE2000,
  matchScheme,
  type RGB,
} from "@/core/color";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { useHarmonyRules } from "@/lib/useHarmonyRules";
import type { HarmonyRule } from "@/lib/assets";
import { CARD_REGISTRY } from "./registry";
import { filterCards } from "./types";
import { layoutFor } from "./layout";
import { isNudgeKey, NUDGE_KEYS, type NudgeKey } from "./nudgeSlot";

/**
 * 結果連動の書籍導線を「1画面に1件だけ」出すための判定。
 *
 * 条件はすべてパレット（＋ペアの FG/BG）の純関数なので、各カードに散らさず
 * ここへ集約する。どれを出すかは LAYOUT の並び順で決める
 * — 読み手が最初に出会うカードに付くのが一番自然で、優先度表の二重管理も要らない。
 */
export type NudgeInput = {
  unit: Unit;
  view: View;
  /** パレットの色（並び順）。 */
  hexes: string[];
  /** ペアの前景・背景（2色未満のときは null）。 */
  fgHex: string | null;
  bgHex: string | null;
  rules: HarmonyRule[];
};

const BLACK: RGB = { r: 0, g: 0, b: 0 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };

/** グレースケール化したときに潰れるペアがあるか（CardGrayscale と同条件）。 */
function hasGrayscaleCollision(rgbs: RGB[]): boolean {
  const labs = rgbs.map((c) => rgbToLab(grayscaleOf(c)));
  for (let i = 0; i < labs.length; i++)
    for (let j = i + 1; j < labs.length; j++)
      if (deltaE2000(labs[i], labs[j]) < 10) return true;
  return false;
}

/** 指標ごとの成立可否（各カードの表示条件と同じ判定）。 */
export function nudgeConditions(input: NudgeInput): Record<NudgeKey, boolean> {
  const rgbs = input.hexes.map((hex) => parseHex(hex) ?? BLACK);
  const fg = input.fgHex ? (parseHex(input.fgHex) ?? BLACK) : null;
  const bg = input.bgHex ? (parseHex(input.bgHex) ?? WHITE) : null;
  const pair = fg && bg ? { fg, bg } : null;
  const many = rgbs.length >= 2;

  return {
    contrast: !!pair && !judgeWcag(contrastRatio(pair.fg, pair.bg)).aaNormal,
    apca: !!pair && apcaUsage(apcaContrast(pair.fg, pair.bg)) === "fail",
    cvdmatrix:
      many &&
      (["protan", "deutan", "tritan"] as const).some(
        (type) => cvdConfusablePairs(rgbs, type, 10).length > 0,
      ),
    grayscale: many && hasGrayscaleCollision(rgbs),
    redundancy: many && confusablePairs(rgbs, 10).length > 0,
    scheme:
      many && input.rules.length > 0 && matchScheme(rgbs, input.rules) !== null,
  };
}

/**
 * このモードで描かれるカードのうち、条件を満たす先頭1件の指標。
 * 該当なしは null（＝どのカードも導線を出さない）。
 */
export function activeNudge(input: NudgeInput): NudgeKey | null {
  const cond = nudgeConditions(input);
  if (!NUDGE_KEYS.some((key) => cond[key])) return null;

  const byKey = new Map(
    filterCards(CARD_REGISTRY, input.unit, input.view).map((c) => [
      c.key,
      c.helpKey,
    ]),
  );
  for (const row of layoutFor(input.unit, input.view)) {
    for (const key of row.keys) {
      const helpKey = byKey.get(key);
      if (helpKey && isNudgeKey(helpKey) && cond[helpKey]) return helpKey;
    }
  }
  return null;
}

/** 現在の状態から導線を出す指標を決める（CardList がスロットへ配る）。 */
export function useActiveNudge(): NudgeKey | null {
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const rules = useHarmonyRules();

  // ペアの解決規則は usePairColors と同じ（指定が無ければ先頭と末尾）
  const hexes = palette.map((c) => c.hex);
  const fgHex =
    hexes.length >= 2
      ? (palette.find((c) => c.id === fgId)?.hex ?? hexes[0])
      : null;
  const bgHex =
    hexes.length >= 2
      ? (palette.find((c) => c.id === bgId)?.hex ?? hexes[hexes.length - 1])
      : null;

  const key = hexes.join(",");
  return useMemo(
    () =>
      activeNudge({
        unit,
        view,
        hexes: key ? key.split(",") : [],
        fgHex,
        bgHex,
        rules,
      }),
    [unit, view, key, fgHex, bgHex, rules],
  );
}
