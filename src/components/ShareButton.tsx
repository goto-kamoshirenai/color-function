"use client";

import { Link as LinkIcon } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { encodePalette } from "@/lib/urlState";
import { useT } from "@/lib/i18n/locale";

/**
 * 共有リンクのコピー（共有=URL ハッシュ, docs/02 §2.3 / docs/10 §3）。
 *
 * 配色は `#p=` に自動反映されるが、それが共有手段だと気づけないため明示の
 * 導線を置く。URL は location.href ではなく現在のパレットから組み立てる
 * （ハッシュ反映はデバウンスされるため、直後のコピーで古い URL を掴まない）。
 */
export function ShareButton() {
  const palette = useColorStore((s) => s.palette);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  if (palette.length === 0) return null;

  const shareUrl = () => {
    const { origin, pathname } = window.location;
    return `${origin}${pathname}${encodePalette(palette.map((c) => c.hex))}`;
  };

  const copy = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard?.writeText(url);
      showToast(t("share.copied"));
    } catch {
      // クリップボード不可（権限拒否・非セキュアコンテキスト）は失敗を伝える
      showToast(t("share.failed"));
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("share.copy")}
      title={t("share.copy")}
      className="cff-control text-text-2 hover:text-text flex items-center gap-1.5 px-3 py-[7px] font-mono text-[12px] tracking-[0.04em] whitespace-nowrap"
    >
      <LinkIcon width={13} height={13} aria-hidden />
      {t("share.label")}
    </button>
  );
}
