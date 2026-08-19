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
      render(<CardContrastMatrix number="01" />);
      expect(screen.getAllByText("—")).toHaveLength(3);
      expect(screen.getAllByText("21.00")).toHaveLength(2); // 対称ペア
    });

    it("1色のみでは案内を表示", () => {
      resetColorStore(["#000000"]);
      render(<CardContrastMatrix number="01" />);
      expect(screen.getByText(/2色以上が必要/)).toBeInTheDocument();
    });

    it("表として行列見出しを持ち、色番号と HEX を読み上げに載せる", () => {
      render(<CardContrastMatrix number="01" />);
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(3);
      expect(screen.getAllByRole("rowheader")).toHaveLength(3);
      expect(
        screen.getByRole("rowheader", { name: "色 2 #FFFFFF" }),
      ).toBeInTheDocument();
    });

    it("合否を文字（読み上げ専用）でも伝える", () => {
      render(<CardContrastMatrix number="01" />);
      const cell = screen
        .getAllByRole("cell")
        .find((el) => el.textContent?.startsWith("21.00"));
      expect(cell?.textContent).toContain("AA合格");

      resetColorStore(["#000000", "#111111"]);
      render(<CardContrastMatrix number="01" />);
      const near = screen
        .getAllByRole("cell")
        .find((el) => /^1\.\d\d/.test(el.textContent ?? ""));
      expect(near?.textContent).toContain("AA不合格");
    });
  });

  describe("CardDeltaMatrix", () => {
    it("対角は — で、非対角に ΔE 値を表示", () => {
      render(<CardDeltaMatrix number="01" />);
      expect(screen.getAllByText("—")).toHaveLength(3);
      // 黒×白 ΔE00 ≈ 100（丸め表示）
      expect(screen.getAllByText("100").length).toBeGreaterThanOrEqual(2);
    });

    it("紛らわしい近さを文字（読み上げ専用）でも伝える", () => {
      resetColorStore(["#000000", "#050505"]);
      render(<CardDeltaMatrix number="01" />);
      const cells = screen.getAllByRole("cell");
      expect(
        cells.some((el) => el.textContent?.includes("紛らわしい近さ")),
      ).toBe(true);
    });
  });

  describe("CardHueDistribution", () => {
    it("エントロピーを表示", () => {
      render(<CardHueDistribution number="01" />);
      expect(screen.getByText(/色相エントロピー/)).toBeInTheDocument();
    });

    it("空パレットでは案内を表示", () => {
      resetColorStore([]);
      render(<CardHueDistribution number="01" />);
      expect(screen.getByText(/色がありません/)).toBeInTheDocument();
    });
  });
});
