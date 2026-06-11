"use client";

import { ThemeToggle } from "./ThemeToggle";
import { ShareButton } from "./ShareButton";
import { LanguageToggle } from "./LanguageToggle";
import { ColorFormatSelect } from "./ColorFormatSelect";
import { useT } from "@/lib/i18n/locale";

/** ヘッダー（v2: 56px・ロゴブロック・表示形式・SHARE・言語切替・テーマ切替）。 */
export function AppHeader() {
  const t = useT();
  return (
    <header className="border-border-strong bg-surface z-5 flex h-14 flex-none items-center justify-between border-b pr-[18px]">
      <div className="flex h-full items-stretch">
        <div className="border-border flex items-center gap-[11px] border-r px-5">
          <span className="text-[19px] font-black tracking-[-0.04em]">CFF</span>
        </div>
        <div className="flex flex-col justify-center gap-px px-[18px]">
          <span className="text-meta font-mono tracking-[0.18em] uppercase">
            Color Follows Function
          </span>
          <span className="text-text-3 text-meta font-mono tracking-[0.14em] uppercase">
            {t("app.tagline")}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3.5">
        <ColorFormatSelect />
        <ShareButton />
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
