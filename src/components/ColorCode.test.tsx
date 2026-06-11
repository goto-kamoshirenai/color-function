import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { ColorCode } from "./ColorCode";
import { useColorStore, resetColorStore } from "@/store/useColorStore";
import { setColorFormat } from "@/lib/colorFormat";

describe("ColorCode（クリックでコピー）", () => {
  beforeEach(() => resetColorStore(["#2D6CDF"]));
  afterEach(() => act(() => setColorFormat("hex")));

  it("HEX 表示時は HEX をコピーしトーストで通知する", () => {
    render(<ColorCode hex="#2D6CDF" />);
    fireEvent.click(screen.getByRole("button", { name: "#2D6CDF をコピー" }));
    expect(useColorStore.getState().toast).toBe("コピー: #2D6CDF");
  });

  it("rgb 表示時は表示が簡潔表記・コピーは rgb() 関数表記", () => {
    render(<ColorCode hex="#2D6CDF" />);
    act(() => setColorFormat("rgb"));
    const btn = screen.getByRole("button", { name: "45, 108, 223 をコピー" });
    expect(btn).toHaveTextContent("45, 108, 223");
    fireEvent.click(btn);
    expect(useColorStore.getState().toast).toBe("コピー: rgb(45, 108, 223)");
  });
});
