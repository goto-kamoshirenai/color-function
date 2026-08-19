"use client";

import Link from "next/link";
import { ArrowUpRight } from "iconoir-react";
import { BookCover } from "@/components/BookCover";
import { BookBuyLinks } from "@/components/BookBuyLinks";
import { ShelfChip } from "./ShelfChip";
import type { Book } from "@/lib/references";
import { useLocale, useT } from "@/lib/i18n/locale";

/**
 * 蔵書一覧の1件（カバー＋書名＋書誌＋一言レコメンド＋購入リンク）。
 * 書名は詳細ページ（内部）へ、チップは Amazon（外部）へ送る。
 */
export function BookRow({ book }: { book: Book }) {
  const locale = useLocale();
  const t = useT();
  return (
    <article className="flex min-w-0 gap-3.5">
      <Link
        href={`/library/${book.id}`}
        tabIndex={-1}
        aria-hidden
        className="flex-none"
      >
        <BookCover book={book} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="min-w-0">
          <h3 className="text-[13.5px] leading-[1.4] font-bold">
            <Link
              href={`/library/${book.id}`}
              className="hover:text-accent inline-flex items-baseline gap-1"
            >
              {book.title}
            </Link>
          </h3>
          <p className="text-text-3 text-meta mt-0.5 font-mono">
            {book.author} · {book.publisher} · {book.year}
          </p>
        </div>
        <p className="text-text-2 text-[12.5px] leading-[1.65]">
          {book.pitch[locale]}
        </p>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <ShelfChip shelf={book.shelf} />
          <BookBuyLinks book={book} />
          <Link
            href={`/library/${book.id}`}
            className="text-text-3 hover:text-accent text-meta inline-flex min-h-6 items-center gap-1 font-mono underline-offset-2 hover:underline"
          >
            {t("library.detail")}
            <ArrowUpRight
              width={11}
              height={11}
              strokeWidth={2}
              className="rotate-45"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
