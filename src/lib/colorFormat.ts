"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  formatColor,
  COLOR_FORMATS,
  type ColorFormat,
} from "@/core/color/format";

const STORAGE_KEY = "cff-color-format";
const EVENT = "cff-color-format-change";

function isColorFormat(v: string | null): v is ColorFormat {
  return COLOR_FORMATS.includes(v as ColorFormat);
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/** 現在の表示形式（localStorage を真実の源。未設定・SSR では hex）。 */
export function getColorFormat(): ColorFormat {
  if (typeof window === "undefined") return "hex";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isColorFormat(v) ? v : "hex";
  } catch {
    return "hex";
  }
}

const getServerSnapshot = (): ColorFormat => "hex";

/** 表示形式を購読する（テーマ・言語と同じ event + useSyncExternalStore 方式）。 */
export function useColorFormat(): ColorFormat {
  return useSyncExternalStore(subscribe, getColorFormat, getServerSnapshot);
}

/** 表示形式を変更し、次回訪問にも保持する。 */
export function setColorFormat(next: ColorFormat) {
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage 不可環境は無視
  }
  window.dispatchEvent(new Event(EVENT));
}

/** 現在の表示形式でカラーコードを整形する関数を返す。 */
export function useFormatColor(): (hex: string) => string {
  const format = useColorFormat();
  return useCallback((hex: string) => formatColor(hex, format), [format]);
}
