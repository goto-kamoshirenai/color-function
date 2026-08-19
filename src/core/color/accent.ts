import { contrastRatio } from "./contrast";
import { bestByLightness, nearestByLightness } from "./search";
import type { RGB } from "./types";

/**
 * アクセント色の a11y 補正（docs/10 §1.1）。
 * accent を bg の上で最低 minRatio に届くよう OKLCH の明度のみ調整して返す。
 * 既に満たすならそのまま。明るく／暗くの両方向を探索して明度差の小さい方を
 * 採り（中間輝度の背景では最適方向が自明でない）、満たせなければ最良値を返す。
 * 装飾用途（可読性に無関係）では呼び出し側が補正せず原色を使う。
 */
export function ensureReadableAccent(
  accent: RGB,
  bg: RGB,
  minRatio: number,
): RGB {
  if (contrastRatio(accent, bg) >= minRatio) return accent;

  const found = nearestByLightness(
    accent,
    (c) => contrastRatio(c, bg) >= minRatio,
    { step: 0.02, refine: 12 },
  );
  if (found) return found.rgb;

  return bestByLightness(accent, (c) => contrastRatio(c, bg), { step: 0.02 })
    .rgb;
}
