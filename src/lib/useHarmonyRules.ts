"use client";

import { useEffect, useSyncExternalStore } from "react";
import { loadHarmonyRules, type HarmonyRule } from "./assets";

const EMPTY: HarmonyRule[] = [];

let rules: HarmonyRule[] = EMPTY;
let status: "idle" | "loading" | "loaded" = "idle";
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => rules;
const getServerSnapshot = () => EMPTY;

async function ensureLoaded() {
  if (status !== "idle") return;
  status = "loading";
  rules = await loadHarmonyRules();
  status = "loaded";
  notify();
}

/** 調和ルールを一度だけ読み込み、結果を購読（docs/06 §4.1）。 */
export function useHarmonyRules(): HarmonyRule[] {
  useEffect(() => {
    void ensureLoaded();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** テスト用: ルールを直接注入。 */
export function __setHarmonyRulesForTest(list: HarmonyRule[]) {
  rules = list;
  status = "loaded";
  notify();
}
