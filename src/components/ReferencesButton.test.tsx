import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferencesButton } from "./ReferencesButton";
import { REFERENCES, booksForTopic, bookLinks } from "@/lib/references";

describe("ReferencesButton（参考資料）", () => {
  it("資料がある指標ではボタンが出て、外部リンク一覧を開ける", async () => {
    const user = userEvent.setup();
    render(<ReferencesButton helpKey="contrast" />);

    await user.click(
      screen.getByRole("button", { name: /WCAG コントラスト比 の参考資料/ }),
    );

    const links = (await screen.findAllByRole("link")).filter(
      (l) => l.getAttribute("target") === "_blank",
    );
    // 記事リンク＋書籍の購入リンク（単行本 / Kindle）
    const books = booksForTopic("contrast").slice(0, 2);
    const buyCount = books.reduce((n, b) => n + bookLinks(b).length, 0);
    expect(links).toHaveLength(REFERENCES.contrast.length + buyCount);
    for (const link of links) {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
    // /learn・/library への内部リンクも持つ
    expect(
      screen.getByRole("link", { name: "すべての資料を見る" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "図書館" })).toHaveAttribute(
      "href",
      "/library",
    );
  });

  it("指標に紐づく書籍を出し、購入リンクは sponsored かつ PR 表記つき", async () => {
    const user = userEvent.setup();
    // Popover はポータルに出るため document から引く
    render(<ReferencesButton helpKey="contrast" />);
    await user.click(
      screen.getByRole("button", { name: /WCAG コントラスト比 の参考資料/ }),
    );

    const books = booksForTopic("contrast").slice(0, 2);
    expect(books.length).toBeGreaterThan(0);
    for (const b of books) {
      // 書名は図書館の詳細ページへ送る
      expect(screen.getByRole("link", { name: b.title })).toHaveAttribute(
        "href",
        `/library/${b.id}`,
      );
      for (const l of bookLinks(b)) {
        const buy = document.querySelector(`a[href="${l.url}"]`);
        expect(buy, `${b.id} / ${l.format}`).not.toBeNull();
        expect(buy).toHaveAttribute(
          "rel",
          expect.stringContaining("sponsored"),
        );
        expect(buy?.getAttribute("aria-label")).toContain("PR");
      }
    }
    expect(screen.getByText(/Amazon アソシエイト/)).toBeInTheDocument();
  });

  it("資料も書籍もない指標では何も描画しない", () => {
    const { container } = render(<ReferencesButton helpKey="usage" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("全リンクが https/http の妥当な URL", () => {
    for (const refs of Object.values(REFERENCES)) {
      for (const r of refs) {
        expect(() => new URL(r.url)).not.toThrow();
        expect(r.url).toMatch(/^https?:\/\//);
      }
    }
  });
});
