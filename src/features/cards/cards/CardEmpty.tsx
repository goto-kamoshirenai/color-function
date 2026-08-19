"use client";

import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * カードの空・不足状態プレースホルダ（共通）。
 * `card.empty`（色が無い）/ `card.needPair` / `card.needTwo` / `card.needMatrix`
 * などを同じ体裁で出す。各カードで p タグとクラスをコピーしていたため、
 * 文字色・サイズが微妙に揺れていた。
 */
export function CardEmpty({ messageKey }: { messageKey: MessageKey }) {
  const t = useT();
  return <p className="text-text-3 font-mono text-xs">{t(messageKey)}</p>;
}
