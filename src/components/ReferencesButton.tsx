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
import { REFERENCES } from "@/features/cards/references";
import { ResourceLink } from "./ResourceLink";
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
          <div className="border-border flex items-center justify-between gap-3 border-t px-[18px] py-2.5">
            <p className="text-text-3 text-meta font-mono tracking-[0.04em]">
              {t("refs.note")}
            </p>
            <Link
              href="/learn"
              className="text-text-2 hover:text-accent text-meta flex-none font-mono underline-offset-2 hover:underline"
            >
              {t("refs.viewAll")}
            </Link>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
