"use client";

import { useEffect, useSyncExternalStore } from "react";
import { loadColorNames } from "./assets";
import type { ColorNameEntry } from "@/core/color";

const EMPTY: ColorNameEntry[] = [];

let names: ColorNameEntry[] = EMPTY;
let status: "idle" | "loading" | "loaded" = "idle";
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => names;
const getServerSnapshot = () => EMPTY;

async function ensureLoaded() {
  if (status !== "idle") return;
  status = "loading";
  try {
    names = await loadColorNames();
  } catch {
    names = EMPTY;
  }
  status = "loaded";
  notify();
}

/** 色名辞書を一度だけ読み込み、結果を購読（docs/06）。SSRでは空。 */
export function useColorNames(): ColorNameEntry[] {
  useEffect(() => {
    void ensureLoaded();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** テスト用: 辞書を直接注入（読み込み済み扱い）。 */
export function __setColorNamesForTest(list: ColorNameEntry[]) {
  names = list;
  status = "loaded";
  notify();
}

/** テスト用: 状態を初期化。 */
export function __resetColorNamesForTest() {
  names = EMPTY;
  status = "idle";
}
