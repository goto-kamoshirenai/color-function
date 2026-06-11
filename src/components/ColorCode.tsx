"use client";

import { formatColor, formatColorCss } from "@/core/color/format";
import { useColorFormat } from "@/lib/colorFormat";
import { useCopy } from "@/lib/useCopy";
import { useT } from "@/lib/i18n/locale";

/**
 * カラーコードの共通表示（クリックでコピー）。
 * 表示は現在の表示形式（ヘッダーで選択）、コピーは CSS で使える関数表記
 * （hex はそのまま、rgb(…) / hsl(…) / hsv(…)）。コピー内容はトーストで通知。
 * 文字サイズ・色は className で上書きする（既定: モノ・text-2）。
 */
export function ColorCode({
  hex,
  className = "",
}: {
  hex: string;
  className?: string;
}) {
  const format = useColorFormat();
  const copy = useCopy();
  const t = useT();
  const text = formatColor(hex, format);

  return (
    <button
      type="button"
      onClick={() => copy(formatColorCss(hex, format))}
      title={t("colorcode.copy")}
      aria-label={t("colorcode.copyAria", { code: text })}
      className={
        "text-text-2 hover:text-text decoration-border-strong bg-transparent p-0 font-mono underline-offset-2 hover:underline " +
        className
      }
    >
      {text}
    </button>
  );
}
