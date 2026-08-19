"use client";

import Link from "next/link";
import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { Book } from "iconoir-react";
import { HELP } from "@/features/cards/help";
import { REFERENCES, booksForTopic } from "@/lib/references";
import { ResourceLink } from "./ResourceLink";
import { BookTeaser } from "./BookTeaser";
import { useLocale, useT } from "@/lib/i18n/locale";

/** ポップオーバーに載せる書籍は先頭2冊まで（狭い面なので絞る）。 */
const MAX_BOOKS = 2;

/**
 * 指標の参考資料（座学用の外部リンク集と書籍）を開くボタン。? ヘルプの隣に置く。
 * 資料も書籍もない指標では何も描画しない。
 */
export function ReferencesButton({ helpKey }: { helpKey: string }) {
  const locale = useLocale();
  const t = useT();
  const refs = REFERENCES[helpKey] ?? [];
  const books = booksForTopic(helpKey).slice(0, MAX_BOOKS);
  const title = HELP[locale][helpKey]?.title ?? helpKey;
  if (!refs.length && !books.length) return null;

  return (
    <DialogTrigger>
      <Button
        aria-label={t("refs.aria", { title })}
        className="cff-control text-text-2 hover:border-accent hover:text-accent relative flex size-[18px] items-center justify-center rounded-full p-0 before:absolute before:-inset-1 before:content-['']"
      >
        <Book width={11} height={11} strokeWidth={2} aria-hidden />
      </Button>
      <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay w-[380px] max-w-[90vw] border">
        <Dialog className="outline-none">
          <div className="border-border flex items-center justify-between gap-[9px] border-b px-[18px] py-3.5">
            <div className="flex items-center gap-[9px]">
              <Book
                width={13}
                height={13}
                strokeWidth={2}
                className="text-accent"
                aria-hidden
              />
              <Heading slot="title" className="text-sm font-bold">
                {t("refs.title")}
              </Heading>
            </div>
            <span className="text-text-3 text-meta font-mono">{title}</span>
          </div>
          {refs.length > 0 ? (
            <ul className="px-2 py-1">
              {refs.map((r) => (
                <li key={r.url}>
                  <ResourceLink
                    title={r.title}
                    source={r.source}
                    url={r.url}
                    badge={r.lang}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {/* 指標に紐づく書籍（図書館の蔵書）。記事だけでは足りないときの次の一手 */}
          {books.length > 0 ? (
            <div className="border-border border-t px-[18px] py-3.5">
              <p className="text-text-3 text-meta mb-2.5 font-mono tracking-[0.14em] uppercase">
                {t("refs.books")}
              </p>
              <ul className="flex flex-col gap-3">
                {books.map((b) => (
                  <li key={b.id}>
                    <BookTeaser book={b} />
                  </li>
                ))}
              </ul>
              <p className="text-text-3 text-meta mt-2.5 font-mono tracking-[0.04em]">
                {t("library.affiliateNote")}
              </p>
            </div>
          ) : null}
          <div className="border-border flex items-center justify-between gap-3 border-t px-[18px] py-2.5">
            <p className="text-text-3 text-meta font-mono tracking-[0.04em]">
              {t("refs.note")}
            </p>
            <span className="flex flex-none items-center gap-3">
              <Link
                href="/learn"
                className="text-text-2 hover:text-accent text-meta inline-flex min-h-6 items-center font-mono underline-offset-2 hover:underline"
              >
                {t("refs.viewAll")}
              </Link>
              <Link
                href="/library"
                className="text-text-2 hover:text-accent text-meta inline-flex min-h-6 items-center font-mono underline-offset-2 hover:underline"
              >
                {t("refs.viewLibrary")}
              </Link>
            </span>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
