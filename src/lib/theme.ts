"use client";

import { useSyncExternalStore } from "react";

/**
 * テーマ（light/dark）。data-theme（DOM）を真実の源とし、初期値は
 * ペイント前スクリプトが localStorage から確定する（docs/10 §1）。
 * 旧 ThemeToggle のロジックを設定メニューから使えるよう切り出したもの。
 */
export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** 任意の値が Theme かを判定する（アサーションを使わない）。 */
export function isTheme(v: unknown): v is Theme {
  return v === "light" || v === "dark";
}

const THEME_EVENT = "cff-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): Theme {
  const v = document.documentElement.dataset.theme;
  return isTheme(v) ? v : "light";
}

const getServerSnapshot = (): Theme => "light";

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** テーマを変更し localStorage に保持（StoreSync がアクセント再補正を購読）。 */
export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("cff-theme", next);
  } catch {
    // localStorage 不可環境は無視
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}
