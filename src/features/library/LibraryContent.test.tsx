import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { LibraryContent } from "./LibraryContent";
import { BOOKS, bookLinks } from "@/lib/references";

describe("LibraryContent（図書館）", () => {
  it("蔵書を全冊並べ、書名から詳細ページへ渡せる", () => {
    render(<LibraryContent />);
    for (const b of BOOKS) {
      const links = screen.getAllByRole("link", { name: b.title });
      expect(
        links.some((l) => l.getAttribute("href") === `/library/${b.id}`),
        `${b.id} の詳細リンクがない`,
      ).toBe(true);
    }
  });

  it("購入リンクは全て sponsored かつ別タブで開く", () => {
    render(<LibraryContent />);
    const urls = new Set(BOOKS.flatMap((b) => bookLinks(b).map((l) => l.url)));
    const buys = screen
      .getAllByRole("link")
      .filter((l) => urls.has(l.getAttribute("href") ?? ""));

    expect(buys.length).toBe(urls.size);
    for (const l of buys) {
      expect(l).toHaveAttribute("rel", expect.stringContaining("sponsored"));
      expect(l).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(l).toHaveAttribute("target", "_blank");
      // 広告であることが支援技術にも伝わる
      expect(l.getAttribute("aria-label")).toContain("PR");
    }
  });

  it("アフィリエイトである旨を蔵書セクション内に明示する", () => {
    render(<LibraryContent />);
    const section = screen
      .getByRole("heading", { name: "蔵書" })
      .closest("section");
    expect(section).not.toBeNull();
    expect(
      within(section as HTMLElement).getByText(/Amazon アソシエイト/),
    ).toBeInTheDocument();
  });

  it("指標から書籍を引く索引を持つ", () => {
    render(<LibraryContent />);
    const section = screen
      .getByRole("heading", { name: "指標から探す" })
      .closest("section") as HTMLElement;
    // コントラストを扱う書籍が索引から引ける
    const contrast = within(section).getByText("WCAG コントラスト比");
    const books = contrast.parentElement?.querySelectorAll("a") ?? [];
    expect(books.length).toBeGreaterThan(0);
  });

  it("記事側（/learn）への導線を持つ", () => {
    render(<LibraryContent />);
    const link = screen.getByRole("link", { name: /学習コンテンツへ/ });
    expect(link).toHaveAttribute("href", "/learn");
  });
});
