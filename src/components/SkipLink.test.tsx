import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("クリックで main へフォーカスを移し、URL ハッシュは書き換えない", () => {
    location.hash = "#p=112233";
    render(
      <>
        <SkipLink />
        <main id="main" tabIndex={-1}>
          本文
        </main>
      </>,
    );

    const link = screen.getByRole("link", {
      name: "メインコンテンツへスキップ",
    });
    fireEvent.click(link);

    expect(document.activeElement).toBe(document.getElementById("main"));
    expect(location.hash).toBe("#p=112233");
  });
});
