import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardEmpty } from "./CardEmpty";
import { CardComplement } from "./CardComplement";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

describe("CardEmpty", () => {
  it("メッセージキーを共通の体裁で描画する", () => {
    render(<CardEmpty messageKey="card.empty" />);
    const el = screen.getByText(/色がありません/);
    expect(el.className).toContain("text-text-3");
    expect(el.className).toContain("font-mono");
  });
});

describe("空・不足状態の出し分け（CardComplement）", () => {
  beforeEach(() => {
    act(() => useColorStore.getState().setView("design"));
  });

  it("0色なら「色がありません」", () => {
    resetColorStore([]);
    render(<CardComplement number="01" />);
    expect(screen.getByText(/色がありません/)).toBeInTheDocument();
  });

  it("有彩色が足りないだけなら理由を出す", () => {
    resetColorStore(["#888888", "#111111"]);
    render(<CardComplement number="01" />);
    expect(screen.getByText(/有彩色が2色以上必要/)).toBeInTheDocument();
  });
});
