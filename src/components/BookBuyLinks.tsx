"use client";

import { bookLinks, type Book } from "@/lib/references";
import { useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

const FORMAT_KEY = {
  print: "book.print",
  kindle: "book.kindle",
} as const satisfies Record<string, MessageKey>;

/**
 * 書籍の購入リンク（単行本 / Kindle）。
 * Amazon アソシエイトのリンクのため rel に sponsored を付け、
 * どこに置いても広告であることが伝わるよう aria-label に PR を含める。
 */
export function BookBuyLinks({
  book,
  emphasis = false,
}: {
  book: Book;
  /** 詳細ページなど、購入導線を主役にする場所で使う強調表示 */
  emphasis?: boolean;
}) {
  const t = useT();
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      {bookLinks(book).map((l) => {
        const label = t(FORMAT_KEY[l.format]);
        return (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={t("book.buyAria", { title: book.title, format: label })}
            className={
              "rounded-control text-meta inline-flex min-h-6 items-center border px-2 font-mono tracking-[0.06em] uppercase " +
              (emphasis
                ? "border-(--text) bg-(--text) text-(--bg) hover:opacity-80"
                : "border-border-strong text-text-2 hover:border-accent hover:text-accent")
            }
          >
            {label}
          </a>
        );
      })}
    </span>
  );
}
