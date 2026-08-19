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
    render(<CardNearestName number="01" />);
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText(/ΔE/)).toBeInTheDocument();
  });

  it("辞書が空なら読み込めない旨を表示する", () => {
    __setColorNamesForTest([]);
    render(<CardNearestName number="01" />);
    expect(screen.getByText(/色名辞書を読み込めません/)).toBeInTheDocument();
  });

  it("既定ではビルド同梱の辞書から名前が出る（fetch は発生しない）", () => {
    __resetColorNamesForTest();
    resetColorStore(["#FF0000"]);
    act(() => useColorStore.getState().setUnit("single"));
    render(<CardNearestName number="01" />);
    expect(screen.getByText(/ΔE/)).toBeInTheDocument();
  });
});
