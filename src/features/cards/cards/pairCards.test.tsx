import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardWcagContrast } from "./CardWcagContrast";
import { CardDeltaE } from "./CardDeltaE";
import { CardCvd } from "./CardCvd";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

describe("ペア×検証カード", () => {
  beforeEach(() => {
    // fg=#000000(先頭), bg=#FFFFFF(末尾) → 比は 21.00（WCAG既知値）
    resetColorStore(["#000000", "#FFFFFF"]);
    act(() => useColorStore.getState().setUnit("pair"));
  });

  describe("CardWcagContrast", () => {
    it("黒×白で 21.00 と AAA 準拠を表示", () => {
      render(<CardWcagContrast />);
      expect(screen.getByText("21.00")).toBeInTheDocument();
      expect(screen.getByText("AAA 準拠")).toBeInTheDocument();
    });

    it("プレビューに本文サンプルを表示", () => {
      render(<CardWcagContrast />);
      expect(screen.getByText(/通常の本文テキスト/)).toBeInTheDocument();
    });

    it("1色のみでは案内を表示", () => {
      resetColorStore(["#000000"]);
      render(<CardWcagContrast />);
      expect(screen.getByText(/2色以上が必要/)).toBeInTheDocument();
    });
  });

  describe("CardDeltaE", () => {
    it("黒×白の ΔE00 は 100 付近・最大ラベル", () => {
      render(<CardDeltaE />);
      // deltaE2000(black, white) ≈ 100（S1 テストで >95 を確認済み）
      const value = screen.getByText(/^\d+\.\d{2}$/);
      expect(Number(value.textContent)).toBeGreaterThan(95);
      expect(screen.getByText("非常に大きな差")).toBeInTheDocument();
    });
  });

  describe("CardCvd", () => {
    it("P/D/T 型の行とコントラスト比を表示", () => {
      render(<CardCvd />);
      expect(screen.getByText("P型 (1型)")).toBeInTheDocument();
      expect(screen.getByText("D型 (2型)")).toBeInTheDocument();
      expect(screen.getByText("T型 (3型)")).toBeInTheDocument();
      expect(screen.getAllByText(/:1$/)).toHaveLength(3);
    });
  });
});
