"use client";

import { parseHex, toHex, rolesByOrder, type SemanticRole } from "@/core/color";
import { useColorStore, type Color } from "@/store/useColorStore";

export { useCopy } from "@/lib/useCopy";

/** 現在フォーカス中の単色（selectedId、無ければ先頭）。 */
export function useSelectedColor(): Color | null {
  return useColorStore(
    (s) => s.palette.find((c) => c.id === s.selectedId) ?? s.palette[0] ?? null,
  );
}

/** ペアの前景/背景色（fgId/bgId、無ければ先頭/末尾にフォールバック）。 */
export function usePairColors(): { fg: Color; bg: Color } | null {
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  if (palette.length < 2) return null;
  const fg = palette.find((c) => c.id === fgId) ?? palette[0];
  const bg = palette.find((c) => c.id === bgId) ?? palette[palette.length - 1];
  return { fg, bg };
}

/**
 * パレットの並び順＋ FG/BG/アクセント指定に基づくロール別の色（HEX）。
 * 割当できないロールは null。UI モック等、順番ベースの色設定で使う。
 */
export function useRoleColors(): Record<SemanticRole, string | null> {
  const palette = useColorStore((s) => s.palette);
  const fgId = useColorStore((s) => s.fgId);
  const bgId = useColorStore((s) => s.bgId);
  const accentId = useColorStore((s) => s.accentId);

  const indexOf = (id: string | null) =>
    id ? palette.findIndex((c) => c.id === id) : -1;
  const accentIndex = indexOf(accentId);
  const roles = rolesByOrder(palette.length, {
    fgIndex: indexOf(fgId),
    bgIndex: indexOf(bgId),
    accentIndex: accentIndex >= 0 ? accentIndex : undefined,
  });

  const out: Record<SemanticRole, string | null> = {
    background: null,
    text: null,
    primary: null,
    accent: null,
    neutral: null,
  };
  for (const { role, index } of roles) {
    out[role] = toHex(
      parseHex(palette[index].hex) ?? { r: 0, g: 0, b: 0 },
    ).toUpperCase();
  }
  return out;
}
