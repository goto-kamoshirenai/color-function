"use client";

import { Sparks } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { buildAiReport } from "@/lib/aiReport";
import { useT } from "@/lib/i18n/locale";

/**
 * いまの診断結果を Markdown でコピーする（AI に渡す）。
 * 共有リンクの隣に置く — 共有は「人へ」、こちらは「エディタの AI へ」。
 */
export function AiExportButton() {
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const showToast = useColorStore((s) => s.showToast);
  const t = useT();

  if (palette.length === 0) return null;

  const copy = async () => {
    // ペアの解決規則は usePairColors と同じ（指定が無ければ先頭と末尾）
    const pair = palette.length >= 2;
    const report = buildAiReport({
      hexes: palette.map((c) => c.hex),
      fgHex: pair
        ? (palette.find((c) => c.id === fgId)?.hex ?? palette[0].hex)
        : null,
      bgHex: pair
        ? (palette.find((c) => c.id === bgId)?.hex ??
          palette[palette.length - 1].hex)
        : null,
      siteUrl: window.location.origin,
      t,
    });
    try {
      await navigator.clipboard?.writeText(report);
      showToast(t("ai.copied"));
    } catch {
      // クリップボード不可（権限拒否・非セキュアコンテキスト）は失敗を伝える
      showToast(t("share.failed"));
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("ai.copy")}
      title={t("ai.copyTitle")}
      className="cff-control text-text-2 hover:text-text flex items-center gap-1.5 px-3 py-[7px] font-mono text-[12px] tracking-[0.04em] whitespace-nowrap"
    >
      <Sparks width={13} height={13} aria-hidden />
      {t("ai.label")}
    </button>
  );
}
