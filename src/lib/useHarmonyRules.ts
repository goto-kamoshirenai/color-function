"use client";

import { useSyncExternalStore } from "react";
import { HARMONY_RULES, type HarmonyRule } from "./assets";

/*
 * 調和ルールはビルド同梱（assets.ts）なので、読み込み状態は持たない。
 * 外部ストアの形は残す — テストからの差し替えで再レンダーさせるため。
 */
let rules: HarmonyRule[] = HARMONY_RULES;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => rules;

/** 調和ルール（docs/06 §4.1）。サーバー・クライアントで同一。 */
export function useHarmonyRules(): HarmonyRule[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** テスト用: ルールを直接注入。 */
export function __setHarmonyRulesForTest(list: HarmonyRule[]) {
  rules = list;
  notify();
}
