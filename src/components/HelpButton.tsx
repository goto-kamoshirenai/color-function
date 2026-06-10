"use client";

import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
} from "react-aria-components";
import { HELP } from "@/features/cards/help";

/** 指標ヘルプ（react-aria Popover, docs/09 §5）。 */
export function HelpButton({ helpKey }: { helpKey: string }) {
  const help = HELP[helpKey];
  if (!help) return null;
  return (
    <DialogTrigger>
      <Button
        aria-label={`${help.title} の説明`}
        className="border-border text-text-3 hover:text-text focus-visible:outline-accent flex size-5 items-center justify-center rounded-full border text-[10px] focus-visible:outline-2"
      >
        ?
      </Button>
      <Popover className="border-border bg-surface max-w-xs rounded-xl border p-4 shadow-xl">
        <Dialog className="outline-none">
          <Heading slot="title" className="text-text text-sm font-semibold">
            {help.title}
          </Heading>
          <p className="text-text-2 mt-2 text-xs leading-relaxed">
            {help.body}
          </p>
          <p className="text-text-3 mt-2 font-mono text-[10px]">
            目安: {help.guide}
          </p>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
