"use client";

import { useSyncExternalStore } from "react";
import { COLOR_NAMES } from "./assets";
import type { ColorNameEntry } from "@/core/color";

/*
 * 色名辞書はビルド同梱（assets.ts）なので、読み込み状態は持たない。
 * 外部ストアの形は残す — テストからの差し替えで再レンダーさせるため。
 */
let names: ColorNameEntry[] = COLOR_NAMES;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => names;

/** 色名辞書（docs/06）。サーバー・クライアントで同一。 */
export function useColorNames(): ColorNameEntry[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** テスト用: 辞書を直接注入。 */
export function __setColorNamesForTest(list: ColorNameEntry[]) {
  names = list;
  notify();
}

/** テスト用: 同梱辞書へ戻す。 */
export function __resetColorNamesForTest() {
  names = COLOR_NAMES;
  notify();
}
