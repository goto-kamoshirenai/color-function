"use client";

import { useSyncExternalStore } from "react";
import { Plus, NavArrowDown, NavArrowUp } from "iconoir-react";
import { useColorStore, type Color } from "@/store/useColorStore";
import { ModeToggle } from "./ModeToggle";
import { Swatch } from "./Swatch";
import { HelpButton } from "./HelpButton";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";

const COLLAPSED_KEY = "cff-palette-collapsed";
const COLLAPSED_EVENT = "cff-palette-collapsed-change";

function subscribeCollapsed(callback: () => void) {
  window.addEventListener(COLLAPSED_EVENT, callback);
  return () => window.removeEventListener(COLLAPSED_EVENT, callback);
}

/** 折りたたみ状態（localStorage が真実の源。未設定ならスマホ幅で自動的に畳む）。 */
function getCollapsed(): boolean {
  try {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  } catch {
    return false;
  }
}

const getCollapsedServer = () => false;

/**
 * 常設の配色パレットバー（v2: 上段スウォッチ列／下段モード切替＋CLEAR ALL）。
 * 折りたたみ可（特にスマホでの占有を抑える）。折りたたみ中は選択のみ可能な
 * ミニチップ列になり、選択状態は localStorage に保持。初回はスマホ幅なら自動で畳む。
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
  const fmt = useFormatColor();

  // SSR は展開で描画し、ハイドレーション後に保持値（無ければスマホ幅なら畳む）を反映
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    getCollapsed,
    getCollapsedServer,
  );
  const toggleCollapsed = () => {
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? "0" : "1");
    } catch {
      // localStorage 不可環境は無視
    }
    window.dispatchEvent(new Event(COLLAPSED_EVENT));
  };

  const removeWithToast = (id: string, hex: string) => {
    apply({ kind: "remove", id });
    showToast(t("toast.remove", { hex: fmt(hex) }));
  };
  const setAccentWithToast = (id: string, hex: string) => {
    setAccent(id);
    showToast(t("toast.accent", { hex: fmt(hex) }));
  };

  /** 選択・強調の状態（設計ビューは単位を問わず基準色 selectedId の選択）。 */
  const swatchState = (color: Color) => {
    const design = view === "design";
    const isFg = !design && unit === "pair" && color.id === fgId;
    const isBg = !design && unit === "pair" && color.id === bgId;
    const selBase = (design || unit === "single") && color.id === selectedId;
    const highlighted = selBase || isFg || isBg;
    const active = highlighted || unit === "palette" || design;
    return { isFg, isBg, highlighted, active };
  };

  // 開閉トグルは状態に依らずフッター右下の同一座標に絶対配置する
  // （フッターは画面下端固定のため、下端基準なら画面上の位置が一致する）。
  // 各行は中身の中心がトグル中心（下端から25px）と揃う余白にする。
  const toggle = (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-label={collapsed ? t("palette.expand") : t("palette.collapse")}
      aria-expanded={!collapsed}
      title={collapsed ? t("palette.expand") : t("palette.collapse")}
      className="cff-control text-text-2 hover:text-text absolute right-[22px] bottom-[11px] flex size-7 items-center justify-center"
    >
      {collapsed ? (
        <NavArrowUp width={14} height={14} aria-hidden />
      ) : (
        <NavArrowDown width={14} height={14} aria-hidden />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <footer className="border-border-strong bg-surface relative z-5 flex-none border-t">
        <div className="flex items-center gap-2.5 py-[13px] pr-[60px] pl-[22px]">
          <div className="cff-scroll cff-palette-strip flex flex-1 items-center gap-[7px] overflow-x-auto">
            {palette.length === 0 ? (
              <span className="text-text-3 font-mono text-xs">
                {t("palette.empty")}
              </span>
            ) : (
              palette.map((color, i) => {
                const { isFg, isBg, highlighted, active } = swatchState(color);
                const badge = isFg ? " (FG)" : isBg ? " (BG)" : "";
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => selectSwatch(color.id)}
                    aria-label={t("swatch.select", {
                      n: i + 1,
                      hex: fmt(color.hex),
                      badge,
                    })}
                    aria-pressed={highlighted}
                    title={fmt(color.hex)}
                    className="border-border-strong rounded-control h-6 w-9 flex-none border p-0"
                    style={{
                      backgroundColor: color.hex,
                      opacity: active ? 1 : 0.5,
                      boxShadow: highlighted
                        ? "var(--shadow-selected)"
                        : "none",
                    }}
                  />
                );
              })
            )}
            <button
              type="button"
              onClick={openAdd}
              aria-label={t("palette.add")}
              title={t("palette.add")}
              className="border-border-strong text-text-2 hover:border-accent hover:text-accent rounded-control flex h-6 w-9 flex-none items-center justify-center border border-dashed bg-transparent"
            >
              <Plus width={14} height={14} aria-hidden />
            </button>
          </div>
        </div>
        {toggle}
      </footer>
    );
  }

  return (
    <footer className="border-border-strong bg-surface relative z-5 flex-none border-t">
      {/* 上段: スウォッチ列 */}
      <div className="cff-scroll cff-palette-strip flex items-start gap-[15px] overflow-x-auto px-[22px] pt-[13px] pb-2.5">
        {palette.length === 0 ? (
          <div className="flex h-[66px] items-center gap-3 pl-0.5">
            <span className="text-text-3 font-mono text-xs">
              {t("palette.empty")}
            </span>
          </div>
        ) : (
          palette.map((color, i) => {
            const { isFg, isBg, highlighted, active } = swatchState(color);
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

      {/* 下段: モード切替＋カウント＋CLEAR ALL（折りたたみトグルは絶対配置） */}
      <div className="border-border flex flex-wrap items-center justify-between gap-x-[18px] gap-y-2 border-t pt-[9px] pr-[60px] pb-2.5 pl-[22px]">
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
      {toggle}
    </footer>
  );
}
