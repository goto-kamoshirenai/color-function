import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CardList } from "./CardList";
import { useColorStore, resetColorStore } from "@/store/useColorStore";
import { act } from "react";

describe("CardList（単色×検証）", () => {
  beforeEach(() => {
    resetColorStore(["#2D6CDF", "#E4572E"]);
    act(() => {
      useColorStore.getState().setUnit("single");
      useColorStore.getState().setView("verify");
    });
  });

  it("単色×検証で色値・HSV・相対輝度・色相環カードを表示", () => {
    render(<CardList />);
    for (const title of ["色値", "HSV", "相対輝度", "色相環"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("色値カードは選択色の HEX を表示し、クリックでコピー（トースト）", () => {
    render(<CardList />);
    expect(screen.getByText("#2D6CDF")).toBeInTheDocument();
    fireEvent.click(screen.getByText("#2D6CDF"));
    expect(useColorStore.getState().toast).toContain("#2D6CDF");
  });

  it("ペア×検証ではカード未実装の案内", () => {
    act(() => useColorStore.getState().setUnit("pair"));
    render(<CardList />);
    expect(screen.getByText(/順次追加されます/)).toBeInTheDocument();
  });
});
