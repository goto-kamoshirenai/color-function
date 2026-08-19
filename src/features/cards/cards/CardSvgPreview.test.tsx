import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardSvgPreview } from "./CardSvgPreview";
import { resetColorStore, useColorStore } from "@/store/useColorStore";

const shapes = () => {
  const svg = screen.getByRole("img");
  return Array.from(svg.querySelectorAll("circle, rect, polygon"));
};

describe("CardSvgPreview", () => {
  beforeEach(() => {
    act(() => useColorStore.getState().setView("design"));
  });

  it("色数に応じて図形数を間引く（同色の反復を作らない）", () => {
    resetColorStore(["#111111", "#222222"]);
    render(<CardSvgPreview number="01" />);
    // 背景 + 図形1個
    expect(shapes()).toHaveLength(2);
    const fills = shapes().map((el) => el.getAttribute("fill"));
    expect(new Set(fills).size).toBe(2);
  });

  it("色が増えれば図形も増える（上限6）", () => {
    resetColorStore([
      "#111111",
      "#222222",
      "#333333",
      "#444444",
      "#555555",
      "#666666",
      "#777777",
    ]);
    render(<CardSvgPreview number="01" />);
    expect(shapes()).toHaveLength(6);
  });

  it("1色でも破綻しない（背景のみ）", () => {
    resetColorStore(["#111111"]);
    render(<CardSvgPreview number="01" />);
    expect(shapes()).toHaveLength(1);
  });

  it("空パレットでは案内を表示", () => {
    resetColorStore([]);
    render(<CardSvgPreview number="01" />);
    expect(screen.getByText(/色がありません/)).toBeInTheDocument();
  });
});
