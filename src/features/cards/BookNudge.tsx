"use client";

import Link from "next/link";
import { BookmarkBook, ArrowRight } from "iconoir-react";
import { bookById } from "@/lib/references";
import { useT } from "@/lib/i18n/locale";
import { NUDGE, useNudgeSlot, type NudgeKey } from "./nudgeSlot";

/**
 * 結果連動の書籍導線（カード末尾の1行）。
 *
 * 出すかどうかは自分では決めず、1画面に1件だけ選ばれたスロット（nudge.ts）と
 * 照合する。購入リンクは置かず図書館の詳細ページへ送るだけに留める
 * — 診断の途中で売り込まない、というのがこの導線の作法。
 */
export function BookNudge({ helpKey }: { helpKey: NudgeKey }) {
  const slot = useNudgeSlot();
  const t = useT();
  const nudge = NUDGE[helpKey];
  const book = bookById(nudge.bookId);
  if (slot !== helpKey || !book) return null;

  return (
    <p className="mt-3.5">
      <Link
        href={`/library/${book.id}`}
        className="text-text-3 hover:text-accent inline-flex min-h-6 items-center gap-1.5 text-[12px] leading-[1.5]"
      >
        <BookmarkBook
          width={11}
          height={11}
          strokeWidth={2}
          className="flex-none"
          aria-hidden
        />
        <span className="min-w-0">
          {t(nudge.message)} — {book.title}
        </span>
        <ArrowRight
          width={11}
          height={11}
          strokeWidth={2}
          className="flex-none"
          aria-hidden
        />
      </Link>
    </p>
  );
}
