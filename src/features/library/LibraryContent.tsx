"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "iconoir-react";
import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { CardFrame } from "@/components/Card";
import { segCompactClass, pickKey } from "@/components/segmented";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { HELP } from "@/features/cards/help";
import { BOOKS, booksForTopic } from "@/lib/references";
import { useLocale, useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import { BookRow } from "./BookRow";

/** 蔵書の絞り込み軸（読者）。`both` の書籍はどちらの側にも出す。 */
const AUDIENCES = ["all", "engineer", "designer"] as const;
type AudienceFilter = (typeof AUDIENCES)[number];

const AUDIENCE_KEY = {
  all: "library.audience.all",
  engineer: "library.audience.engineer",
  designer: "library.audience.designer",
} as const satisfies Record<AudienceFilter, MessageKey>;

/**
 * 図書館画面（/library）。
 * 「記事で学ぶ = /learn」に対する「書籍で学ぶ」側の入口で、
 * 蔵書と、指標（helpKey）から書籍を引く索引を持つ。
 */
export function LibraryContent() {
  const locale = useLocale();
  const t = useT();
  const [audience, setAudience] = useState<AudienceFilter>("all");

  const books = BOOKS.filter(
    (b) =>
      audience === "all" || b.audience === audience || b.audience === "both",
  );

  // 指標→書籍の索引（カードのレジストリ順・書籍がある指標だけ）
  const topics = [...new Map(CARD_REGISTRY.map((c) => [c.helpKey, c])).values()]
    .map((c) => ({ helpKey: c.helpKey, books: booksForTopic(c.helpKey) }))
    .filter((entry) => entry.books.length > 0);

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] sm:px-[26px] sm:pb-[calc(3.25rem_+_env(safe-area-inset-bottom))]">
      {/* マストヘッド（LearnContent と同意匠） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[72px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-[color-mix(in_srgb,var(--text)_7%,var(--bg))] select-none sm:text-[128px]"
        >
          LIBRARY
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                CFF·06
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                LIBRARY / BOOKS
              </span>
            </div>
            <h1 className="text-[24px] leading-none font-extrabold tracking-[-0.025em] sm:text-[32px]">
              {t("library.title")}
            </h1>
            <p className="text-text-2 mt-2 text-[13px] leading-[1.6]">
              {t("library.lead")}
            </p>
          </div>
          <div className="text-text-3 text-right font-mono text-[11px] leading-[1.9] tracking-[0.08em] whitespace-nowrap">
            <div>BOOKS — {books.length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* 01 蔵書（読者で絞り込める。実装者が自分の棚へ最短で行けるように） */}
        <CardFrame
          number="01"
          title={t("library.books")}
          helpKey="learn"
          rightSlot={
            <ToggleButtonGroup
              selectionMode="single"
              disallowEmptySelection
              aria-label={t("library.audience")}
              selectedKeys={[audience]}
              onSelectionChange={(keys) => {
                const next = pickKey(keys, AUDIENCES);
                if (next) setAudience(next);
              }}
              className="border-border-strong rounded-control inline-flex shrink-0 overflow-hidden border"
            >
              {AUDIENCES.map((a) => (
                <ToggleButton key={a} id={a} className={segCompactClass}>
                  {t(AUDIENCE_KEY[a])}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
        >
          <ul className="grid grid-cols-1 gap-x-7 gap-y-6 sm:grid-cols-2">
            {books.map((b) => (
              <li key={b.id}>
                <BookRow book={b} />
              </li>
            ))}
          </ul>
          <p className="text-text-3 text-meta mt-5 font-mono tracking-[0.04em]">
            {t("library.affiliateNote")}
          </p>
        </CardFrame>

        {/* 02 指標から探す */}
        <CardFrame number="02" title={t("library.byTopic")} helpKey="learn">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {topics.map(({ helpKey, books }) => (
              <div key={helpKey} className="min-w-0">
                <dt className="border-border text-text-2 mb-1 border-b pb-1 text-[12.5px] font-bold">
                  {HELP[locale][helpKey]?.title ?? helpKey}
                </dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1">
                  {books.map((b) => (
                    <Link
                      key={b.id}
                      href={`/library/${b.id}`}
                      className="text-text-3 hover:text-accent inline-flex min-h-6 items-center text-[12px] underline-offset-2 hover:underline"
                    >
                      {b.title}
                    </Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </CardFrame>

        {/* 03 記事側（/learn）への渡り廊下 */}
        <CardFrame number="03" title={t("library.toLearn")} helpKey="learn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-text-2 min-w-0 text-[12.5px] leading-[1.65]">
              {t("learn.lead")}
            </p>
            <Link
              href="/learn"
              className="cff-control text-text-2 hover:border-accent hover:text-accent inline-flex min-h-9 flex-none items-center gap-1.5 px-3 font-mono text-[12px] tracking-[0.06em]"
            >
              {t("library.toLearnCta")}
              <ArrowUpRight
                width={12}
                height={12}
                strokeWidth={2}
                className="rotate-45"
                aria-hidden
              />
            </Link>
          </div>
        </CardFrame>
      </div>
    </div>
  );
}
