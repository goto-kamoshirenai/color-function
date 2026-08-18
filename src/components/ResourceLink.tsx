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

/**
 * 書籍リンク行（書名＋著者・出版社・出版年＋版種別チップ）。
 * 単行本と Kindle のように複数版がある書籍は版ごとにチップを並べ、
 * 書名クリックは先頭の版（単行本）へ送る。
 * リンク先は Amazon アソシエイトの短縮リンクのため rel に sponsored を付ける。
 */
export function BookLink({
  title,
  meta,
  links,
}: {
  title: string;
  meta: string;
  links: { label: string; url: string }[];
}) {
  const primary = links[0];
  return (
    <div className="hover:bg-surface-2 rounded-control flex items-center justify-between gap-3 px-2.5 py-2">
      <a
        href={primary.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="block min-w-0 flex-1"
      >
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
          {meta}
        </span>
      </a>
      <span className="flex flex-none items-center gap-1">
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={`${title} — ${l.label}`}
            className="border-border-strong text-text-2 hover:border-accent hover:text-accent rounded-control text-meta border px-1.5 py-0.5 font-mono uppercase"
          >
            {l.label}
          </a>
        ))}
      </span>
    </div>
  );
}
