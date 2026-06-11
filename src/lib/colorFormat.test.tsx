import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { PaletteBar } from "@/components/PaletteBar";
import { ColorFormatSelect } from "@/components/ColorFormatSelect";
import { resetColorStore } from "@/store/useColorStore";
import { setColorFormat, getColorFormat } from "./colorFormat";

describe("カラーコード表示形式", () => {
  beforeEach(() => resetColorStore(["#2D6CDF"]));
  afterEach(() => act(() => setColorFormat("hex")));

  it("既定は HEX 表示", () => {
    render(<PaletteBar />);
    expect(getColorFormat()).toBe("hex");
    expect(screen.getByText("#2D6CDF")).toBeInTheDocument();
  });

  it("rgb に切り替えるとスウォッチラベルが即時 RGB 表記になる", () => {
    render(<PaletteBar />);
    act(() => setColorFormat("rgb"));
    expect(screen.getByText("45, 108, 223")).toBeInTheDocument();
    expect(screen.queryByText("#2D6CDF")).not.toBeInTheDocument();
  });

  it("セレクタから形式を選ぶと localStorage に保持される", () => {
    render(<ColorFormatSelect />);
    fireEvent.click(screen.getByRole("button", { name: /HEX/ }));
    fireEvent.click(screen.getByRole("option", { name: "HSL" }));
    expect(getColorFormat()).toBe("hsl");
    expect(localStorage.getItem("cff-color-format")).toBe("hsl");
  });
});
