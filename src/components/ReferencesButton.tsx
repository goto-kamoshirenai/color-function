"use client";

import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { Book, ArrowUpRight } from "iconoir-react";
import { HELP } from "@/features/cards/help";
import { REFERENCES } from "@/features/cards/references";
import { useLocale, useT } from "@/lib/i18n/locale";

/**
 * 指標の参考資料（座学用の外部リンク集）を開くボタン。? ヘルプの隣に置く。
 * 資料が登録されていない指標では何も描画しない。
 */
export function ReferencesButton({ helpKey }: { helpKey: string }) {
  const locale = useLocale();
  const t = useT();
  const refs = REFERENCES[helpKey];
  const title = HELP[locale][helpKey]?.title ?? helpKey;
  if (!refs?.length) return null;

  return (
    <DialogTrigger>
      <Button
        aria-label={t("refs.aria", { title })}
        className="cff-control text-text-2 relative flex size-[18px] items-center justify-center rounded-full p-0 before:absolute before:-inset-1 before:content-['']"
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
          <ul className="py-1">
            {refs.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-surface-2 flex items-center justify-between gap-3 px-[18px] py-2.5"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                      <span className="truncate">{r.title}</span>
                      <ArrowUpRight
                        width={11}
                        height={11}
                        strokeWidth={2}
                        className="text-text-3 flex-none"
                        aria-hidden
                      />
                    </span>
                    <span className="text-text-3 text-meta block font-mono">
                      {r.source}
                    </span>
                  </span>
                  <span className="border-border-strong text-text-2 rounded-control text-meta flex-none border px-1.5 py-0.5 font-mono uppercase">
                    {r.lang}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-text-3 text-meta border-border border-t px-[18px] py-2.5 font-mono tracking-[0.04em]">
            {t("refs.note")}
          </p>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
