"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code } from "iconoir-react";
import { CardFrame } from "@/components/Card";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { SNIPPET_KEYS } from "@/features/cards/snippets";
import { HELP } from "@/features/cards/help";
import { CODE_LIBRARIES, librariesForTopic } from "@/lib/references";
import { useLocale, useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

const KIND_KEY = {
  js: "code.kind.js",
  css: "code.kind.css",
} as const satisfies Record<"js" | "css", MessageKey>;

/**
 * 実装画面（/code）— 「使う」側の入口。
 * 記事で学ぶ（/learn）・書籍で学ぶ（/library）に対して、
 * 指標を自分のコードで出すための計算ライブラリを指標に紐づけて並べる。
 */
export function CodeContent() {
  const locale = useLocale();
  const t = useT();

  // 指標→ライブラリの索引（カードのレジストリ順・ライブラリがある指標だけ）
  const topics = [...new Map(CARD_REGISTRY.map((c) => [c.helpKey, c])).values()]
    .map((c) => ({ helpKey: c.helpKey, libs: librariesForTopic(c.helpKey) }))
    .filter((entry) => entry.libs.length > 0);

  // スニペットを持つ指標（ヘルプ文言のある順で並べる）
  const snippetTopics = SNIPPET_KEYS.filter((key) => HELP[locale][key]);

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] sm:px-[26px] sm:pb-[calc(3.25rem_+_env(safe-area-inset-bottom))]">
      {/* マストヘッド（LearnContent / LibraryContent と同意匠） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[72px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-[color-mix(in_srgb,var(--text)_7%,var(--bg))] select-none sm:text-[128px]"
        >
          CODE
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                CFF·07
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                CODE / IMPLEMENT
              </span>
            </div>
            <h1 className="text-[24px] leading-none font-extrabold tracking-[-0.025em] sm:text-[32px]">
              {t("code.pageTitle")}
            </h1>
            <p className="text-text-2 mt-2 text-[13px] leading-[1.6]">
              {t("code.lead")}
            </p>
          </div>
          <div className="text-text-3 text-right font-mono text-[11px] leading-[1.9] tracking-[0.08em] whitespace-nowrap">
            <div>LIBS — {CODE_LIBRARIES.length}</div>
            <div>SNIPPETS — {snippetTopics.length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* 01 計算ライブラリ */}
        <CardFrame number="01" title={t("code.libraries")} helpKey="learn">
          <ul className="flex flex-col gap-5">
            {CODE_LIBRARIES.map((lib) => (
              <li
                key={lib.id}
                id={`lib-${lib.id}`}
                className="border-border scroll-mt-[calc(var(--header-h)_+_12px)] border-b pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h3 className="text-[14px] font-bold">{lib.name}</h3>
                  <span className="border-border-strong text-text-3 rounded-control text-meta inline-flex items-center border px-1.5 py-0.5 font-mono tracking-[0.08em]">
                    {t(KIND_KEY[lib.kind])}
                  </span>
                  {lib.pkg ? (
                    <code className="text-text-3 text-meta font-mono">
                      npm i {lib.pkg}
                    </code>
                  ) : null}
                </div>
                <p className="text-text-2 mt-1.5 text-[12.5px] leading-[1.65]">
                  {lib.pitch[locale]}
                </p>
                <p className="text-text-3 border-border bg-surface-2 rounded-control mt-2 overflow-x-auto border px-2.5 py-1.5 font-mono text-[11.5px] leading-[1.6]">
                  {lib.api}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <a
                    href={lib.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-2 hover:text-accent text-meta inline-flex min-h-6 items-center gap-1 font-mono underline-offset-2 hover:underline"
                  >
                    {t("code.docs")}
                    <ArrowUpRight
                      width={11}
                      height={11}
                      strokeWidth={2}
                      aria-hidden
                    />
                  </a>
                  {lib.repo ? (
                    <a
                      href={lib.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-3 hover:text-accent text-meta inline-flex min-h-6 items-center gap-1 font-mono underline-offset-2 hover:underline"
                    >
                      {t("code.repo")}
                      <ArrowUpRight
                        width={11}
                        height={11}
                        strokeWidth={2}
                        aria-hidden
                      />
                    </a>
                  ) : null}
                  <span className="text-text-3 text-meta min-w-0 font-mono">
                    {lib.topics
                      .map((key) => HELP[locale][key]?.title ?? key)
                      .join(" · ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardFrame>

        {/* 02 指標から探す */}
        <CardFrame number="02" title={t("code.byTopic")} helpKey="learn">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {topics.map(({ helpKey, libs }) => (
              <div key={helpKey} className="min-w-0">
                <dt className="border-border text-text-2 mb-1 border-b pb-1 text-[12.5px] font-bold">
                  {HELP[locale][helpKey]?.title ?? helpKey}
                </dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1">
                  {libs.map((lib) => (
                    <a
                      key={lib.id}
                      href={`#lib-${lib.id}`}
                      className="text-text-3 hover:text-accent inline-flex min-h-6 items-center font-mono text-[12px] underline-offset-2 hover:underline"
                    >
                      {lib.pkg ?? lib.name}
                    </a>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </CardFrame>

        {/* 03 カードから取り出せるコード */}
        <CardFrame number="03" title={t("code.snippets")} helpKey="learn">
          <p className="text-text-2 flex items-center gap-2 text-[12.5px] leading-[1.65]">
            <Code
              width={13}
              height={13}
              strokeWidth={2}
              className="text-accent flex-none"
              aria-hidden
            />
            {t("code.snippetsLead")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {snippetTopics.map((key) => (
              <li key={key}>
                <span className="border-border text-text-2 rounded-control inline-flex min-h-6 items-center border px-2.5 text-[12px]">
                  {HELP[locale][key].title}
                </span>
              </li>
            ))}
          </ul>
        </CardFrame>

        {/* 04 学びの2系統への渡り廊下 */}
        <CardFrame number="04" title={t("learn.title")} helpKey="learn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-text-2 min-w-0 text-[12.5px] leading-[1.65]">
              {t("learn.lead")}
            </p>
            <span className="flex flex-none flex-wrap items-center gap-2">
              <Link
                href="/learn"
                className="cff-control text-text-2 hover:border-accent hover:text-accent inline-flex min-h-9 items-center gap-1.5 px-3 font-mono text-[12px] tracking-[0.06em]"
              >
                {t("code.toLearn")}
                <ArrowUpRight
                  width={12}
                  height={12}
                  strokeWidth={2}
                  className="rotate-45"
                  aria-hidden
                />
              </Link>
              <Link
                href="/library"
                className="cff-control text-text-2 hover:border-accent hover:text-accent inline-flex min-h-9 items-center gap-1.5 px-3 font-mono text-[12px] tracking-[0.06em]"
              >
                {t("code.toLibrary")}
                <ArrowUpRight
                  width={12}
                  height={12}
                  strokeWidth={2}
                  className="rotate-45"
                  aria-hidden
                />
              </Link>
            </span>
          </div>
        </CardFrame>

        <p className="mt-1 text-center">
          <Link
            href="/"
            className="cff-control text-text-2 hover:border-accent hover:text-accent inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-[12.5px]"
          >
            <ArrowLeft width={13} height={13} aria-hidden />
            {t("nav.backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
