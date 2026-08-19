"use client";

import Link from "next/link";
import { BookmarkBook } from "iconoir-react";
import { BookBuyLinks } from "@/components/BookBuyLinks";
import { bookById } from "@/lib/references";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * 指標の診断結果が芳しくないとき（あるいは次の一手が明確なとき）に、
 * その論点を体系立てて扱っている書籍へ送る定義。
 * 「困っている瞬間」に出すため、カードの末尾に条件つきで描く。
 */
const NUDGE = {
  contrast: {
    bookId: "coady-color-accessibility",
    message: "booknudge.contrast",
  },
  apca: { bookId: "coady-color-accessibility", message: "booknudge.apca" },
  cvdmatrix: {
    bookId: "coady-color-accessibility",
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
} as const satisfies Record<string, { bookId: string; message: MessageKey }>;

/**
 * 結果連動の書籍導線。`when` が false のときは何も描かない。
 * 書名は図書館の詳細ページへ、チップは購入リンクへ送る（PR 表記つき）。
 */
export function BookNudge({
  helpKey,
  when,
}: {
  helpKey: keyof typeof NUDGE;
  when: boolean;
}) {
  const t = useT();
  const nudge = NUDGE[helpKey];
  const book = bookById(nudge.bookId);
  if (!when || !book) return null;

  return (
    <aside className="border-border border-l-accent rounded-control mt-4 border border-l-[3px] px-3 py-2.5">
      <p className="text-text-3 text-meta mb-1.5 flex items-center gap-1.5 font-mono tracking-[0.14em] uppercase">
        <BookmarkBook width={11} height={11} strokeWidth={2} aria-hidden />
        {t("booknudge.label")}
      </p>
      <p className="text-text-2 mb-2 text-[12px] leading-[1.6]">
        {t(nudge.message)}
      </p>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <Link
          href={`/library/${book.id}`}
          className="hover:text-accent min-w-0 text-[12.5px] font-bold"
        >
          {book.title}
        </Link>
        <BookBuyLinks book={book} />
      </div>
      <p className="text-text-3 text-meta mt-1.5 font-mono tracking-[0.04em]">
        {t("library.affiliateNote")}
      </p>
    </aside>
  );
}
