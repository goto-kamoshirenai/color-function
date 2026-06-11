"use client";

import type { ReactNode } from "react";
import { HelpButton } from "./HelpButton";
import { useLocale } from "@/lib/i18n/locale";

/**
 * v2 カード枠: 連番(accent) + 太字タイトル + EN小ラベル + ?ヘルプ。
 * hero はコーナーブラケット付き（WCAG ヒーローカード）。
 * rightSlot 指定時はヘルプをタイトル行内に移す（v2 のレイアウト規則）。
 * EN小ラベルは英語 UI ではタイトルと重複するため表示しない。
 */
export function CardFrame({
  number,
  title,
  enLabel,
  helpKey,
  rightSlot,
  hero = false,
  children,
}: {
  number: string;
  title: string;
  enLabel?: string;
  helpKey: string;
  rightSlot?: ReactNode;
  hero?: boolean;
  children: ReactNode;
}) {
  const locale = useLocale();
  const help = <HelpButton helpKey={helpKey} />;
  const showEnLabel = locale === "ja" && !!enLabel;
  return (
    <section
      className={
        // flex-col: カード本文が flex-1 で「ヘッダーを除く残り高さ」を埋められるように
        // （h-full はヘッダー分を含む高さに解決されて下にはみ出すため使わない）
        "bg-surface rounded-control relative flex flex-col border " +
        (hero
          ? "border-border-strong px-6 py-[22px]"
          : "border-border px-[22px] py-[18px]")
      }
    >
      {hero ? (
        <>
          <span
            aria-hidden
            className="border-accent absolute top-2 left-2 size-[11px] border-t-[1.5px] border-l-[1.5px]"
          />
          <span
            aria-hidden
            className="border-accent absolute top-2 right-2 size-[11px] border-t-[1.5px] border-r-[1.5px]"
          />
          <span
            aria-hidden
            className="border-accent absolute bottom-2 left-2 size-[11px] border-b-[1.5px] border-l-[1.5px]"
          />
          <span
            aria-hidden
            className="border-accent absolute right-2 bottom-2 size-[11px] border-r-[1.5px] border-b-[1.5px]"
          />
        </>
      ) : null}

      <header className="border-border mb-4 flex items-end justify-between border-b pb-[13px]">
        <div className="flex items-baseline gap-[11px]">
          <span className="text-accent text-meta font-mono tracking-[0.1em]">
            {number}
          </span>
          <h2 className="text-[15px] font-bold">{title}</h2>
          {showEnLabel ? (
            <span className="text-text-3 text-meta font-mono tracking-[0.14em] uppercase">
              {enLabel}
            </span>
          ) : null}
          {rightSlot ? help : null}
        </div>
        {rightSlot ?? help}
      </header>
      {children}
    </section>
  );
}
