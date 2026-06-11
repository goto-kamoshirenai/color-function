"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book } from "iconoir-react";
import { BrandMark } from "./BrandMark";
import { ColorFormatSelect } from "./ColorFormatSelect";
import { SettingsMenu } from "./SettingsMenu";
import { useT } from "@/lib/i18n/locale";

/** ヘッダー（v2: 56px・ロゴブロック・表示形式・学習コンテンツ・設定）。 */
export function AppHeader() {
  const t = useT();
  const onLearn = usePathname() === "/learn";
  return (
    <header className="border-border-strong bg-surface z-5 flex h-14 flex-none items-center justify-between border-b pr-3 sm:pr-[18px]">
      <div className="flex h-full items-stretch">
        <div className="border-border flex items-center gap-[7px] border-r px-4 sm:px-5">
          <BrandMark className="size-8" role="img" aria-label="CFF" />
          {/* アクセントのインジケータ（指定色がブランドにも乗る） */}
          <span className="bg-accent mt-0.5 size-2 rounded-full" aria-hidden />
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
      </div>
      <div className="flex items-center gap-2 sm:gap-3.5">
        <ColorFormatSelect />
        {/* 学習コンテンツ（/learn）への導線 */}
        <Link
          href="/learn"
          aria-label={t("learn.open")}
          title={t("learn.open")}
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
