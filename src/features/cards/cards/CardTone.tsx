"use client";

import { parseHex, toHex, generateTones, contrastRatio } from "@/core/color";
import { useColorStore } from "@/store/useColorStore";
import { useSelectedColor } from "../hooks";

function chipTextColor(hex: string): string {
  const rgb = parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  return contrastRatio(rgb, white) >= contrastRatio(rgb, black)
    ? "#fff"
    : "#000";
}

/** トーン展開（明度5段階, docs/10 §4）。クリックでパレットに追加。 */
export function CardTone() {
  const color = useSelectedColor();
  const apply = useColorStore((s) => s.apply);
  const showToast = useColorStore((s) => s.showToast);
  if (!color) return <p className="text-text-3 text-xs">色がありません</p>;

  const base = parseHex(color.hex) ?? { r: 0, g: 0, b: 0 };
  const tones = generateTones(base).map((rgb) => toHex(rgb).toUpperCase());

  const add = (hex: string) => {
    apply({ kind: "add", hex });
    showToast("追加: " + hex);
  };

  return (
    <div>
      <div className="flex gap-1">
        {tones.map((hex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => add(hex)}
            aria-label={`トーン ${hex} をパレットに追加`}
            className="flex h-12 flex-1 items-end justify-center rounded p-1 font-mono text-[9px]"
            style={{ backgroundColor: hex, color: chipTextColor(hex) }}
          >
            {hex}
          </button>
        ))}
      </div>
      <p className="text-text-3 mt-2 text-[10px]">
        基準色の色相・彩度を保ち、明度を5段階で展開 · クリックでパレットに追加
      </p>
    </div>
  );
}
