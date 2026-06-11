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
      className="cff-control inline-flex items-center gap-[7px] px-[13px] py-2 font-mono text-[12px] tracking-[0.06em] whitespace-nowrap"
    >
      <ArrowUpRight width={14} height={14} strokeWidth={2} aria-hidden />
      SHARE
    </button>
  );
}
