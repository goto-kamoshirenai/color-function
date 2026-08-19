"use client";

import Link from "next/link";
import { ArrowUpRight } from "iconoir-react";
import { BookCover } from "@/components/BookCover";
import { BOOKS } from "@/lib/references";
import { useT } from "@/lib/i18n/locale";

/** 帯に並べるカバーの上限（40px 幅 × 5 + 隙間で 320px 端末に収まる）。 */
const MAX_COVERS = 5;

/**
 * 学習コンテンツ（/learn）から図書館（/library）へ渡す帯。
 * 「記事で学ぶ」ページの先頭に置き、腰を据えて学ぶ経路が別にあることを示す。
 * 蔵書のカバーを並べ、書籍の棚であることをひと目で伝える。
 */
export function LibraryBridge() {
  const t = useT();
  return (
    <Link
      href="/library"
      className="border-border-strong bg-surface rounded-control hover:border-accent group flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5 border px-4 py-3.5 sm:px-[22px]"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
        {/* 蔵書が増えても帯は 1 行に収める（320px 幅で溢れないよう冊数を絞る） */}
        <span className="flex flex-none flex-wrap gap-1" aria-hidden>
          {BOOKS.slice(0, MAX_COVERS).map((b) => (
            <BookCover key={b.id} book={b} />
          ))}
        </span>
        <span className="min-w-0">
          <span className="group-hover:text-accent block text-[14px] font-bold">
            {t("learn.toLibrary")}
          </span>
          <span className="text-text-2 mt-0.5 block text-[12.5px] leading-[1.6]">
            {t("learn.toLibraryLead")}
          </span>
        </span>
      </div>
      <span className="cff-control text-text-2 group-hover:border-accent group-hover:text-accent inline-flex min-h-9 flex-none items-center gap-1.5 px-3 font-mono text-[12px] tracking-[0.06em]">
        {t("learn.toLibraryCta")}
        <ArrowUpRight
          width={12}
          height={12}
          strokeWidth={2}
          className="rotate-45"
          aria-hidden
        />
      </span>
    </Link>
  );
}
