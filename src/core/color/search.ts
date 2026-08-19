import { oklchToRgb, rgbToOklch } from "./convert";
import type { RGB } from "./types";

/**
 * 「OKLCH の明度のみを動かして条件を満たす最寄り色を探す」共有ルーチン。
 * ナッジ（コントラスト）・色覚セーフ・アクセント補正で同じ探索を使う。
 *
 * 固定ステップのグリッド探索だけでは「先に届いた方＝最寄り」の保証が弱い
 * （刻み幅ぶんの誤差が残り、両方向の比較も刻みの粒度に縛られる）。そこで
 * 粗いステップで最初に成立する点を見つけ、直前の不成立点との間を二分して
 * 境界に寄せる。両方向（明るく／暗く）を同じ手順で求め、明度差の小さい方を
 * 採る。二分は「不成立点と成立点の間に境界がある」ことだけを使うので、
 * 条件が明度に対して単調でなくても（色覚セーフ等）正しく動く。
 */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 明度だけを差し替えた色を返す関数（色相・彩度は保つ）。 */
function lightnessMover(base: RGB): { l0: number; at: (l: number) => RGB } {
  const o = rgbToOklch(base);
  return {
    l0: o.l,
    at: (l: number) => oklchToRgb({ l: clamp01(l), c: o.c, h: o.h }),
  };
}

export type LightnessSearch = {
  /** 条件を満たす最寄り色 */
  rgb: RGB;
  /** 元の色からの OKLCH 明度差（絶対値） */
  delta: number;
};

/**
 * ok(色) を満たす最寄り色（明度差最小）。どちらの方向でも満たせなければ null。
 * step は粗い探索の刻み、refine は二分の回数。
 */
export function nearestByLightness(
  base: RGB,
  ok: (rgb: RGB) => boolean,
  { step = 0.01, refine = 14 }: { step?: number; refine?: number } = {},
): LightnessSearch | null {
  const { l0, at } = lightnessMover(base);
  let best: LightnessSearch | null = null;

  for (const dir of [-1, 1] as const) {
    const limit = dir < 0 ? l0 : 1 - l0;
    const cand = (delta: number) => at(l0 + dir * delta);
    let lo = 0; // 不成立が判明している明度差
    let hi = -1; // 成立が判明している明度差（-1 = 未発見）

    for (let d = step; hi < 0; d += step) {
      const delta = Math.min(d, limit);
      if (ok(cand(delta))) hi = delta;
      else lo = delta;
      if (delta >= limit) break;
    }
    if (hi < 0) continue;

    // 境界（= より元の色に近い明度）へ寄せる
    for (let i = 0; i < refine; i++) {
      const mid: number = (lo + hi) / 2;
      if (ok(cand(mid))) hi = mid;
      else lo = mid;
    }
    if (!best || hi < best.delta) best = { rgb: cand(hi), delta: hi };
  }
  return best;
}

/**
 * 明度を動かして score(色) が最大になる候補（条件に届かないときの最良値）。
 * 元の色自身も候補に含む。
 */
export function bestByLightness(
  base: RGB,
  score: (rgb: RGB) => number,
  { step = 0.01 }: { step?: number } = {},
): { rgb: RGB; value: number } {
  const { at } = lightnessMover(base);
  let best = { rgb: base, value: score(base) };
  for (let i = 0; i * step <= 1; i++) {
    const cand = at(i * step);
    const value = score(cand);
    if (value > best.value) best = { rgb: cand, value };
  }
  return best;
}
