"use client";

import { Fragment, type ReactNode } from "react";
import { useFormatColor } from "@/lib/colorFormat";
import type { Color } from "@/store/useColorStore";

type MatrixCell = { content: ReactNode; className: string };

/**
 * 総当たりマトリクス共通グリッド（コントラスト比 / 色差 ΔE で共有）。
 * 先頭列＋上端ヘッダーはスウォッチ色で塗ったセル（hex は title でホバー表示）、
 * 対角は「—」、それ以外は cell(ri, ci) が返す内容・装飾で描く。
 * セル幅は gridTemplateColumns で決めるため per-cell の min-w は持たせない。
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
  return (
    <div className="cff-scroll overflow-x-auto">
      <p className="sr-only">{srText}</p>
      <div
        className={
          "bg-border border-border inline-grid gap-px border" +
          (fillWidth ? " min-w-full" : "")
        }
        style={{
          gridTemplateColumns: `${leadWidth}px repeat(${palette.length}, minmax(${cellMinWidth}px, 1fr))`,
        }}
      >
        <div className="bg-surface" style={{ minWidth: leadWidth }} />
        {palette.map((c) => (
          <div
            key={c.id}
            className="bg-surface py-4"
            style={{ backgroundColor: c.hex }}
            title={fmt(c.hex)}
          />
        ))}
        {palette.map((row, ri) => (
          <Fragment key={row.id}>
            <div
              className="bg-surface py-2"
              style={{ backgroundColor: row.hex }}
              title={fmt(row.hex)}
            />
            {palette.map((col, ci) => {
              if (ri === ci)
                return (
                  <div key={col.id} className={diagonalClassName}>
                    —
                  </div>
                );
              const { content, className } = cell(ri, ci);
              return (
                <div key={col.id} className={className}>
                  {content}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
