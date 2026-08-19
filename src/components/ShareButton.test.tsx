import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { ShareButton } from "./ShareButton";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

describe("ShareButton", () => {
  beforeEach(() => {
    resetColorStore(["#112233", "#AABBCC"]);
  });

  it("現在のパレットから共有リンクを組み立ててコピーする", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<ShareButton />);
    fireEvent.click(screen.getByRole("button", { name: "共有リンクをコピー" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0][0]).toContain("#p=112233,AABBCC");
    await waitFor(() =>
      expect(useColorStore.getState().toast).toBe("共有リンクをコピーしました"),
    );
    vi.unstubAllGlobals();
  });

  it("URL 反映のデバウンス中でも最新のパレットをコピーする", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<ShareButton />);
    act(() => {
      useColorStore.getState().apply({ kind: "add", hex: "#DDEEFF" });
    });
    fireEvent.click(screen.getByRole("button", { name: "共有リンクをコピー" }));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(writeText.mock.calls[0][0]).toContain("#p=112233,AABBCC,DDEEFF");
    vi.unstubAllGlobals();
  });

  it("コピーできない環境では失敗を通知する", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<ShareButton />);
    fireEvent.click(screen.getByRole("button", { name: "共有リンクをコピー" }));

    await waitFor(() =>
      expect(useColorStore.getState().toast).toMatch(/コピーできませんでした/),
    );
    vi.unstubAllGlobals();
  });

  it("空パレットでは表示しない", () => {
    resetColorStore([]);
    render(<ShareButton />);
    expect(
      screen.queryByRole("button", { name: "共有リンクをコピー" }),
    ).toBeNull();
  });
});
