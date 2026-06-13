"use client";

import { CardFrame } from "@/components/Card";
import { ResourceLink } from "@/components/ResourceLink";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { HELP } from "@/features/cards/help";
import { REFERENCES, ARTICLES, TOOLS, BOOKS, bookUrl } from "@/lib/references";
import { GLOSSARY } from "@/lib/glossary";
import { useLocale, useT } from "@/lib/i18n/locale";

/**
 * 座学・ベンチツール画面（/learn）。
 * 指標別の参考資料（カードの本マークと同データ）に加え、一般記事・書籍・
 * 外部ツールをまとめ、定量的な色判断に必要な背景知識へ1画面で届くようにする。
 */
export function LearnContent() {
  const locale = useLocale();
  const t = useT();

  // 指標別リファレンス（レジストリ順・資料があるものだけ。helpKey 重複は除外）
  const topics = [
    ...new Map(CARD_REGISTRY.map((c) => [c.helpKey, c])).values(),
  ].filter((c) => REFERENCES[c.helpKey]?.length);

  const totalLinks =
    topics.reduce((n, c) => n + REFERENCES[c.helpKey].length, 0) +
    ARTICLES.length +
    BOOKS.length +
    TOOLS.length +
    GLOSSARY.length;

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] sm:px-[26px] sm:pb-[calc(3.25rem_+_env(safe-area-inset-bottom))]">
      {/* マストヘッド（CardList と同意匠） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[72px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-[color-mix(in_srgb,var(--text)_7%,var(--bg))] select-none sm:text-[128px]"
        >
          LEARN
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                CFF·05
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                LEARN / BENCH
              </span>
            </div>
            <h1 className="text-[24px] leading-none font-extrabold tracking-[-0.025em] sm:text-[32px]">
              {t("learn.title")}
            </h1>
            <p className="text-text-2 mt-2 text-[13px] leading-[1.6]">
              {t("learn.lead")}
            </p>
          </div>
          <div className="text-text-3 text-right font-mono text-[11px] leading-[1.9] tracking-[0.08em] whitespace-nowrap">
            <div>LINKS — {totalLinks}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* 01 指標別リファレンス */}
        <CardFrame number="01" title={t("learn.byTopic")} helpKey="learn">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {topics.map((c) => (
              <section key={c.helpKey}>
                <h3 className="border-border text-text-2 mb-1.5 border-b pb-1.5 text-[13px] font-bold">
                  {HELP[locale][c.helpKey]?.title ?? c.title}
                </h3>
                <ul>
                  {REFERENCES[c.helpKey].map((r) => (
                    <li key={r.url}>
                      <ResourceLink
                        title={r.title}
                        source={r.source}
                        url={r.url}
                        badge={r.lang}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </CardFrame>

        {/* 02 記事・読み物 */}
        <CardFrame number="02" title={t("learn.articles")} helpKey="learn">
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {ARTICLES.map((r) => (
              <li key={r.url}>
                <ResourceLink
                  title={r.title}
                  source={r.source}
                  url={r.url}
                  badge={r.lang}
                />
              </li>
            ))}
          </ul>
        </CardFrame>

        {/* 03 書籍 */}
        <CardFrame number="03" title={t("learn.books")} helpKey="learn">
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {BOOKS.map((b) => (
              <li key={b.query}>
                <ResourceLink
                  title={b.title}
                  source={`${b.author} · ${b.publisher}`}
                  url={bookUrl(b)}
                  badge="book"
                />
              </li>
            ))}
          </ul>
          <p className="text-text-3 text-meta mt-3 font-mono tracking-[0.04em]">
            {t("learn.affiliateNote")}
          </p>
        </CardFrame>

        {/* 04 ベンチツール */}
        <CardFrame number="04" title={t("learn.tools")} helpKey="learn">
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {TOOLS.map((r) => (
              <li key={r.url}>
                <ResourceLink
                  title={r.title}
                  source={r.source}
                  url={r.url}
                  badge={r.lang}
                />
              </li>
            ))}
          </ul>
        </CardFrame>

        {/* 05 用語集 */}
        <CardFrame number="05" title={t("learn.glossary")} helpKey="learn">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {GLOSSARY.map((g) => (
              <div key={g.id}>
                <dt className="border-border mb-1 border-b pb-1 text-[13px] font-bold">
                  {g.term[locale]}
                </dt>
                <dd className="text-text-2 text-[12.5px] leading-[1.7]">
                  {g.def[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </CardFrame>
      </div>
    </div>
  );
}
