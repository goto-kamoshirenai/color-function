"use client";

import { useT } from "@/lib/i18n/locale";

/**
 * メインコンテンツへのスキップリンク（WCAG 2.4.1）。
 * 通常は視覚的に隠し、フォーカスが当たったときだけ左上に現れる。
 * ヘッダー・パレットバーのコントロールを毎回 Tab で通らずに本文へ移れる。
 *
 * 遷移は JS でフォーカス移動する（URL ハッシュは共有パレット `#p=` に
 * 使っているため、`#main` で上書きしない）。JS 無効時は素のアンカーとして働く。
 */
export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      onClick={(e) => {
        const main = document.getElementById("main");
        if (!main) return;
        e.preventDefault();
        main.focus();
      }}
      className="cff-control bg-surface text-text sr-only font-mono text-[12.5px] focus:not-sr-only focus:fixed focus:top-[calc(0.5rem_+_env(safe-area-inset-top))] focus:left-2 focus:z-50 focus:px-3 focus:py-2"
    >
      {t("nav.skipToMain")}
    </a>
  );
}
