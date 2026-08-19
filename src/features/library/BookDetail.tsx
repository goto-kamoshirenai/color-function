"use client";

import Link from "next/link";
import { NavArrowLeft } from "iconoir-react";
import { CardFrame } from "@/components/Card";
import { BookCover } from "@/components/BookCover";
import { BookBuyLinks } from "@/components/BookBuyLinks";
import { HELP } from "@/features/cards/help";
import type { Book } from "@/lib/references";
import { useLocale, useT } from "@/lib/i18n/locale";
import { ShelfChip } from "./ShelfChip";

/**
 * 書籍の詳細ページ（/library/[id]）。
 * 「この本が本ツールのどの指標に効くか」を書き、指標別リファレンスへ返す。
 * 購入導線はマストヘッドと末尾の2か所に置き、どちらにも PR 表記を添える。
 */
export function BookDetail({ book }: { book: Book }) {
  const locale = useLocale();
  const t = useT();

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] sm:px-[26px] sm:pb-[calc(3.25rem_+_env(safe-area-inset-bottom))]">
      <div className="border-border-strong relative mb-[22px] border-b pt-[26px] pb-4">
        <Link
          href="/library"
          className="text-text-3 hover:text-accent text-meta mb-3.5 inline-flex min-h-6 items-center gap-1 font-mono tracking-[0.08em]"
        >
          <NavArrowLeft width={12} height={12} strokeWidth={2} aria-hidden />
          {t("library.back")}
        </Link>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
          <BookCover book={book} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                CFF·06
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                LIBRARY / BOOK
              </span>
            </div>
            <h1 className="text-[21px] leading-[1.25] font-extrabold tracking-[-0.02em] sm:text-[28px]">
              {book.title}
            </h1>
            <p className="text-text-3 text-meta mt-2 font-mono">
              {book.author} · {book.publisher} · {book.year}
            </p>
            <p className="text-text-2 mt-3 text-[13px] leading-[1.7]">
              {book.pitch[locale]}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
              <ShelfChip shelf={book.shelf} />
              <BookBuyLinks book={book} emphasis />
            </div>
            <p className="text-text-3 text-meta mt-2.5 font-mono tracking-[0.04em]">
              {t("library.affiliateNote")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* 01 この本について */}
        <CardFrame number="01" title={t("library.summary")} helpKey="learn">
          <div className="flex flex-col gap-3">
            {book.summary[locale].map((para) => (
              <p key={para} className="text-[13.5px] leading-[1.8]">
                {para}
              </p>
            ))}
          </div>
        </CardFrame>

        {/* 02 この本が扱う指標 — 指標別リファレンスへ返す */}
        <CardFrame number="02" title={t("library.related")} helpKey="learn">
          <ul className="flex flex-wrap gap-2">
            {book.topics.map((key) => (
              <li key={key}>
                <Link
                  href={`/learn#topic-${key}`}
                  className="border-border-strong text-text-2 rounded-control hover:border-accent hover:text-accent inline-flex min-h-6 items-center border px-2.5 text-[12px]"
                >
                  {HELP[locale][key]?.title ?? key}
                </Link>
              </li>
            ))}
          </ul>
        </CardFrame>
      </div>
    </div>
  );
}
