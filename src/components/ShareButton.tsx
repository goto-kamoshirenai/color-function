"use client";

import { ArrowUpRight } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** 現在の配色（URLハッシュに同期済み）を共有リンクとしてコピー（v2: ↗ SHARE）。 */
export function ShareButton() {
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t("share.copied"));
    } catch {
      showToast(t("share.failed"));
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={t("share.copy")}
      className="cff-control inline-flex h-9 items-center gap-[7px] px-2.5 font-mono text-[12px] tracking-[0.06em] whitespace-nowrap sm:px-[13px]"
    >
      <ArrowUpRight width={14} height={14} strokeWidth={2} aria-hidden />
      {/* ラベルは小画面ではアイコンのみ */}
      <span className="hidden sm:inline">SHARE</span>
    </button>
  );
}
