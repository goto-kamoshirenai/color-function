"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "iconoir-react";
import { CardFrame } from "@/components/Card";
import { GuideShot } from "@/components/GuideShot";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { filterCards } from "@/features/cards/types";
import { layoutFor } from "@/features/cards/layout";
import { HELP } from "@/features/cards/help";
import { useLocale, useT } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";
import type { Unit, View } from "@/store/useColorStore";

/** 早見表に出すモード（設計は単位共通なので1行にまとめる）。 */
const MODES: { unit: Unit; view: View; unitKey: MessageKey | null }[] = [
  { unit: "single", view: "verify", unitKey: "unit.single" },
  { unit: "pair", view: "verify", unitKey: "unit.pair" },
  { unit: "palette", view: "verify", unitKey: "unit.palette" },
  { unit: "palette", view: "design", unitKey: null },
];

const STEPS = [
  { title: "guide.step1.title", body: "guide.step1.body" },
  { title: "guide.step2.title", body: "guide.step2.body" },
  { title: "guide.step3.title", body: "guide.step3.body" },
] as const satisfies readonly { title: MessageKey; body: MessageKey }[];

const ACTIONS = [
  { title: "guide.action.help.title", body: "guide.action.help.body" },
  { title: "guide.action.refs.title", body: "guide.action.refs.body" },
  { title: "guide.action.code.title", body: "guide.action.code.body" },
] as const satisfies readonly { title: MessageKey; body: MessageKey }[];

const EXPORTS = [
  { title: "guide.export.tokens.title", body: "guide.export.tokens.body" },
  { title: "guide.export.share.title", body: "guide.export.share.body" },
  { title: "guide.export.ai.title", body: "guide.export.ai.body" },
] as const satisfies readonly { title: MessageKey; body: MessageKey }[];

const TIPS = [
  "guide.tip.swatch",
  "guide.tip.format",
  "guide.tip.theme",
  "guide.tip.offline",
] as const satisfies readonly MessageKey[];

const DESTINATIONS = [
  { href: "/learn", title: "learn.title", lead: "learn.lead" },
  { href: "/library", title: "library.title", lead: "library.lead" },
  { href: "/code", title: "code.pageTitle", lead: "code.lead" },
] as const satisfies readonly {
  href: string;
  title: MessageKey;
  lead: MessageKey;
}[];

/**
 * 使い方ページ（/guide）。
 * 画面写真は Playwright が実画面から撮ったもの（scripts/generate-guide-shots.mjs）で、
 * モード別のカード一覧は registry と LAYOUT から作る
 * — 文章と実装がずれない範囲を広げておくのが、使い方ページを腐らせないコツ。
 */
