"use client";

import { parseHex, toHex, generateScheme, contrastRatio } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";
import { useHarmonyRules } from "@/lib/useHarmonyRules";

function chipTextColor(hex: string): string {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  return contrastRatio(rgb, white) >= contrastRatio(rgb, black)
    ? "#fff"
    : "#000";
}

/** 調和スキーム生成（OKLCH色相回転, docs/06 §4.1）。クリックでパレットに追加。 */
export function CardHarmony() {
  const color = useSelectedColor();
  const rules = useHarmonyRules();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;
  if (rules.length === 0)
    return <p className="text-text-3 text-xs">調和ルールを読み込み中…</p>;

  const base = parseHex(color.hex) ?? { r: 0, g: 0, b: 0 };

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast("追加: " + hex.toUpperCase());
  };

  return (
    <div className="space-y-3">
      <p className="text-text-3 text-[10px]">
        基準色 <span className="font-mono">{color.hex}</span> の色相関係から生成
        · クリックでパレットに追加
      </p>
      {rules.map((rule) => {
        const scheme = generateScheme(base, rule.hueOffsets).map((rgb) =>
          toHex(rgb).toUpperCase(),
        );
        return (
          <div key={rule.id}>
            <p className="text-text-2 mb-1 text-xs">
              {rule.label}
              {rule.sub ? (
                <span className="text-text-3 ml-1 font-mono text-[9px]">
                  {rule.sub}
                </span>
              ) : null}
            </p>
            <div className="flex gap-1">
              {scheme.map((hex, i) => (
                <button
                  key={`${rule.id}-${i}`}
                  type="button"
                  onClick={() => add(hex)}
                  aria-label={`${rule.label}の色 ${hex} をパレットに追加`}
                  className="flex h-10 flex-1 items-end justify-center rounded p-1 font-mono text-[9px]"
                  style={{ backgroundColor: hex, color: chipTextColor(hex) }}
                >
                  {hex}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
