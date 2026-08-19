import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { PairRolePicker } from "./PairRolePicker";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

describe("PairRolePicker", () => {
  beforeEach(() => {
    resetColorStore(["#000000", "#FFFFFF"]);
    act(() => {
      useColorStore.getState().setUnit("pair");
      useColorStore.getState().setView("verify");
    });
    localStorage.removeItem("cff-pairbar-collapsed");
  });

  it("ヒントはクリック（タップ）で開ける", async () => {
    render(<PairRolePicker />);
    const trigger = screen.getByRole("button", {
      name: "文字色と背景色の説明を表示",
    });

    // hover を伴わない click（タッチ相当）でも本文が出る
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/コントラストは/)).toBeInTheDocument();
    });
  });

  it("ヒントのボタン名と本文は重複しない", () => {
    render(<PairRolePicker />);
    const trigger = screen.getByRole("button", {
      name: "文字色と背景色の説明を表示",
    });
    expect(trigger.getAttribute("aria-label")).not.toMatch(/コントラストは/);
  });
});
