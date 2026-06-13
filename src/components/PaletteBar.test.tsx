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
  beforeEach(() => {
    resetColorStore(["#1F2933", "#2D6CDF", "#E4572E"]);
    localStorage.removeItem("cff-palette-collapsed");
  });

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
    expect(screen.getByText(/NO SWATCHES/)).toBeInTheDocument();
  });

  describe("並べ替え", () => {
    it("色カードの →キー で次の位置へ移動する", () => {
      renderBar();
      const before = useColorStore.getState().palette.map((c) => c.hex);
      const tiles = screen.getAllByRole("button", { name: /を選択$/ });
      fireEvent.keyDown(tiles[0], { key: "ArrowRight" });

      const after = useColorStore.getState().palette.map((c) => c.hex);
      expect(after).toEqual([before[1], before[0], before[2]]);
    });

    it("先頭で ←キー を押しても順序は変わらない", () => {
      renderBar();
      const before = useColorStore.getState().palette.map((c) => c.hex);
      const tiles = screen.getAllByRole("button", { name: /を選択$/ });
      fireEvent.keyDown(tiles[0], { key: "ArrowLeft" });

      expect(useColorStore.getState().palette.map((c) => c.hex)).toEqual(
        before,
      );
    });

    it("色カードのドラッグ＆ドロップで対象位置へ移動する", () => {
      renderBar();
      const before = useColorStore.getState().palette.map((c) => c.hex);
      const tiles = screen.getAllByRole("button", { name: /を選択$/ });
      const wrappers = tiles
        .map((el) => el.closest("div.relative")?.parentElement)
        .filter((el): el is HTMLElement => el !== null && el !== undefined);

      // 先頭をドラッグ開始 → 3番目のカード上でドロップ
      fireEvent.dragStart(tiles[0]);
      fireEvent.dragEnter(wrappers[2]);
      fireEvent.drop(wrappers[2]);

      const after = useColorStore.getState().palette.map((c) => c.hex);
      expect(after).toEqual([before[1], before[2], before[0]]);
    });
  });

  describe("折りたたみ", () => {
    it("折りたたむとミニチップ列になり、モード切替等が隠れる", () => {
      renderBar();
      fireEvent.click(
        screen.getByRole("button", { name: "パレットを折りたたむ" }),
      );

      // 選択は引き続き可能（ミニチップ）
      const chips = screen.getAllByRole("button", { name: /を選択$/ });
      expect(chips).toHaveLength(3);
      // モード切替・CLEAR ALL・編集系は非表示
      expect(screen.queryByRole("radio", { name: "単色" })).toBeNull();
      expect(screen.queryByRole("button", { name: "すべて消去" })).toBeNull();
      expect(screen.queryByRole("button", { name: /を削除$/ })).toBeNull();
      // 保持される
      expect(localStorage.getItem("cff-palette-collapsed")).toBe("1");
    });

    it("展開で元の UI に戻る", () => {
      renderBar();
      fireEvent.click(
        screen.getByRole("button", { name: "パレットを折りたたむ" }),
      );
      fireEvent.click(screen.getByRole("button", { name: "パレットを展開" }));

      expect(screen.getByRole("radio", { name: "単色" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "すべて消去" }),
      ).toBeInTheDocument();
      expect(localStorage.getItem("cff-palette-collapsed")).toBe("0");
    });

    it("折りたたみ中でもミニチップで選択できる", () => {
      renderBar();
      fireEvent.click(
        screen.getByRole("button", { name: "パレットを折りたたむ" }),
      );
      const chips = screen.getAllByRole("button", { name: /を選択$/ });
      fireEvent.click(chips[1]); // 基準色の選択
      expect(useColorStore.getState().selectedId).toBe(
        useColorStore.getState().palette[1].id,
      );
    });
  });
});
