/**
 * v2 セグメント（小型）: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。
 * ColorPicker の形式切替と設定メニューで共用（ModeToggle は大型の独自版）。
 */
export const segCompactClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-2.5 py-1 " +
  "font-mono text-[12px] font-medium text-text-2 last:border-r-0 " +
  "data-[selected]:border-t-accent data-[selected]:bg-(--text) data-[selected]:font-semibold data-[selected]:text-(--bg)";
