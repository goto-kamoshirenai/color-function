import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookNudge } from "./BookNudge";
import { bookById, bookLinks } from "@/lib/references";

describe("BookNudge（結果連動の書籍導線）", () => {
  it("条件を満たさないときは何も描画しない", () => {
    const { container } = render(<BookNudge helpKey="contrast" when={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("条件を満たすと、指標に対応する書籍と購入リンクを出す", () => {
    render(<BookNudge helpKey="contrast" when />);

    const book = bookById("coady-color-accessibility");
    expect(book).toBeDefined();
    if (!book) return;

    expect(
      screen.getByText(/通常テキストの基準に届いていません/),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: book.title })).toHaveAttribute(
      "href",
      `/library/${book.id}`,
    );
    for (const l of bookLinks(book)) {
      const buy = document.querySelector(`a[href="${l.url}"]`);
      expect(buy, `${l.format} のリンクがない`).not.toBeNull();
      expect(buy).toHaveAttribute("rel", expect.stringContaining("sponsored"));
    }
    // 広告であることを導線のそばに明示する
    expect(screen.getByText(/Amazon アソシエイト/)).toBeInTheDocument();
  });

  it("指標ごとに送り先の書籍が異なる", () => {
    const { unmount } = render(<BookNudge helpKey="scheme" when />);
    expect(
      document.querySelector('a[href="/library/sakurai-color-idea-notebook"]'),
    ).not.toBeNull();
    unmount();

    render(<BookNudge helpKey="redundancy" when />);
    expect(
      document.querySelector('a[href="/library/albers-interaction-of-color"]'),
    ).not.toBeNull();
  });
});
