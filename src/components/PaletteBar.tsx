"use client";

import { useColorStore } from "@/store/useColorStore";
import { ModeToggle } from "./ModeToggle";
import { Swatch } from "./Swatch";

/**
 * 常設の配色パレットバー（下部, docs/03 / docs/10）。
 * グローバル配色の保持・選択・モード切替・追加・アクセント指定の拠点。
 */
export function PaletteBar() {
  const palette = useColorStore((s) => s.palette);
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const selectedId = useColorStore((s) => s.selectedId);
  const accentId = useColorStore((s) => s.accentId);

  const selectSwatch = useColorStore((s) => s.selectSwatch);
  const openAdd = useColorStore((s) => s.openAdd);
  const openEdit = useColorStore((s) => s.openEdit);
  const apply = useColorStore((s) => s.apply);
  const setAccent = useColorStore((s) => s.setAccent);
  const askClear = useColorStore((s) => s.askClear);

  return (
    <footer className="border-border bg-surface border-t px-4 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <ModeToggle />
        <div className="text-text-3 flex items-center gap-3 text-xs">
          <span className="font-mono">{palette.length} 色</span>
          {palette.length > 0 ? (
            <button
              type="button"
              onClick={askClear}
              className="border-border hover:text-text rounded border px-2 py-1"
            >
              すべて消去
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {palette.length === 0 ? (
          <p className="text-text-3 text-xs">色がありません — ＋ で追加</p>
        ) : (
          palette.map((color, i) => {
            const badge: "FG" | "BG" | "" =
              unit === "pair" && color.id === fgId
                ? "FG"
                : unit === "pair" && color.id === bgId
                  ? "BG"
                  : "";
            const selected =
              (unit === "single" && color.id === selectedId) ||
              (unit === "pair" && (color.id === fgId || color.id === bgId)) ||
              unit === "palette" ||
              view === "design";
            return (
              <Swatch
                key={color.id}
                color={color}
                index={i}
                badge={badge}
                selected={selected}
                isAccent={color.id === accentId}
                onSelect={() => selectSwatch(color.id)}
                onEdit={() => openEdit(color.id)}
                onRemove={() => apply({ kind: "remove", id: color.id })}
                onSetAccent={() => setAccent(color.id)}
              />
            );
          })
        )}

        <button
          type="button"
          onClick={openAdd}
          aria-label="色を追加"
          className="border-border-strong text-text-2 hover:text-text flex h-12 w-12 items-center justify-center rounded-md border border-dashed text-lg"
        >
          ＋
        </button>
      </div>
    </footer>
  );
}
