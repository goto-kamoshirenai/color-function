"use client";

import type { Book } from "@/lib/references";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

const SHELF_KEY = {
  theory: "library.shelf.theory",
  practice: "library.shelf.practice",
  accessibility: "library.shelf.accessibility",
  psychology: "library.shelf.psychology",
  reference: "library.shelf.reference",
  engineering: "library.shelf.engineering",
} as const satisfies Record<Book["shelf"], MessageKey>;

/** 書架（書籍の性格）のチップ。図書館の一覧・詳細で共用。 */
export function ShelfChip({ shelf }: { shelf: Book["shelf"] }) {
  const t = useT();
  return (
    <span className="border-border text-text-3 rounded-control text-meta inline-flex items-center border px-1.5 py-0.5 font-mono tracking-[0.08em]">
      {t(SHELF_KEY[shelf])}
    </span>
  );
}
