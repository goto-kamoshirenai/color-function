import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsMenu } from "./SettingsMenu";

describe("SettingsMenu（設定メニュー）", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    document.documentElement.lang = "ja";
    try {
      localStorage.clear();
    } catch {
      // 無視
    }
  });

  it("テーマをダークに切り替えて保持する", () => {
    render(<SettingsMenu />);
    fireEvent.click(screen.getByRole("button", { name: "設定" }));
    fireEvent.click(screen.getByRole("radio", { name: "ダーク" }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("cff-theme")).toBe("dark");
  });

  it("言語を English に切り替えて保持する（メニュー表記も追従）", () => {
    render(<SettingsMenu />);
    fireEvent.click(screen.getByRole("button", { name: "設定" }));
    fireEvent.click(screen.getByRole("radio", { name: "English" }));

    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem("cff-lang")).toBe("en");
    // 開いたままのメニューの表記が英語になる
    expect(screen.getByText("Theme")).toBeInTheDocument();

    // 戻せる
    fireEvent.click(screen.getByRole("radio", { name: "日本語" }));
    expect(document.documentElement.lang).toBe("ja");
  });
});
