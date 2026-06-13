"use client";

import { CardFrame } from "@/components/Card";
import { useColorStore } from "@/store/useColorStore";
import { useRoleColors } from "../hooks";
import { useT } from "@/lib/i18n/locale";
import type { CardProps } from "../types";

/** UI モックプレビューカード（パレットの並び順だけで色を割り当てる）。 */
export function CardUiPreview({ number }: CardProps) {
  const palette = useColorStore((s) => s.palette);
  const roles = useRoleColors();
  const t = useT();

  const bg = roles.background ?? "#ffffff";
  const text = roles.text ?? "#111111";
  const primary = roles.primary ?? text;
  const accent = roles.accent ?? primary;

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
