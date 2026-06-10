"use client";

import type { ReactNode } from "react";
import { HelpButton } from "./HelpButton";

/** カードの共通シェル（タイトル＋ヘルプ＋本体, docs/09 §5）。 */
export function Card({
  title,
  helpKey,
  children,
}: {
  title: string;
  helpKey: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-surface rounded-lg border p-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-text-3 font-mono text-[11px] tracking-widest">
          {title}
        </h2>
        <HelpButton helpKey={helpKey} />
      </header>
      {children}
    </section>
  );
}
