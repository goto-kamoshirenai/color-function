"use client";

import { createContext, useContext } from "react";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * 結果連動の書籍導線（カード末尾の1行）の定義とスロット。
 *
 * 「どの指標で出しうるか」と「どの書籍へ送るか」だけを持ち、
 * 条件判定（nudge.ts）にもカード実装にも依存しない
 * — カードから参照される最下層のため、registry を巻き込むと循環参照になる。
 */
export const NUDGE_KEYS = [
  "contrast",
  "apca",
  "cvdmatrix",
  "grayscale",
  "redundancy",
  "scheme",
] as const;

export type NudgeKey = (typeof NUDGE_KEYS)[number];

/** helpKey が導線を持つ指標かを判定する。 */
export function isNudgeKey(key: string): key is NudgeKey {
  return (NUDGE_KEYS as readonly string[]).includes(key);
}

/**
 * 指標 → 送り先の書籍と、リンクに添える短い一言。
 * 説明文は書かない（カード本文の結果がすでに理由を語っているため）。
 */
export const NUDGE = {
  contrast: {
    bookId: "coady-color-accessibility",
    message: "booknudge.contrast",
  },
  apca: { bookId: "coady-color-accessibility", message: "booknudge.apca" },
  cvdmatrix: {
    bookId: "cudo-color-universal-design",
    message: "booknudge.cvdmatrix",
  },
  grayscale: {
    bookId: "coady-color-accessibility",
    message: "booknudge.grayscale",
  },
  redundancy: {
    bookId: "albers-interaction-of-color",
    message: "booknudge.redundancy",
  },
  scheme: {
    bookId: "sakurai-color-idea-notebook",
    message: "booknudge.scheme",
  },
} as const satisfies Record<NudgeKey, { bookId: string; message: MessageKey }>;

/**
 * いま導線を出す指標（1画面につき最大1件）。CardList が決めて配る。
 * 既定は null＝出さない（カードを単体で描いたときは静かなまま）。
 */
const NudgeSlotContext = createContext<NudgeKey | null>(null);

export const NudgeSlotProvider = NudgeSlotContext.Provider;

/** 自分の指標が今回のスロットに選ばれているかを見るために使う。 */
export function useNudgeSlot(): NudgeKey | null {
  return useContext(NudgeSlotContext);
}
