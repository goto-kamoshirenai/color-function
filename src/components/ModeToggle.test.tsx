import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "./ModeToggle";
import { useColorStore, resetColorStore } from "@/store/useColorStore";

describe("ModeToggle", () => {
  beforeEach(() => {
    resetColorStore(["#1F2933"]);
  });

  it("色数が足りない単位は真に無効化される（disabled 属性・フォーカス不可）", () => {
    render(<ModeToggle />);
    const pair = screen.getByRole("radio", { name: "ペア" });
    const palette = screen.getByRole("radio", { name: "パレット" });

    expect(pair).toBeDisabled();
    expect(palette).toBeDisabled();
    // aria-disabled だけの「操作は通るが無反応」状態にしない
    expect(pair).not.toHaveAttribute("aria-disabled");
  });

  it("無効な単位には理由が aria-describedby で関連付く", () => {
    render(<ModeToggle />);
    const pair = screen.getByRole("radio", { name: "ペア" });
    const id = pair.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id ?? "")?.textContent).toBe(
      "ペアには2色以上が必要です",
    );
  });

  it("無効な単位をクリックしても単位は変わらない", () => {
    render(<ModeToggle />);
    fireEvent.click(screen.getByRole("radio", { name: "パレット" }));
    expect(useColorStore.getState().unit).toBe("single");
  });

  it("色数が足りれば有効化され選択できる", () => {
    resetColorStore(["#1F2933", "#2D6CDF", "#E4572E"]);
    render(<ModeToggle />);
    const palette = screen.getByRole("radio", { name: "パレット" });
    expect(palette).toBeEnabled();
    expect(palette).not.toHaveAttribute("aria-describedby");

    fireEvent.click(palette);
    expect(useColorStore.getState().unit).toBe("palette");
  });

  it("観点（検証/設計）は常に選択できる", () => {
    render(<ModeToggle />);
    fireEvent.click(screen.getByRole("radio", { name: "設計" }));
    expect(useColorStore.getState().view).toBe("design");
  });
});
