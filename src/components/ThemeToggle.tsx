"use client";

import { useCallback, useSyncExternalStore } from "react";
import { HalfMoon, SunLight } from "iconoir-react";
import { useT } from "@/lib/i18n/locale";

type Theme = "light" | "dark";

const THEME_EVENT = "cff-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

/**
 * テーマ切替（light/dark）。docs/10 §1 のトークンを data-theme で切り替える。
 * 値は localStorage に保存（DBレス・docs/02）。S0 の最小実装。
 * data-theme（DOM）を真実の源とし、useSyncExternalStore で購読する。
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useT();

  const toggle = useCallback(() => {
    const next: Theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("cff-theme", next);
    } catch {
      // localStorage 不可環境は無視
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? t("theme.toDark") : t("theme.toLight")}
      className="cff-control inline-flex size-9 items-center justify-center font-mono text-[13px]"
    >
      {theme === "light" ? (
        <HalfMoon width={16} height={16} aria-hidden />
      ) : (
        <SunLight width={16} height={16} aria-hidden />
      )}
    </button>
  );
}
