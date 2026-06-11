"use client";

import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { QuestionMark } from "iconoir-react";
import { HELP } from "@/features/cards/help";
import { useLocale, useT } from "@/lib/i18n/locale";

/** 指標ヘルプ（v2 パネル意匠の Popover）。 */
export function HelpButton({ helpKey }: { helpKey: string }) {
  const locale = useLocale();
  const t = useT();
  const help = HELP[locale][helpKey];
  if (!help) return null;
  return (
    <DialogTrigger>
      <Button
        aria-label={t("help.aria", { title: help.title })}
        className="cff-control text-text-2 hover:border-accent hover:text-accent relative flex size-[18px] items-center justify-center rounded-full p-0 before:absolute before:-inset-1 before:content-['']"
      >
        <QuestionMark width={12} height={12} strokeWidth={2.2} aria-hidden />
      </Button>
      <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay w-[400px] max-w-[90vw] border">
        <Dialog className="outline-none">
          <div className="border-border flex items-center gap-[9px] border-b px-[18px] py-3.5">
            <QuestionMark
              width={12}
              height={12}
              strokeWidth={2.2}
              className="text-accent"
              aria-hidden
            />
            <Heading slot="title" className="text-sm font-bold">
              {help.title}
            </Heading>
          </div>
          <div className="p-[18px]">
            <p className="mb-4 text-[13.5px] leading-[1.65]">{help.body}</p>
            <div className="bg-surface-2 border-accent rounded-control border-l-[3px] px-3.5 py-3">
              <p className="text-text-3 text-meta mb-[5px] font-mono tracking-[0.14em] uppercase">
                {t("help.guide")}
              </p>
              <p className="text-control font-mono">{help.guide}</p>
            </div>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
