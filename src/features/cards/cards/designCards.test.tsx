import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { CardHarmony } from "./CardHarmony";
import { CardTone } from "./CardTone";
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
      render(<CardHarmony />);
      expect(screen.getByText("補色")).toBeInTheDocument();
      expect(screen.getByText("トライアド")).toBeInTheDocument();
      // 補色2 + トライアド3 = 5チップ
      expect(
        screen.getAllByRole("button", { name: /をパレットに追加/ }),
      ).toHaveLength(5);
    });

    it("チップをクリックするとパレットに追加される", () => {
      render(<CardHarmony />);
      const chips = screen.getAllByRole("button", { name: /をパレットに追加/ });
      fireEvent.click(chips[1]); // 補色の相手色
      expect(useColorStore.getState().palette).toHaveLength(2);
    });
  });

  describe("CardTone", () => {
    it("5段階のトーンを表示し、クリックで追加", () => {
      render(<CardTone />);
      const chips = screen.getAllByRole("button", {
        name: /トーン .* をパレットに追加/,
      });
      expect(chips).toHaveLength(5);
      fireEvent.click(chips[0]);
      expect(useColorStore.getState().palette).toHaveLength(2);
    });
  });
});
