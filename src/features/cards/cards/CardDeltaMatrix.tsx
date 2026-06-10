"use client";

import { parseHex, rgbToLab, deltaE2000 } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";

/** パレット全色ペアの CIEDE2000 色差。小さい値=紛らわしいペア（強調表示）。 */
export function CardDeltaMatrix() {
  const palette = useColorStore((s) => s.palette);
  if (palette.length < 2)
    return (
      <p className="text-text-3 text-xs">マトリクスには2色以上が必要です</p>
    );

  const labs = palette.map((c) =>
    rgbToLab(parseHex(c.hex) ?? { r: 0, g: 0, b: 0 }),
  );

  return (
    <div className="cff-scroll overflow-x-auto">
      <table className="w-full border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th aria-label="色差マトリクス" />
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
                const de = deltaE2000(labs[ri], labs[ci]);
                const close = de < 10; // CIEDE2000: 10未満は紛らわしい近さ
                return (
                  <td
                    key={col.id}
                    className={
                      "p-1 text-center font-mono text-[10px] " +
                      (close ? "text-text font-bold" : "text-text-3")
                    }
                  >
                    {Math.round(de)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-text-3 mt-2 text-[10px]">
        太字 = 紛らわしい近さ (ΔE &lt; 10)
      </p>
    </div>
  );
}
