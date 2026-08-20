import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GuideContent } from "./GuideContent";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { filterCards } from "@/features/cards/types";
import { layoutFor } from "@/features/cards/layout";
import { guideShotSize } from "@/lib/guideShots";

/** そのモードで実際に描かれるカードの数（早見表の期待値）。 */
function cardCount(
  unit: "single" | "pair" | "palette",
  view: "verify" | "design",
) {
  const keys = new Set(
    filterCards(CARD_REGISTRY, unit, view).map((c) => c.key),
  );
  return layoutFor(unit, view)
    .flatMap((row) => row.keys)
    .filter((key) => keys.has(key)).length;
}

describe("使い方ページ", () => {
  it("手順・モード・持ち出し方の節を出す", () => {
    render(<GuideContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: "使い方" }),
    ).toBeVisible();
    for (const title of [
      "30秒で始める",
      "モードと表示されるカード",
      "カード見出しの3つのボタン",
      "結果の持ち出し方",
    ]) {
      expect(screen.getByRole("heading", { name: title }), title).toBeVisible();
    }
  });

  it("モード別のカード数は registry と LAYOUT から出す（手書きしない）", () => {
    render(<GuideContent />);
    expect(screen.getByText(`${cardCount("pair", "verify")} 枚`)).toBeVisible();
    expect(
      screen.getByText(`${cardCount("palette", "design")} 枚`),
    ).toBeVisible();
    // 実在するカードの指標名が並ぶ
    expect(screen.getByText(/WCAG コントラスト比/)).toBeVisible();
  });

  it("画面写真は寸法つきで描く（読み込み前のガタつきを防ぐ）", () => {
    render(<GuideContent />);
    const size = guideShotSize("palette");
    expect(size).toBeDefined();
    if (!size) return;

    const shots = screen.getAllByRole("img", { name: /パレットバー/ });
    // ライト・ダークの2枚（CSS で出し分ける）
    expect(shots).toHaveLength(2);
    for (const shot of shots) {
      expect(shot).toHaveAttribute("width", String(size.width));
      expect(shot).toHaveAttribute("height", String(size.height));
    }
  });

  it("学びの3系統へ渡す", () => {
    render(<GuideContent />);
    for (const href of ["/learn", "/library", "/code"]) {
      expect(document.querySelector(`a[href="${href}"]`), href).not.toBeNull();
    }
  });
});
