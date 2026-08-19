import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BOOKS, bookById } from "@/lib/references";
import { BookDetail } from "@/features/library/BookDetail";

type Params = { params: Promise<{ id: string }> };

/** 蔵書は静的データなので、詳細ページは全冊ぶんビルド時に生成する。 */
export function generateStaticParams() {
  return BOOKS.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const book = bookById((await params).id);
  if (!book) return { title: "図書館 — Color Follows Function" };
  return {
    title: `${book.title} — 図書館 | Color Follows Function`,
    description: book.pitch.ja,
  };
}

export default async function BookPage({ params }: Params) {
  const book = bookById((await params).id);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
