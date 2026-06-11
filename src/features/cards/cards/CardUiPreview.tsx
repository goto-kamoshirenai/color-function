"use client";

import { parseHex, toHex, assignRoles } from "@/core/color";
import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** UI モックプレビューカード（役割を自動割当てて簡易 UI に適用）。 */
export function CardUiPreview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const t = useT();

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });
  const roles = assignRoles(rgbs);
  const hexOf = (role: string, fallback: string) => {
    const found = roles.find((r) => r.role === role);
    return found ? toHex(rgbs[found.index]).toUpperCase() : fallback;
  };
  const bg = hexOf("background", "#ffffff");
  const text = hexOf("text", "#111111");
  const primary = hexOf("primary", text);
  const accent = hexOf("accent", primary);

  return (
    <CardFrame
      number={number}
      title={t("card.uipreview.title")}
      enLabel="UI Preview"
      helpKey="uipreview"
    >
      {palette.length < 2 ? (
        <p className="text-text-3 font-mono text-xs">{t("card.needMatrix")}</p>
      ) : (
        <>
          {/* ユーザー指定色の標本領域（コントラストは測定対象） */}
          <div
            data-specimen
            className="border-border-strong rounded-control overflow-hidden border"
            style={{ backgroundColor: bg, color: text }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: `1px solid ${text}22` }}
            >
              <span className="text-[13px] font-bold">Sample App</span>
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
            </div>
            <div className="px-4 py-3.5">
              <div className="mb-1 text-[15px] font-bold">見出しテキスト</div>
              <p className="mb-3 text-[12px] leading-[1.6] opacity-90">
                本文テキストのサンプルです。割当:
                背景・テキスト・プライマリ・アクセント。
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-[3px] px-3 py-1.5 text-[12px] font-semibold"
                  style={{ backgroundColor: primary, color: bg }}
                >
                  Primary
                </span>
                <span
                  className="rounded-[3px] border px-3 py-1.5 text-[12px] font-semibold"
                  style={{ borderColor: accent, color: accent }}
                >
                  Accent
                </span>
              </div>
            </div>
          </div>
          <p className="text-text-3 text-meta mt-2.5 font-mono tracking-[0.04em]">
            {t("card.uipreview.note")}
          </p>
        </>
      )}
    </CardFrame>
  );
}
