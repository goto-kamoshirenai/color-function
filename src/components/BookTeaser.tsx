"use client";

import Link from "next/link";
import { BookCover } from "./BookCover";
import { BookBuyLinks } from "./BookBuyLinks";
import type { Book } from "@/lib/references";
import { useLocale } from "@/lib/i18n/locale";

/**
 * 書籍の小型紹介ブロック（カバー＋書名＋一言＋購入リンク）。
 * 参考資料ポップオーバーやカードの結果連動導線など、
 * 本文の脇に置く狭い場所で使う。書名は図書館の詳細ページへ送る。
 */
export function BookTeaser({ book }: { book: Book }) {
  const locale = useLocale();
  return (
    <div className="flex min-w-0 gap-2.5">
      <Link
        href={`/library/${book.id}`}
        tabIndex={-1}
        aria-hidden
        className="flex-none"
      >
        <BookCover book={book} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/library/${book.id}`}
          className="hover:text-accent text-[12.5px] leading-[1.4] font-bold"
        >
          {book.title}
        </Link>
        <p className="text-text-3 text-[11.5px] leading-[1.55]">
          {book.pitch[locale]}
        </p>
        <BookBuyLinks book={book} />
      </div>
    </div>
  );
}
