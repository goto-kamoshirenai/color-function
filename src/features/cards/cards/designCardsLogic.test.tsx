import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { CardTokens } from "./CardTokens";
import { CardMix } from "./CardMix";
import { CardGradient } from "./CardGradient";
import { CardSortNormalize } from "./CardSortNormalize";
import { CardTemplates } from "./CardTemplates";
import { CardNudge } from "./CardNudge";
import { CardCvdSafe } from "./CardCvdSafe";
import { PALETTE_TEMPLATES } from "../templates";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

const hexes = () => useColorStore.getState().palette.map((c) => c.hex);

/** ロジックを持つ設計カードの振る舞い（出力・適用・空状態）。 */
describe("設計カードのロジック", () => {
  beforeEach(() => {
    resetColorStore(["#FFFFFF", "#111111", "#2D6CDF", "#E4572E"]);
    act(() => useColorStore.getState().setView("design"));
  });

  describe("CardTokens", () => {
    it("CSS 変数として出力し、ロール名を使う", () => {
      render(<CardTokens number="01" />);
      expect(screen.getByText(/:root \{/)).toBeInTheDocument();
      expect(screen.getByText(/--color-background:/)).toBeInTheDocument();
      expect(screen.getByText(/#ffffff/)).toBeInTheDocument();
    });

    it("形式を JSON に切り替えると JSON になる", () => {
      render(<CardTokens number="01" />);
      fireEvent.click(screen.getByRole("radio", { name: "JSON" }));
      const pre = screen.getByText(/"background":/);
      expect(pre.textContent?.trimStart().startsWith("{")).toBe(true);
    });

    it("形式を Tailwind に切り替えると @theme 用の並びになる", () => {
      render(<CardTokens number="01" />);
      fireEvent.click(screen.getByRole("radio", { name: "TW" }));
      expect(screen.getByText(/@theme/)).toBeInTheDocument();
    });

    it("コピーはクリップボードへ出力テキストを渡す", () => {
      const writeText = vi.fn();
      vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
      render(<CardTokens number="01" />);
      fireEvent.click(screen.getByRole("button", { name: "コピー" }));
      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText.mock.calls[0][0]).toContain("--color-background:");
      vi.unstubAllGlobals();
    });

    it("空パレットでは案内を出し、形式切替も出さない", () => {
      resetColorStore([]);
      render(<CardTokens number="01" />);
      expect(screen.getByText(/色がありません/)).toBeInTheDocument();
      expect(screen.queryByRole("radio", { name: "JSON" })).toBeNull();
    });
  });

  describe("CardMix", () => {
    it("4 つの合成モードの結果をパレットへ追加できる", () => {
      render(<CardMix number="01" />);
      const buttons = screen.getAllByRole("button", {
        name: /をパレットに追加/,
      });
      expect(buttons).toHaveLength(4);

      fireEvent.click(buttons[0]);
      expect(hexes()).toHaveLength(5);
    });

    it("2色未満では案内を表示", () => {
      resetColorStore(["#FFFFFF"]);
      render(<CardMix number="01" />);
      expect(screen.getByText(/2色以上/)).toBeInTheDocument();
    });
  });

  describe("CardGradient", () => {
    it("補間色空間を切り替えても段数は保たれる", () => {
      render(<CardGradient number="01" />);
      const before = screen.getAllByRole("button", {
        name: /をパレットに追加/,
      }).length;
      expect(before).toBeGreaterThan(2);

      fireEvent.click(screen.getByRole("radio", { name: /oklab/i }));
      expect(
        screen.getAllByRole("button", { name: /をパレットに追加/ }),
      ).toHaveLength(before);
    });
  });

  describe("CardSortNormalize", () => {
    it("色相順で並べ替える（無彩色は末尾）", () => {
      resetColorStore(["#888888", "#0000FF", "#FF0000"]);
      render(<CardSortNormalize number="01" />);
      fireEvent.click(screen.getByRole("button", { name: "色相順" }));
      expect(hexes()[hexes().length - 1]).toBe("#888888");
      expect(useColorStore.getState().toast).toBe("並べ替えました");
    });

    it("明度順は明るい順に並ぶ", () => {
      resetColorStore(["#111111", "#FFFFFF", "#888888"]);
      render(<CardSortNormalize number="01" />);
      fireEvent.click(screen.getByRole("button", { name: "明度順" }));
      expect(hexes()[0]).toBe("#FFFFFF");
      expect(hexes()[2]).toBe("#111111");
    });

    it("明度の均等化はパレットを置き換える（3色未満は無効）", () => {
      render(<CardSortNormalize number="01" />);
      fireEvent.click(screen.getByRole("button", { name: "明度を均等化" }));
      expect(useColorStore.getState().toast).toBe(
        "明度ステップを均等化しました",
      );

      resetColorStore(["#111111", "#FFFFFF"]);
      render(<CardSortNormalize number="02" />);
      expect(
        screen.getAllByRole("button", { name: "明度を均等化" })[0],
      ).toBeDisabled();
    });
  });

  describe("CardTemplates", () => {
    it("テンプレート適用でパレットを置き換える", () => {
      render(<CardTemplates number="01" />);
      const first = PALETTE_TEMPLATES[0];
      fireEvent.click(
        screen.getByRole("button", {
          name: new RegExp(first.name.ja),
        }),
      );
      expect(hexes()).toEqual(first.hexes.map((h) => h.toUpperCase()));
    });
  });

  describe("CardNudge / CardCvdSafe", () => {
    it("ナッジ: AA に届く候補を提案し、適用でその色に置き換わる", () => {
      resetColorStore(["#777777", "#888888"]);
      render(<CardNudge number="01" />);
      const apply = screen.getAllByRole("button", { name: /適用|置き換/ });
      expect(apply.length).toBeGreaterThan(0);
      fireEvent.click(apply[0]);
      expect(hexes()[0]).not.toBe("#777777");
    });

    it("色覚セーフ: 2色未満では案内を表示", () => {
      resetColorStore(["#777777"]);
      render(<CardCvdSafe number="01" />);
      expect(screen.getByText(/2色以上/)).toBeInTheDocument();
    });
  });
});
