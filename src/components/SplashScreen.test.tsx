import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SplashScreen } from "./SplashScreen";

describe("SplashScreen", () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete document.documentElement.dataset.splash;
  });

  it("data-splash が無ければ表示しない", () => {
    render(<SplashScreen />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("data-splash=1 で表示され、SKIP で消えて記録される", async () => {
    document.documentElement.dataset.splash = "1";
    render(<SplashScreen />);

    expect(
      await screen.findByRole("dialog", { name: /起動アニメーション/ }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "起動アニメーションをスキップ" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(sessionStorage.getItem("cff-splash-shown")).toBe("1");
    expect(document.documentElement.dataset.splash).toBeUndefined();
  });

  it("Escape キーでもスキップできる", async () => {
    document.documentElement.dataset.splash = "1";
    render(<SplashScreen />);
    await screen.findByRole("dialog");

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(sessionStorage.getItem("cff-splash-shown")).toBe("1");
  });
});
