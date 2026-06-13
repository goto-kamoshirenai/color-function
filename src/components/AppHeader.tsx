"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book } from "iconoir-react";
import { BrandMark } from "./BrandMark";
import { ColorFormatSelect } from "./ColorFormatSelect";
import { HelpButton } from "./HelpButton";
import { SettingsMenu } from "./SettingsMenu";
import { useT } from "@/lib/i18n/locale";

/** ヘッダー（v2: 56px・ロゴブロック・表示形式・学習コンテンツ・設定）。 */
export function AppHeader() {
  const t = useT();
  const onLearn = usePathname() === "/learn";
  return (
    <header className="border-border-strong bg-surface z-5 flex h-14 flex-none items-center justify-between border-b pr-3 sm:pr-[18px]">
      {/* ロゴブロック全体を / への導線にする（ホームへ戻る） */}
      <Link
        href="/"
        aria-label={t("nav.home")}
        className="group flex h-full items-stretch"
      >
        <div className="border-border group-hover:text-accent flex items-center border-r px-4 transition-colors sm:px-5">
          <BrandMark className="size-8" aria-hidden />
        </div>
        {/* ワードマーク・タグラインは小画面では非表示 */}
        <div className="hidden flex-col justify-center gap-px px-[18px] sm:flex">
          <span className="text-meta font-mono tracking-[0.18em] uppercase">
            Color Follows Function
          </span>
          <span className="text-text-3 text-meta font-mono tracking-[0.14em] uppercase">
            {t("app.tagline")}
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3.5">
        <ColorFormatSelect />
        {/* 使い方ヘルプ（旧: パレットバー下段。学習導線の隣に集約） */}
        <HelpButton helpKey="usage" variant="header" />
        {/* 学習コンテンツ（/learn）への導線。/learn では再押下でホームへ戻るトグル */}
        <Link
          href={onLearn ? "/" : "/learn"}
          aria-label={onLearn ? t("nav.backHome") : t("learn.open")}
          title={onLearn ? t("nav.backHome") : t("learn.open")}
          aria-current={onLearn ? "page" : undefined}
          className={
            "cff-control flex size-9 items-center justify-center " +
            (onLearn
              ? "border-(--text) bg-(--text) text-(--bg) hover:bg-(--text)"
              : "text-text-2 hover:border-accent hover:text-accent")
          }
        >
          <Book width={15} height={15} aria-hidden />
        </Link>
        {/* テーマ・言語は設定メニューに集約 */}
        <SettingsMenu />
      </div>
    </header>
  );
}
