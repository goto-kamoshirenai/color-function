import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { ColorPicker } from "./ColorPicker";
import { useColorStore, resetColorStore } from "@/store/useColorStore";

const get = () => useColorStore.getState();

function openEditFirst() {
  render(<ColorPicker />);
  act(() => get().openEdit(get().palette[0].id));
}

describe("ColorPicker（入力形式の切替）", () => {
  beforeEach(() => resetColorStore(["#000000"]));

  it("既定は HSV モードで、スライダーが従来どおり動く", () => {
    openEditFirst();
    fireEvent.change(screen.getByRole("slider", { name: "V 明度" }), {
      target: { value: "100" },
    });
    expect(get().picker.v).toBe(100);
  });

  it("RGB モードの R スライダーが HEX・HSV に反映される", () => {
    openEditFirst();
    fireEvent.click(screen.getByRole("radio", { name: "RGB" }));
    fireEvent.change(screen.getByRole("slider", { name: "R 赤" }), {
      target: { value: "255" },
    });
    expect(get().picker.hexInput.toLowerCase()).toBe("#ff0000");
    expect(get().picker.s).toBeCloseTo(100, 0);
    expect(get().picker.v).toBeCloseTo(100, 0);
  });

  it("HSL モードで L を最大にすると白になる", () => {
    openEditFirst();
    fireEvent.click(screen.getByRole("radio", { name: "HSL" }));
    fireEvent.change(screen.getByRole("slider", { name: "L 明度" }), {
      target: { value: "100" },
    });
    expect(get().picker.hexInput.toLowerCase()).toBe("#ffffff");
  });

  it("形式を切り替えても編集中の色は変わらない", () => {
    resetColorStore(["#2D6CDF"]);
    openEditFirst();
    fireEvent.click(screen.getByRole("radio", { name: "RGB" }));
    fireEvent.click(screen.getByRole("radio", { name: "HSL" }));
    expect(get().picker.hexInput).toBe("#2D6CDF");
  });
});
