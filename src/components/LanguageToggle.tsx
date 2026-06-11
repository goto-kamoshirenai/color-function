"use client";

import { useLocale, setLocale } from "@/lib/i18n/locale";

/**
 * 言語切替（ja/en）。ThemeToggle と同じく <html lang>（DOM）を真実の源とし、
 * 手動切替は localStorage に保持して次回訪問時の初期値にする。
 * ボタンは切替先の言語コードを表示する（言語切替 UI の慣例）。
 */
export function LanguageToggle() {
  const locale = useLocale();
  const target = locale === "ja" ? "en" : "ja";
  // ラベルは切替先の言語で表記する（その言語の話者が見つけられるように）
  const label = target === "en" ? "Switch to English" : "日本語に切り替え";

  return (
    <button
      type="button"
      onClick={() => setLocale(target)}
      aria-label={label}
      title={label}
      className="cff-control inline-flex h-9 items-center justify-center px-3 font-mono text-[12px] tracking-[0.08em]"
    >
      {target.toUpperCase()}
    </button>
  );
}
