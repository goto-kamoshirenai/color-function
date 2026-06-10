import { parseHex, rgbToLab } from "./convert";
import { deltaE2000 } from "./difference";
import type { RGB } from "./types";

export type ColorNameEntry = { name: string; hex: string };

export type NearestName = { entry: ColorNameEntry; deltaE: number };

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
  for (const entry of dict) {
    const ergb = parseHex(entry.hex);
    if (!ergb) continue;
    const d = deltaE2000(target, rgbToLab(ergb));
    if (best === null || d < best.deltaE) best = { entry, deltaE: d };
  }
  return best;
}
