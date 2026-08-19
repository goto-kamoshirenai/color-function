import { parseHex, rgbToLab } from "./convert";
import { deltaE2000 } from "./difference";
import type { LAB, RGB } from "./types";

export type ColorNameEntry = { name: string; hex: string };

export type NearestName = { entry: ColorNameEntry; deltaE: number };

/**
 * 辞書の Lab 値キャッシュ（辞書配列の参照をキーにした WeakMap）。
 * 辞書は数百〜数千件あり、毎回 parseHex+rgbToLab を回すと最寄り色名の探索が
 * 描画ごとに辞書全件の変換を伴う。辞書の実体は読み込み後に不変なので、
 * 参照ごとに一度だけ変換して使い回す（関数の純粋性は保たれる）。
 */
const labCache = new WeakMap<
  ColorNameEntry[],
  { entry: ColorNameEntry; lab: LAB }[]
>();

function preparedDict(dict: ColorNameEntry[]) {
  const cached = labCache.get(dict);
  if (cached) return cached;
  const prepared = dict.flatMap((entry) => {
    const rgb = parseHex(entry.hex);
    return rgb ? [{ entry, lab: rgbToLab(rgb) }] : [];
  });
  labCache.set(dict, prepared);
  return prepared;
}

/**
 * 最寄り色名（docs/04 I）。CIEDE2000 が最小の辞書エントリを返す。
 * 辞書は静的アセット（docs/06 §2）から渡す。空辞書や不正HEXのみなら null。
 */
export function nearestName(
  rgb: RGB,
  dict: ColorNameEntry[],
): NearestName | null {
  const target = rgbToLab(rgb);
  let best: NearestName | null = null;
  for (const { entry, lab } of preparedDict(dict)) {
    const d = deltaE2000(target, lab);
    if (best === null || d < best.deltaE) best = { entry, deltaE: d };
  }
  return best;
}
