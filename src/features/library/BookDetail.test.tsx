import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookDetail } from "./BookDetail";
import { BOOKS, bookLinks } from "@/lib/references";
import { HELP } from "@/features/cards/help";

const book = BOOKS.find((b) => b.id === "coady-color-accessibility");
if (!book) throw new Error("テスト対象の書籍が references.json にない");

describe("BookDetail（書籍の詳細ページ）", () => {
  it("書名・書誌・紹介文・本文の全段落を表示する", () => {
    render(<BookDetail book={book} />);
    expect(
      screen.getByRole("heading", { level: 1, name: book.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(book.author))).toBeInTheDocument();
    expect(screen.getByText(book.pitch.ja)).toBeInTheDocument();
    for (const para of book.summary.ja) {
      expect(screen.getByText(para)).toBeInTheDocument();
    }
  });

  it("購入リンクを持ち、sponsored と PR 表記を伴う", () => {
    const { container } = render(<BookDetail book={book} />);
    for (const l of bookLinks(book)) {
      const link = container.querySelector(`a[href="${l.url}"]`);
      expect(link, `${l.format} のリンクがない`).not.toBeNull();
      expect(link).toHaveAttribute("rel", expect.stringContaining("sponsored"));
      expect(link).toHaveAttribute("target", "_blank");
      expect(link?.getAttribute("aria-label")).toContain("PR");
    }
    expect(screen.getByText(/Amazon アソシエイト/)).toBeInTheDocument();
  });

  it("扱う指標を指標別リファレンスのアンカーへリンクする", () => {
    render(<BookDetail book={book} />);
    for (const key of book.topics) {
      const link = screen.getByRole("link", {
        name: HELP.ja[key]?.title ?? key,
      });
      expect(link).toHaveAttribute("href", `/learn#topic-${key}`);
    }
  });

  it("図書館へ戻る導線を持つ", () => {
    render(<BookDetail book={book} />);
    expect(screen.getByRole("link", { name: /図書館に戻る/ })).toHaveAttribute(
      "href",
      "/library",
    );
  });
});
