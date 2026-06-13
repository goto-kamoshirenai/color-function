"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "iconoir-react";
import { useT } from "@/lib/i18n/locale";

/**
 * ホーム以外のページで、コンテンツ領域（main）の左上に浮かせる「ホームに戻る」導線。
 * main 直下に sticky で在席するため全スクロールで追従し、上余白を確保して
 * ページのマストヘッドと重ならない。コンテンツ列（max-900）の左上に整列。
 * ホーム（/）では何も出さない。ヘッダーのロゴ・学習ボタン再押下と同じ宛先。
 */
export function HomeBackButton() {
  const pathname = usePathname();
  const t = useT();
  if (pathname === "/") return null;
  return (
    <div className="pointer-events-none sticky top-0 z-20 mx-auto flex max-w-[900px] px-4 pt-3 pb-1 sm:px-[26px]">
      <Link
        href="/"
        aria-label={t("nav.backHome")}
        title={t("nav.backHome")}
        className="cff-control bg-surface shadow-toast text-text-2 hover:border-accent hover:text-accent pointer-events-auto flex size-9 items-center justify-center"
      >
        <Home width={16} height={16} aria-hidden />
      </Link>
    </div>
  );
}
