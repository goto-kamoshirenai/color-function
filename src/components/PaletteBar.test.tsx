import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PaletteBar } from "./PaletteBar";
import { ColorPicker } from "./ColorPicker";
import { ConfirmDialog } from "./ConfirmDialog";
import { useColorStore, resetColorStore } from "@/store/useColorStore";

function renderBar() {
  return render(
    <>
      <PaletteBar />
      <ColorPicker />
      <ConfirmDialog />
    </>,
  );
}

describe("PaletteBar", () => {
  beforeEach(() => resetColorStore(["#1F2933", "#2D6CDF", "#E4572E"]));

  it("パレットの色数だけスウォッチを描画する", () => {
    renderBar();
    const swatches = screen.getAllByRole("button", { name: /を選択$/ });
    expect(swatches).toHaveLength(3);
  });

  it("＋ で追加し、ピッカーで色を入れるとパレットが増える", () => {
    renderBar();
    fireEvent.click(screen.getByRole("button", { name: "色を追加" }));

    const hexInput = screen.getByRole("textbox");
    fireEvent.change(hexInput, { target: { value: "#abcdef" } });
    fireEvent.click(screen.getByRole("button", { name: "追加" }));

    expect(useColorStore.getState().palette).toHaveLength(4);
    expect(useColorStore.getState().palette[3].hex).toBe("#ABCDEF");
  });

  it("すべて消去 → 確認ダイアログ → 消去で空になる", () => {
    renderBar();
    fireEvent.click(screen.getByRole("button", { name: "すべて消去" }));

    const dialog = screen.getByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "消去する" }));

    expect(useColorStore.getState().palette).toHaveLength(0);
  });

  it("空状態では案内を表示する", () => {
    resetColorStore([]);
    renderBar();
    expect(screen.getByText(/色がありません/)).toBeInTheDocument();
  });
});
