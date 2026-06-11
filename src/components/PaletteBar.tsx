"use client";

import { Plus } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { ModeToggle } from "./ModeToggle";
import { Swatch } from "./Swatch";
import { HelpButton } from "./HelpButton";
import { useT } from "@/lib/i18n/locale";

/**
 * 常設の配色パレットバー（v2: 上段スウォッチ列／下段モード切替＋CLEAR ALL）。
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
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  const removeWithToast = (id: string, hex: string) => {
    apply({ kind: "remove", id });
    showToast(t("toast.remove", { hex }));
  };
  const setAccentWithToast = (id: string, hex: string) => {
    setAccent(id);
    showToast(t("toast.accent", { hex }));
  };

  return (
    <footer className="border-border-strong bg-surface z-5 flex-none border-t">
      {/* 上段: スウォッチ列 */}
      <div className="cff-scroll flex items-start gap-[15px] overflow-x-auto px-[22px] pt-[13px] pb-2.5">
        {palette.length === 0 ? (
          <div className="flex h-[66px] items-center gap-3 pl-0.5">
            <span className="text-text-3 font-mono text-xs">
              {t("palette.empty")}
            </span>
          </div>
        ) : (
          palette.map((color, i) => {
            // 設計ビューは単位を問わず基準色（selectedId）の選択として扱う
            const design = view === "design";
            const isFg = !design && unit === "pair" && color.id === fgId;
            const isBg = !design && unit === "pair" && color.id === bgId;
            const selBase =
              (design || unit === "single") && color.id === selectedId;
            const highlighted = selBase || isFg || isBg;
            const active = highlighted || unit === "palette" || design;
            return (
              <Swatch
                key={color.id}
                color={color}
                index={i}
                badge={isFg ? "FG" : isBg ? "BG" : ""}
                highlighted={highlighted}
                dimmed={!active}
                isAccent={color.id === accentId}
                onSelect={() => selectSwatch(color.id)}
                onEdit={() => openEdit(color.id)}
                onRemove={() => removeWithToast(color.id, color.hex)}
                onSetAccent={() => setAccentWithToast(color.id, color.hex)}
              />
            );
          })
        )}
        <button
          type="button"
          onClick={openAdd}
          aria-label={t("palette.add")}
          title={t("palette.add")}
          className="border-border-strong text-text-2 hover:border-accent hover:text-accent rounded-panel mt-[15px] flex size-[50px] flex-none items-center justify-center border-[1.5px] border-dashed bg-transparent"
        >
          <Plus width={20} height={20} aria-hidden />
        </button>
      </div>

      {/* 下段: モード切替＋カウント＋CLEAR ALL */}
      <div className="border-border flex flex-wrap items-center justify-between gap-[18px] border-t px-[22px] pt-[9px] pb-3">
        <ModeToggle />
        <div className="flex items-center gap-2.5">
          <HelpButton helpKey="usage" />
          <span className="text-text-3 text-meta font-mono">
            {t("palette.count", { count: palette.length })}
          </span>
          {palette.length > 0 ? (
            <button
              type="button"
              onClick={askClear}
              aria-label={t("palette.clear")}
              className="cff-control text-text-2 hover:text-text px-3 py-[7px] font-mono text-[12px] tracking-[0.04em] whitespace-nowrap"
            >
              CLEAR ALL
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