export function GuideContent() {
  const locale = useLocale();
  const t = useT();

  const modes = MODES.map(({ unit, view, unitKey }) => {
    const byKey = new Map(
      filterCards(CARD_REGISTRY, unit, view).map((c) => [c.key, c.helpKey]),
    );
    const keys = layoutFor(unit, view)
      .flatMap((row) => row.keys)
      .filter((key) => byKey.has(key));
    // 表示名は指標名なので、同じ指標を扱うカードが2枚あるときは1つにまとめる
    // （枚数はカードの数、名前は観点の数）
    const titles = [
      ...new Set(
        keys.flatMap((key) => {
          const helpKey = byKey.get(key);
          if (!helpKey) return [];
          return [HELP[locale][helpKey]?.title ?? helpKey];
        }),
      ),
    ];
    const label = unitKey
      ? `${t(unitKey)} × ${t("view.verify")}`
      : t("view.design");
    return { id: `${unit}|${view}`, label, count: keys.length, titles };
  });

  return (
    <div className="mx-auto max-w-[900px] px-4 pb-[calc(2.5rem_+_env(safe-area-inset-bottom))] sm:px-[26px] sm:pb-[calc(3.25rem_+_env(safe-area-inset-bottom))]">
      {/* マストヘッド（LearnContent / LibraryContent / CodeContent と同意匠） */}
      <div className="border-border-strong relative mb-[22px] overflow-hidden border-b pt-[26px] pb-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -bottom-[18px] z-0 text-[72px] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-[color-mix(in_srgb,var(--text)_7%,var(--bg))] select-none sm:text-[128px]"
        >
          GUIDE
        </div>
        <div className="relative z-1 flex items-end justify-between gap-[18px]">
          <div>
            <div className="mb-[9px] flex items-center gap-2.5">
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                CFF·08
              </span>
              <span className="bg-accent h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                GUIDE / HOW TO
              </span>
            </div>
            <h1 className="text-[24px] leading-none font-extrabold tracking-[-0.025em] sm:text-[32px]">
              {t("guide.title")}
            </h1>
            <p className="text-text-2 mt-2 text-[13px] leading-[1.6]">
              {t("guide.lead")}
            </p>
          </div>
          <div className="text-text-3 text-right font-mono text-[11px] leading-[1.9] tracking-[0.08em] whitespace-nowrap">
            <div>STEPS — {STEPS.length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* 01 30秒で始める */}
        <CardFrame number="01" title={t("guide.quickstart")} helpKey="usage">
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span className="text-accent text-meta mt-0.5 flex-none font-mono tracking-[0.1em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-bold">{t(step.title)}</h3>
                  <p className="text-text-2 mt-1 text-[12.5px] leading-[1.75]">
                    {t(step.body)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <GuideShot id="palette" alt={t("guide.shot.palette")} />
        </CardFrame>

        {/* 02 モードと表示されるカード（registry + LAYOUT から生成） */}
        <CardFrame number="02" title={t("guide.modes")} helpKey="usage">
          <p className="text-text-2 mb-3.5 text-[12.5px] leading-[1.65]">
            {t("guide.modesLead")}
          </p>
          <dl className="flex flex-col gap-3">
            {modes.map((mode) => (
              <div key={mode.id} className="border-border border-b pb-3">
                <dt className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="text-[13px] font-bold">{mode.label}</span>
                  <span className="text-text-3 text-meta font-mono">
                    {mode.count} {t("guide.modeCards")}
                  </span>
                </dt>
                <dd className="text-text-2 mt-1 text-[12px] leading-[1.7]">
                  {mode.titles.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-text-3 text-meta mt-2.5 font-mono tracking-[0.04em]">
            {t("guide.designNote")}
          </p>
          <GuideShot id="card" alt={t("guide.shot.card")} />
        </CardFrame>

        {/* 03 カード見出しの3つのボタン */}
        <CardFrame number="03" title={t("guide.cardActions")} helpKey="usage">
          <p className="text-text-2 mb-3.5 text-[12.5px] leading-[1.65]">
            {t("guide.cardActionsLead")}
          </p>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-3">
            {ACTIONS.map((action) => (
              <div key={action.title} className="min-w-0">
                <dt className="border-border mb-1.5 border-b pb-1.5 text-[13px] font-bold">
                  {t(action.title)}
                </dt>
                <dd className="text-text-2 text-[12.5px] leading-[1.7]">
                  {t(action.body)}
                </dd>
              </div>
            ))}
          </dl>
          <GuideShot id="snippet" alt={t("guide.shot.snippet")} />
        </CardFrame>

        {/* 04 結果の持ち出し方 */}
        <CardFrame number="04" title={t("guide.export")} helpKey="usage">
          <dl className="flex flex-col gap-3.5">
            {EXPORTS.map((item) => (
              <div key={item.title} className="min-w-0">
                <dt className="text-[13px] font-bold">{t(item.title)}</dt>
                <dd className="text-text-2 mt-1 text-[12.5px] leading-[1.75]">
                  {t(item.body)}
                </dd>
              </div>
            ))}
          </dl>
          <GuideShot id="tokens" alt={t("guide.shot.tokens")} />
        </CardFrame>

        {/* 05 覚えておくと速い */}
        <CardFrame number="05" title={t("guide.tips")} helpKey="usage">
          <ul className="flex flex-col gap-2.5">
            {TIPS.map((tip) => (
              <li
                key={tip}
                className="text-text-2 flex gap-2.5 text-[12.5px] leading-[1.7]"
              >
                <span
                  className="bg-accent mt-[9px] h-px w-2.5 flex-none"
                  aria-hidden
                />
                <span className="min-w-0">{t(tip)}</span>
              </li>
            ))}
          </ul>
        </CardFrame>

        {/* 06 もっと深く知る（3系統への渡り廊下） */}
        <CardFrame number="06" title={t("guide.more")} helpKey="usage">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DESTINATIONS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="border-border hover:border-accent rounded-control group flex h-full flex-col gap-1.5 border px-3.5 py-3"
                >
                  <span className="group-hover:text-accent flex items-center gap-1.5 text-[13px] font-bold">
                    {t(d.title)}
                    <ArrowUpRight
                      width={12}
                      height={12}
                      strokeWidth={2}
                      className="rotate-45"
                      aria-hidden
                    />
                  </span>
                  <span className="text-text-2 text-[12px] leading-[1.6]">
                    {t(d.lead)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
