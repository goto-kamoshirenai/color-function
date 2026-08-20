"use client";

import type { ReactNode } from "react";
import { HelpButton } from "./HelpButton";
import { ReferencesButton } from "./ReferencesButton";
import { SnippetButton } from "./SnippetButton";
import { useLocale } from "@/lib/i18n/locale";

/**
 * v2 カード枠: 連番(accent) + 太字タイトル + EN小ラベル + 実装例 + 参考資料 + ?ヘルプ。
 * hero はコーナーブラケット付き（WCAG ヒーローカード）。
 * rightSlot 指定時はボタン群をタイトル行内に移す（v2 のレイアウト規則）。
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
  // 実装例（</>）＋参考資料（本）＋ヘルプ（?）。
  // 持たない指標ではそのボタンは描画されない
  const help = (
    <div className="flex items-center gap-1.5">
      <SnippetButton helpKey={helpKey} />
      <ReferencesButton helpKey={helpKey} />
      <HelpButton helpKey={helpKey} />
    </div>
  );
  const showEnLabel = locale === "ja" && !!enLabel;
  return (
    <section
      className={
        // flex-col: カード本文が flex-1 で「ヘッダーを除く残り高さ」を埋められるように
        // （h-full はヘッダー分を含む高さに解決されて下にはみ出すため使わない）
        // min-w-0: グリッド/フレックスの子として内容の min-content 未満にも縮められる
        // ようにする（マトリクス等の広いカードが列トラックを押し広げないため）
        "bg-surface rounded-control relative flex min-w-0 flex-col border " +
        (hero
          ? "border-border-strong px-4 py-[18px] sm:px-6 sm:py-[22px]"
          : "border-border px-4 py-4 sm:px-[22px] sm:py-[18px]")
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

      {/* 狭いカード幅（スマホ／2カラム時）では折り返す。折り返さないと
          タイトルと rightSlot が押し合ってカードの外へ溢れる。 */}
      <header className="border-border mb-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-b pb-[13px]">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-[11px] gap-y-1">
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
