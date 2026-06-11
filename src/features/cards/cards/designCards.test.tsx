import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { CardHarmony } from "./CardHarmony";
import { CardTone } from "./CardTone";
import { CardHueShift } from "./CardHueShift";
import { resetColorStore, useColorStore } from "@/store/useColorStore";
import { __setHarmonyRulesForTest } from "@/lib/useHarmonyRules";

describe("設計カード", () => {
  beforeEach(() => {
    resetColorStore(["#2D6CDF"]);
    act(() => useColorStore.getState().setView("design"));
    __setHarmonyRulesForTest([
      {
        id: "complementary",
        label: "補色",
        sub: "Complementary",
        hueOffsets: [0, 180],
      },
      {
        id: "triadic",
        label: "トライアド",
        sub: "Triadic",
        hueOffsets: [0, 120, 240],
      },
    ]);
  });

  describe("CardHarmony", () => {
    it("ルールごとにスキームを表示", () => {
      render(<CardHarmony number="01" />);
      expect(screen.getByText("補色")).toBeInTheDocument();
      expect(screen.getByText("トライアド")).toBeInTheDocument();
      // 補色2 + トライアド3 = 5チップ
      expect(
        screen.getAllByRole("button", { name: /をパレットに追加/ }),
      ).toHaveLength(5);
    });

    it("チップをクリックするとパレットに追加される", () => {
      render(<CardHarmony number="01" />);
      const chips = screen.getAllByRole("button", { name: /をパレットに追加/ });
      fireEvent.click(chips[1]); // 補色の相手色
      expect(useColorStore.getState().palette).toHaveLength(2);
    });
  });

  describe("CardTone", () => {
    it("50〜900 の10段階トーンを表示し、クリックで追加", () => {
      render(<CardTone number="01" />);
      const chips = screen.getAllByRole("button", {
        name: /トーン .* をパレットに追加/,
      });
      expect(chips).toHaveLength(10);
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("500")).toBeInTheDocument();
      expect(screen.getByText("900")).toBeInTheDocument();
      // 500 は基準色そのもの
      expect(
        screen.getByRole("button", {
          name: /トーン 500 #2D6CDF をパレットに追加/,
        }),
      ).toBeInTheDocument();
      fireEvent.click(chips[0]);
      expect(useColorStore.getState().palette).toHaveLength(2);
    });

    it("各チップにカラーコードを表示（500 は基準色の HEX）", () => {
      render(<CardTone number="01" />);
      expect(screen.getByText("#2D6CDF")).toBeInTheDocument();
    });
  });

  describe("CardHueShift", () => {
    it("BASE を含む12段階の色相シフトを表示し、クリックで追加", () => {
      render(<CardHueShift number="01" />);
      const chips = screen.getAllByRole("button", {
        name: /色相シフト .* をパレットに追加/,
      });
      expect(chips).toHaveLength(12);
      expect(screen.getByText("BASE")).toBeInTheDocument();
      expect(screen.getByText("-150°")).toBeInTheDocument();
      expect(screen.getByText("+180°")).toBeInTheDocument();
      // BASE は基準色そのもの
      expect(
        screen.getByRole("button", {
          name: /色相シフト BASE #2D6CDF をパレットに追加/,
        }),
      ).toBeInTheDocument();
      fireEvent.click(chips[0]);
      expect(useColorStore.getState().palette).toHaveLength(2);
    });

    it("各チップにカラーコードを表示", () => {
      render(<CardHueShift number="01" />);
      expect(screen.getByText("#2D6CDF")).toBeInTheDocument();
    });
  });
});
