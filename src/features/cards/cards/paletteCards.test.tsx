import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardContrastMatrix } from "./CardContrastMatrix";
import { CardDeltaMatrix } from "./CardDeltaMatrix";
import { CardHueDistribution } from "./CardHueDistribution";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

describe("パレット×検証カード", () => {
  beforeEach(() => {
    resetColorStore(["#000000", "#FFFFFF", "#FF0000"]);
    act(() => useColorStore.getState().setUnit("palette"));
  });

  describe("CardContrastMatrix", () => {
    it("3色で 3×3、対角は —、黒×白セルは 21.00", () => {
      render(<CardContrastMatrix />);
      expect(screen.getAllByText("—")).toHaveLength(3);
      expect(screen.getAllByText("21.00")).toHaveLength(2); // 対称ペア
    });

    it("1色のみでは案内を表示", () => {
      resetColorStore(["#000000"]);
      render(<CardContrastMatrix />);
      expect(screen.getByText(/2色以上が必要/)).toBeInTheDocument();
    });
  });

  describe("CardDeltaMatrix", () => {
    it("対角は — で、非対角に ΔE 値を表示", () => {
      render(<CardDeltaMatrix />);
      expect(screen.getAllByText("—")).toHaveLength(3);
      // 黒×白 ΔE00 ≈ 100（丸め表示）
      expect(screen.getAllByText("100").length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("CardHueDistribution", () => {
    it("エントロピーを表示", () => {
      render(<CardHueDistribution />);
      expect(screen.getByText(/色相エントロピー/)).toBeInTheDocument();
    });

    it("空パレットでは案内を表示", () => {
      resetColorStore([]);
      render(<CardHueDistribution />);
      expect(screen.getByText(/色がありません/)).toBeInTheDocument();
    });
  });
});
