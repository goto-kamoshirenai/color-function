import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookNudge } from "./BookNudge";
import { NudgeSlotProvider, type NudgeKey } from "./nudgeSlot";
import { bookById, bookLinks } from "@/lib/references";

const inSlot = (slot: NudgeKey | null, helpKey: NudgeKey) =>
  render(
    <NudgeSlotProvider value={slot}>
      <BookNudge helpKey={helpKey} />
    </NudgeSlotProvider>,
  );

describe("BookNudge（結果連動の書籍導線）", () => {
  it("スロットが自分の指標でなければ何も描画しない", () => {
    const { container } = inSlot(null, "contrast");
    expect(container).toBeEmptyDOMElement();

    const other = inSlot("scheme", "contrast");
    expect(other.container).toBeEmptyDOMElement();
  });

  it("選ばれた指標では、書籍の詳細ページへの1行だけを出す", () => {
    inSlot("contrast", "contrast");

    const book = bookById("coady-color-accessibility");
    expect(book).toBeDefined();
    if (!book) return;

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/library/${book.id}`);
    expect(link).toHaveTextContent("基準の直し方");
    expect(link).toHaveTextContent(book.title);

    // カード上では売らない（購入リンクと PR 表記は図書館側に集約する）
    for (const l of bookLinks(book)) {
      expect(document.querySelector(`a[href="${l.url}"]`)).toBeNull();
    }
    expect(screen.queryByText(/Amazon アソシエイト/)).toBeNull();
  });

  it("指標ごとに送り先の書籍が異なる", () => {
    const { unmount } = inSlot("scheme", "scheme");
    expect(
      document.querySelector('a[href="/library/sakurai-color-idea-notebook"]'),
    ).not.toBeNull();
    unmount();

    inSlot("cvdmatrix", "cvdmatrix");
    expect(
      document.querySelector('a[href="/library/cudo-color-universal-design"]'),
    ).not.toBeNull();
  });
});
