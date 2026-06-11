"use client";

import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { ColorFormatSelect } from "./ColorFormatSelect";
import { useT } from "@/lib/i18n/locale";

/** ヘッダー（v2: 56px・ロゴブロック・表示形式・言語切替・テーマ切替）。 */
export function AppHeader() {
  const t = useT();
  return (
    <header className="border-border-strong bg-surface z-5 flex h-14 flex-none items-center justify-between border-b pr-3 sm:pr-[18px]">
      <div className="flex h-full items-stretch">
        <div className="border-border flex items-center gap-[7px] border-r px-4 sm:px-5">
          <span className="text-[19px] font-black tracking-[-0.04em]">CFF</span>
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
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
