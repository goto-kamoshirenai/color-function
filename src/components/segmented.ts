/**
 * v2 セグメント（小型）: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。
 * ColorPicker の形式切替と設定メニューで共用（ModeToggle は大型の独自版）。
 */
export const segCompactClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-2.5 py-1 " +
  "font-mono text-[12px] font-medium text-text-2 last:border-r-0 " +
  "data-[selected]:border-t-accent data-[selected]:bg-(--text) data-[selected]:font-semibold data-[selected]:text-(--bg)";

/**
 * react-aria の選択キー（string | number）を、既知の選択肢に絞る。
 * `as`（型アサーション）で押し込むと、選択肢の変更に型が追随しないため、
 * 実際の候補配列を根拠に判定する。
 */
export function pickKey<T extends string>(
  keys: Iterable<string | number>,
  options: readonly T[],
): T | undefined {
  const first = [...keys][0];
  return options.find((o) => o === first);
}
