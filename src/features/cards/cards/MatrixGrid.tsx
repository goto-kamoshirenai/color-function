"use client";

import { type ReactNode } from "react";
import { useFormatColor } from "@/lib/colorFormat";
import { useT } from "@/lib/i18n/locale";
import type { Color } from "@/store/useColorStore";

type MatrixCell = {
  content: ReactNode;
  className: string;
  /** 値の意味（合否・近さ等）を文字で伝える読み上げ専用ラベル。 */
  srLabel?: string;
};

/**
 * 総当たりマトリクス共通グリッド（コントラスト比 / 色差 ΔE で共有）。
 * 先頭列＋上端ヘッダーはスウォッチ色で塗ったセル（hex はホバーの title と
 * 読み上げ用テキストの両方で伝える）、対角は「—」、それ以外は cell(ri, ci)。
 *
 * セマンティクスは実表（table/th[scope]/td）で持つ。色塗りヘッダーだけでは
 * 行列の対応が読み上げに乗らないため、見た目（1px 罫線のグリッド）は
 * border-spacing で再現し、表としての構造を優先する。
 */
export function MatrixGrid({
  palette,
  leadWidth,
  cellMinWidth,
  fillWidth = false,
  srText,
  diagonalClassName,
  cell,
}: {
  palette: Color[];
  /** 先頭列（角・行スウォッチ）の幅 px */
  leadWidth: number;
  /** 値セル列の最小幅 px */
  cellMinWidth: number;
  /** 親幅いっぱいに伸ばす（コントラスト比マトリクス用） */
  fillWidth?: boolean;
  srText: string;
  diagonalClassName: string;
  cell: (ri: number, ci: number) => MatrixCell;
}) {
  const fmt = useFormatColor();
  const t = useT();
  const label = (i: number, hex: string) =>
    t("card.matrix.color", { n: i + 1, hex: fmt(hex) });

  return (
    <div className="cff-scroll overflow-x-auto">
      <table
        className="bg-border border-border border"
        style={{
          borderCollapse: "separate",
          borderSpacing: 1,
          tableLayout: "fixed",
          width: fillWidth ? "100%" : undefined,
          // 1fr 相当に伸ばしつつ、各列は cellMinWidth を下回らせない
          minWidth: fillWidth
            ? leadWidth + palette.length * cellMinWidth
            : undefined,
        }}
      >
        <caption className="sr-only">{srText}</caption>
        <thead>
          <tr>
            {/* 角セル（行見出し列の上）は空 */}
            <td className="bg-surface" style={{ width: leadWidth }} />
            {palette.map((c, ci) => (
              <th
                key={c.id}
                scope="col"
                className="bg-surface py-4"
                style={{ backgroundColor: c.hex, width: cellMinWidth }}
                title={fmt(c.hex)}
              >
                <span className="sr-only">{label(ci, c.hex)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {palette.map((row, ri) => (
            <tr key={row.id}>
              <th
                scope="row"
                className="bg-surface py-2"
                style={{ backgroundColor: row.hex }}
                title={fmt(row.hex)}
              >
                <span className="sr-only">{label(ri, row.hex)}</span>
              </th>
              {palette.map((col, ci) => {
                if (ri === ci)
                  return (
                    <td key={col.id} className={diagonalClassName}>
                      —
                    </td>
                  );
                const { content, className, srLabel } = cell(ri, ci);
                return (
                  <td key={col.id} className={className}>
                    {content}
                    {srLabel ? (
                      <span className="sr-only"> {srLabel}</span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
