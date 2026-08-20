"use client";

import Link from "next/link";
import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { Code, Copy, ArrowUpRight } from "iconoir-react";
import { HELP } from "@/features/cards/help";
import { snippetFor } from "@/features/cards/snippets";
import { codeLibraryById } from "@/lib/references";
import { useColorStore } from "@/store/useColorStore";
import { useCopy } from "@/lib/useCopy";
import { useLocale, useT } from "@/lib/i18n/locale";

/**
 * この指標を自分のコードで出すためのスニペット（カード見出しの `</>`）。
 * いま画面に出ている色をそのまま埋めた、貼れば動くコードを出す。
 * スニペットを持たない指標・色が無いときは何も描画しない。
 */
export function SnippetButton({ helpKey }: { helpKey: string }) {
  const palette = useColorStore((s) => s.palette);
  const selectedId = useColorStore((s) => s.selectedId);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const copy = useCopy();
  const locale = useLocale();
  const t = useT();

  if (palette.length === 0) return null;

  // ペアの解決規則は usePairColors と同じ（指定が無ければ先頭と末尾）
  const primary = (palette.find((c) => c.id === selectedId) ?? palette[0]).hex;
  const fg = palette.find((c) => c.id === fgId)?.hex ?? palette[0].hex;
  const bg =
    palette.find((c) => c.id === bgId)?.hex ?? palette[palette.length - 1].hex;

  const snippet = snippetFor(helpKey, {
    primary,
    fg,
    bg,
    hexes: palette.map((c) => c.hex),
  });
  if (!snippet) return null;

  const lib = codeLibraryById(snippet.libId);
  const title = HELP[locale][helpKey]?.title ?? helpKey;

  return (
    <DialogTrigger>
      <Button
        aria-label={t("code.aria", { title })}
        className="cff-control text-text-2 hover:border-accent hover:text-accent relative flex size-[18px] items-center justify-center rounded-full p-0 before:absolute before:-inset-1 before:content-['']"
      >
        <Code width={11} height={11} strokeWidth={2} aria-hidden />
      </Button>
      <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay w-[440px] max-w-[90vw] border">
        <Dialog className="outline-none">
          <div className="border-border flex items-center justify-between gap-[9px] border-b px-[18px] py-3.5">
            <div className="flex items-center gap-[9px]">
              <Code
                width={13}
                height={13}
                strokeWidth={2}
                className="text-accent"
                aria-hidden
              />
              <Heading slot="title" className="text-sm font-bold">
                {t("code.title")}
              </Heading>
            </div>
            <span className="text-text-3 text-meta font-mono">{title}</span>
          </div>

          <div className="px-[18px] py-3.5">
            {/* 横スクロールする領域はキーボードでも辿れる必要がある（axe: scrollable-region-focusable） */}
            <pre
              tabIndex={0}
              className="border-border bg-surface-2 rounded-control overflow-x-auto border px-3 py-2.5 font-mono text-[11.5px] leading-[1.65]"
            >
              {snippet.code}
            </pre>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              {lib ? (
                <a
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-3 hover:text-accent text-meta inline-flex min-h-6 items-center gap-1 font-mono"
                >
                  {lib.pkg ?? lib.name}
                  <ArrowUpRight
                    width={11}
                    height={11}
                    strokeWidth={2}
                    aria-hidden
                  />
                </a>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => copy(snippet.code)}
                className="cff-control text-text-2 hover:text-text flex items-center gap-1.5 px-2.5 py-1 font-mono text-[12px]"
              >
                <Copy width={12} height={12} aria-hidden />
                {t("code.copy")}
              </button>
            </div>
          </div>

          <div className="border-border flex items-center justify-between gap-3 border-t px-[18px] py-2.5">
            <p className="text-text-3 text-meta font-mono tracking-[0.04em]">
              {t("code.note")}
            </p>
            <Link
              href="/code"
              className="text-text-2 hover:text-accent text-meta inline-flex min-h-6 flex-none items-center font-mono underline-offset-2 hover:underline"
            >
              {t("code.viewAll")}
            </Link>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
