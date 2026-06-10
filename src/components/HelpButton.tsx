"use client";

import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { HELP } from "@/features/cards/help";

/** 指標ヘルプ（v2 パネル意匠の Popover）。 */
export function HelpButton({ helpKey }: { helpKey: string }) {
  const help = HELP[helpKey];
  if (!help) return null;
  return (
    <DialogTrigger>
      <Button
        aria-label={`${help.title} の説明`}
        className="border-border-strong text-text-2 hover:bg-surface-2 flex size-[17px] items-center justify-center rounded-full border bg-transparent p-0 font-mono text-[10px] leading-none"
      >
        ?
      </Button>
      <Popover className="border-border-strong bg-surface w-[400px] max-w-[90vw] rounded-[3px] border shadow-[0_24px_64px_rgba(0,0,0,0.32)]">
        <Dialog className="outline-none">
          <div className="border-border flex items-center gap-[9px] border-b px-[18px] py-3.5">
            <span className="text-accent font-mono text-[10px] tracking-[0.1em]">
              ?
            </span>
            <Heading slot="title" className="text-sm font-bold">
              {help.title}
            </Heading>
          </div>
          <div className="p-[18px]">
            <p className="mb-4 text-[13.5px] leading-[1.65]">{help.body}</p>
            <div className="bg-surface-2 border-accent rounded-[2px] border-l-[3px] px-3.5 py-3">
              <p className="text-text-3 mb-[5px] font-mono text-[9px] tracking-[0.14em] uppercase">
                目安 / Guide
              </p>
              <p className="font-mono text-[12.5px]">{help.guide}</p>
            </div>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
