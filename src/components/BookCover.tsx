"use client";

import { parseHex, contrastRatio } from "@/core/color";
import type { Book } from "@/lib/references";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 17, g: 17, b: 17 };

/**
 * カバーの地色に対して読める文字色を選ぶ（白か near-black の contrast 勝ち）。
 * 書影は Amazon の規約上そのまま使えないため、書籍固有の色でカバーを描く。
 */
function coverInk(accent: string): string {
  const rgb = parseHex(accent);
  if (!rgb) return "#111111";
  return contrastRatio(rgb, WHITE) >= contrastRatio(rgb, BLACK)
    ? "#FFFFFF"
    : "#111111";
}

const SIZE = {
  sm: { box: "h-[54px] w-10", mark: "text-[19px]", code: null },
  lg: { box: "h-[180px] w-[132px]", mark: "text-[56px]", code: "text-meta" },
} as const;

/**
 * 書籍のカバータイル（書影の代替）。
 * 書籍ごとの accent を地色に、書名の先頭1文字を箔押しに見立てて置く。
 * 背表紙の帯は地色を暗く混ぜた色で、棚に並んだ見えを作る。
 */
export function BookCover({
  book,
  size = "sm",
}: {
  book: Book;
  size?: "sm" | "lg";
}) {
  const ink = coverInk(book.accent);
  const s = SIZE[size];
  return (
    <div
      aria-hidden
      className={
        "rounded-control relative flex flex-none items-center justify-center overflow-hidden select-none " +
        s.box
      }
      style={{ backgroundColor: book.accent, color: ink }}
    >
      {/* 背表紙 */}
      <span
        className="absolute inset-y-0 left-0 w-[5px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${book.accent} 74%, #000)`,
        }}
      />
      <span className={"font-black tracking-[-0.04em] " + s.mark}>
        {[...book.title][0]}
      </span>
      {s.code ? (
        <span
          className={
            "absolute right-2 bottom-2 font-mono tracking-[0.08em] opacity-80 " +
            s.code
          }
        >
          {book.accent}
        </span>
      ) : null}
    </div>
  );
}
