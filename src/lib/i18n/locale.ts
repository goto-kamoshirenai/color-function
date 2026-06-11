"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getLocale,
  translate,
  type Locale,
  type MessageKey,
  type MessageParams,
} from "./messages";

const LOCALE_EVENT = "cff-locale-change";
const STORAGE_KEY = "cff-lang";

function subscribe(callback: () => void) {
  window.addEventListener(LOCALE_EVENT, callback);
  return () => window.removeEventListener(LOCALE_EVENT, callback);
}

const getServerSnapshot = (): Locale => "ja";

/**
 * 現在のロケールを購読する。
 * テーマと同じく <html lang>（DOM）を真実の源とし、初期値はペイント前
 * スクリプトが localStorage → ブラウザ言語（ja 以外は en）の順で確定する。
 */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, getServerSnapshot);
}

/** 手動切替。localStorage に保持し、次回訪問時の初期値になる。 */
export function setLocale(next: Locale) {
  document.documentElement.lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage 不可環境は無視
  }
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

/** 現在ロケールの翻訳関数 t(key, params) を返す。 */
export function useT() {
  const locale = useLocale();
  return useCallback(
    (key: MessageKey, params?: MessageParams) => translate(locale, key, params),
    [locale],
  );
}
