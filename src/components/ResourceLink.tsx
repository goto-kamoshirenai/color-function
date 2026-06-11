"use client";

import { ArrowUpRight } from "iconoir-react";

/**
 * 外部リソースへのリンク行（タイトル＋出典＋言語/種別チップ）。
 * 参考資料ポップオーバーと座学画面で共用。新しいタブで開く。
 */
export function ResourceLink({
  title,
  source,
  url,
  badge,
}: {
  title: string;
  source: string;
  url: string;
  badge?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-surface-2 rounded-control flex items-center justify-between gap-3 px-2.5 py-2"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold">
          <span className="truncate">{title}</span>
          <ArrowUpRight
            width={11}
            height={11}
            strokeWidth={2}
            className="text-text-3 flex-none"
            aria-hidden
          />
        </span>
        <span className="text-text-3 text-meta block truncate font-mono">
          {source}
        </span>
      </span>
      {badge ? (
        <span className="border-border-strong text-text-2 rounded-control text-meta flex-none border px-1.5 py-0.5 font-mono uppercase">
          {badge}
        </span>
      ) : null}
    </a>
  );
}
