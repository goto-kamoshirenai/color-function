import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    try {
      localStorage.clear();
    } catch {
      // 無視
    }
  });

  it("ボタンとして描画され、アクセシブルな名前を持つ", () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: /ダークモードに切替/ }),
    ).toBeInTheDocument();
  });

  it("クリックで data-theme が light↔dark に切り替わる", () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");

    expect(document.documentElement.dataset.theme).toBe("light");
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(btn);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
