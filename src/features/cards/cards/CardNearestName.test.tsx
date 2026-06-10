import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardNearestName } from "./CardNearestName";
import { resetColorStore, useColorStore } from "@/store/useColorStore";
import {
  __setColorNamesForTest,
  __resetColorNamesForTest,
} from "@/lib/useColorNames";

describe("CardNearestName", () => {
  beforeEach(() => {
    resetColorStore(["#fe0a00"]);
    act(() => useColorStore.getState().setUnit("single"));
    __setColorNamesForTest([
      { name: "Red", hex: "#FF0000" },
      { name: "Blue", hex: "#0000FF" },
    ]);
  });
  afterEach(() => __resetColorNamesForTest());

  it("選択色に最も近い色名と ΔE を表示", () => {
    render(<CardNearestName />);
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText(/ΔE/)).toBeInTheDocument();
  });

  it("辞書が空なら読み込み中表示（fetchは発生させない）", () => {
    __setColorNamesForTest([]);
    render(<CardNearestName />);
    expect(screen.getByText(/読み込み中/)).toBeInTheDocument();
  });
});
