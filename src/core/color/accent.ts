import { contrastRatio, relativeLuminance } from "./contrast";
import { rgbToOklch, oklchToRgb } from "./convert";
import type { RGB } from "./types";

/**
 * アクセント色の a11y 補正（docs/10 §1.1）。
 * accent を bg の上で最低 minRatio に届くよう OKLCH の明度のみ調整して返す。
 * 既に満たすならそのまま。背景の明暗に応じて暗く/明るく寄せ、満たせなければ最良値を返す。
 * 装飾用途（可読性に無関係）では呼び出し側が補正せず原色を使う。
 */
export function ensureReadableAccent(
  accent: RGB,
  bg: RGB,
  minRatio: number,
): RGB {
  if (contrastRatio(accent, bg) >= minRatio) return accent;

  const o = rgbToOklch(accent);
  // 背景が明るいなら暗く、暗いなら明るく寄せる。
  const step = relativeLuminance(bg) > 0.5 ? -0.02 : 0.02;

  let best = accent;
  let bestRatio = contrastRatio(accent, bg);

  for (let i = 1; i <= 60; i++) {
    const l = Math.max(0, Math.min(1, o.l + step * i));
    const candidate = oklchToRgb({ l, c: o.c, h: o.h });
    const ratio = contrastRatio(candidate, bg);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
    if (ratio >= minRatio) return candidate;
    if (l === 0 || l === 1) break;
  }
  return best;
}
