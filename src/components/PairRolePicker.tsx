"use client";

import { useSyncExternalStore } from "react";
import {
  Select,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  SelectValue,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import { NavArrowDown, NavArrowUp, InfoCircle } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import { useFormatColor } from "@/lib/colorFormat";

type Role = "fg" | "bg";

// 折りたたみ状態（localStorage が真実の源）。この state が効くのは <640 のみで、
// ≥640 では CSS 側で常にフィールドを展開表示する（docs/adr/0001）。初期は折りたたみ。
const COLLAPSED_KEY = "cff-pairbar-collapsed";
const COLLAPSED_EVENT = "cff-pairbar-collapsed-change";

function subscribeCollapsed(callback: () => void) {
  window.addEventListener(COLLAPSED_EVENT, callback);
  return () => window.removeEventListener(COLLAPSED_EVENT, callback);
}

function getCollapsed(): boolean {
  try {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
    return true;
  } catch {
    return true;
  }
}

const getCollapsedServer = () => true;

/**
 * ペア検証モード（単位=pair × ビュー=verify）専用の FG/BG 固定パネル。
 * スクロールしても文字色（FG）／背景色（BG）の切替を常に手元に置く。
 * 3 段階レスポンシブ（docs/adr/0001）:
 *  - PC (≥1280): 左ガターに position:fixed で常時固定（縦積み）。
 *  - タブレット (640–1279): main 最上部に sticky top:0 でスペースを占有（横並び）。
 *  - スマホ (<640): 初期折りたたみ。細い sticky ハンドル → タップで展開。
 */
export function PairRolePicker() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const setRole = useColorStore((s) => s.setRole);
  const t = useT();
  const fmt = useFormatColor();

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

  if (unit !== "pair" || view !== "verify" || palette.length < 2) return null;

  const hexOf = (id: string | null) =>
    palette.find((c) => c.id === id)?.hex ?? "transparent";
  const optionText = (i: number) =>
    `${String(i + 1).padStart(2, "0")} ${fmt(palette[i].hex)}`;

  const hintTooltip = (
    <TooltipTrigger delay={200}>
      <Button
        className="cff-control text-text-3 hover:text-text rounded-control flex size-6 flex-none items-center justify-center"
        aria-label={t("role.pairHint")}
      >
        <InfoCircle width={14} height={14} aria-hidden />
      </Button>
      <Tooltip
        offset={6}
        className="bg-surface border-border-strong rounded-control shadow-overlay text-text-2 max-w-[240px] border px-2.5 py-1.5 text-[12px] leading-[1.5]"
      >
        {t("role.pairHint")}
      </Tooltip>
    </TooltipTrigger>
  );

  const field = (role: Role, selectedId: string | null) => {
    const i = palette.findIndex((c) => c.id === selectedId);
    const word = role === "fg" ? t("role.fgLabel") : t("role.bgLabel");
    const abbr = role === "fg" ? "FG" : "BG";
    return (
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2.5 xl:flex-none xl:flex-col xl:items-start xl:gap-1">
        <span className="flex shrink-0 items-baseline gap-1.5">
          <span className="text-[12px] font-semibold">{word}</span>
          <span className="text-text-3 text-meta font-mono tracking-[0.1em]">
            {abbr}
          </span>
        </span>
        <Select
          className="w-full min-w-0 sm:w-[180px] xl:w-full"
          selectedKey={selectedId ?? undefined}
          onSelectionChange={(key) => setRole(role, String(key))}
          aria-label={t(role === "fg" ? "role.fg" : "role.bg")}
        >
          <Button className="border-border-strong bg-surface-2 hover:border-text-3 rounded-control inline-flex h-9 w-full min-w-0 items-center gap-2 border px-2.5 font-mono text-[12px] tracking-[0.04em] outline-none">
            <span
              className="border-border-strong size-4 flex-none rounded-[2px] border"
              style={{ backgroundColor: hexOf(selectedId) }}
              aria-hidden
            />
            <SelectValue className="min-w-0 flex-1 truncate text-left">
              {i < 0 ? "—" : optionText(i)}
            </SelectValue>
            <NavArrowDown
              width={12}
              height={12}
              className="text-text-3 flex-none"
              aria-hidden
            />
          </Button>
          <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay z-30 min-w-[var(--trigger-width)] border p-1">
            <ListBox className="outline-none">
              {palette.map((color, idx) => (
                <ListBoxItem
                  key={color.id}
                  id={color.id}
                  textValue={optionText(idx)}
                  className="rounded-control data-[focused]:bg-surface-2 flex cursor-default items-center gap-2 px-2.5 py-1.5 font-mono text-[12px] tracking-[0.04em] outline-none data-[selected]:bg-(--text) data-[selected]:text-(--bg)"
                >
                  <span
                    className="border-border-strong size-4 flex-none rounded-[2px] border"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  {optionText(idx)}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </Select>
      </div>
    );
  };

  return (
    <section
      aria-label={t("role.barRegion")}
      className="border-border-strong bg-surface xl:rounded-panel sticky top-0 z-20 -mx-4 mb-4 border-b px-4 py-2.5 sm:-mx-[26px] sm:px-[26px] sm:py-3 xl:fixed xl:top-[64px] xl:left-5 xl:m-0 xl:w-[168px] xl:border xl:px-3 xl:py-3"
    >
      {/* 折りたたみ時のハンドル（スマホのみ） */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={t("role.barExpand")}
        aria-expanded={false}
        className={`${collapsed ? "flex" : "hidden"} w-full items-center gap-2.5 sm:hidden`}
      >
        <span className="text-accent text-meta font-mono tracking-[0.1em]">
          FG·BG
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="border-border-strong size-5 flex-none rounded-[3px] border"
            style={{ backgroundColor: hexOf(fgId) }}
            aria-hidden
          />
          <span
            className="border-border-strong size-5 flex-none rounded-[3px] border"
            style={{ backgroundColor: hexOf(bgId) }}
            aria-hidden
          />
        </span>
        <span className="text-text-2 truncate text-[12px] whitespace-nowrap">
          {t("role.pairLabel")}
        </span>
        <NavArrowDown
          width={14}
          height={14}
          className="text-text-3 ml-auto flex-none"
          aria-hidden
        />
      </button>

      {/* フィールド領域（スマホ折りたたみ時のみ非表示。≥640 は常時表示） */}
      <div
        className={`${collapsed ? "hidden sm:flex" : "flex"} flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 xl:flex-col xl:items-stretch xl:gap-3`}
      >
        {/* ラベル＋ツールチップ＋（スマホのみ）折りたたみボタン */}
        <div className="flex items-center justify-between gap-2 sm:justify-start xl:justify-between">
          <span className="flex items-baseline gap-2">
            <span className="text-[13px] font-bold whitespace-nowrap sm:hidden xl:inline xl:text-[12px]">
              {t("role.pairLabel")}
            </span>
          </span>
          <span className="flex items-center gap-0.5">
            {hintTooltip}
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={t("role.barCollapse")}
              aria-expanded
              className="cff-control text-text-2 hover:text-text flex size-7 items-center justify-center sm:hidden"
            >
              <NavArrowUp width={14} height={14} aria-hidden />
            </button>
          </span>
        </div>
        {field("fg", fgId)}
        {field("bg", bgId)}
      </div>
    </section>
  );
}
