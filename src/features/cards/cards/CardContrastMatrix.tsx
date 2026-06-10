"use client";

import { parseHex, contrastRatio } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";

/** パレット全色の総当たりコントラスト比（docs/10 §4）。太字=AA(4.5)合格。 */
export function CardContrastMatrix() {
  const palette = useColorStore((s) => s.palette);
  if (palette.length < 2)
    return (
      <p className="text-text-3 text-xs">マトリクスには2色以上が必要です</p>
    );

  const rgbs = palette.map((c) => parseHex(c.hex) ?? { r: 0, g: 0, b: 0 });

  return (
    <div className="cff-scroll overflow-x-auto">
      <table className="w-full border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th aria-label="行=前景 / 列=背景" />
            {palette.map((c) => (
              <th key={c.id} className="p-1">
                <span
                  className="border-border mx-auto block size-4 rounded-sm border"
                  style={{ backgroundColor: c.hex }}
                  title={c.hex}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {palette.map((row, ri) => (
            <tr key={row.id}>
              <th className="p-1">
                <span
                  className="border-border block size-4 rounded-sm border"
                  style={{ backgroundColor: row.hex }}
                  title={row.hex}
                />
              </th>
              {palette.map((col, ci) => {
                if (ri === ci)
                  return (
                    <td
                      key={col.id}
                      className="bg-surface-2 text-text-3 p-1 text-center font-mono text-[10px]"
                    >
                      —
                    </td>
                  );
                const ratio = contrastRatio(rgbs[ri], rgbs[ci]);
                const pass = ratio >= 4.5;
                return (
                  <td
                    key={col.id}
                    className={
                      "p-1 text-center font-mono text-[10px] " +
                      (pass
                        ? "text-text font-bold shadow-[inset_0_0_0_1.5px_var(--text)]"
                        : "text-text-3")
                    }
                  >
                    {ratio.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-text-3 mt-2 text-[10px]">太字 = AA 合格 (≥4.5)</p>
    </div>
  );
}
