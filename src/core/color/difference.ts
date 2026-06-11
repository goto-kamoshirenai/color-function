import type { LAB } from "./types";

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const POW25_7 = 25 ** 7;

function hueAngle(b: number, ap: number): number {
  if (b === 0 && ap === 0) return 0;
  const h = deg(Math.atan2(b, ap));
  return h < 0 ? h + 360 : h;
}

/**
 * CIEDE2000 色差（ΔE00, kL=kC=kH=1）。docs/07 §7.3 の定式を厳密実装。
 * Sharma et al. 2005 の標準34組と4桁一致（__fixtures__/ciede2000-sharma）。
 */
export function deltaE2000(c1: LAB, c2: LAB): number {
  const { L: L1, a: a1, b: b1 } = c1;
  const { L: L2, a: a2, b: b2 } = c2;

  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const cBar = (C1 + C2) / 2;
  const cBar7 = cBar ** 7;
  const G = 0.5 * (1 - Math.sqrt(cBar7 / (cBar7 + POW25_7)));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h1p = hueAngle(b1, a1p);
  const h2p = hueAngle(b2, a2p);

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp = 0;
  if (C1p * C2p !== 0) {
    const diff = h2p - h1p;
    if (Math.abs(diff) <= 180) dhp = diff;
    else if (diff > 180) dhp = diff - 360;
    else dhp = diff + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2);

  const lBarp = (L1 + L2) / 2;
  const cBarp = (C1p + C2p) / 2;

  let hBarp: number;
  if (C1p * C2p === 0) {
    hBarp = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    hBarp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    hBarp = (h1p + h2p + 360) / 2;
  } else {
    hBarp = (h1p + h2p - 360) / 2;
  }

  const T =
    1 -
    0.17 * Math.cos(rad(hBarp - 30)) +
    0.24 * Math.cos(rad(2 * hBarp)) +
    0.32 * Math.cos(rad(3 * hBarp + 6)) -
    0.2 * Math.cos(rad(4 * hBarp - 63));

  const dTheta = 30 * Math.exp(-(((hBarp - 275) / 25) ** 2));
  const cBarp7 = cBarp ** 7;
  const RC = 2 * Math.sqrt(cBarp7 / (cBarp7 + POW25_7));
  const SL =
    1 + (0.015 * (lBarp - 50) ** 2) / Math.sqrt(20 + (lBarp - 50) ** 2);
  const SC = 1 + 0.045 * cBarp;
  const SH = 1 + 0.015 * cBarp * T;
  const RT = -Math.sin(rad(2 * dTheta)) * RC;

  return Math.sqrt(
    (dLp / SL) ** 2 +
      (dCp / SC) ** 2 +
      (dHp / SH) ** 2 +
      RT * (dCp / SC) * (dHp / SH),
  );
}

/** ΔE76（Lab ユークリッド距離）。参考・教育用（docs/07 §7）。 */
export function deltaE76(c1: LAB, c2: LAB): number {
  return Math.hypot(c1.L - c2.L, c1.a - c2.a, c1.b - c2.b);
}

/** ΔE94（graphic arts 定数 kL=1, K1=0.045, K2=0.015）。参考・教育用。 */
export function deltaE94(c1: LAB, c2: LAB): number {
  const dL = c1.L - c2.L;
  const C1 = Math.hypot(c1.a, c1.b);
  const C2 = Math.hypot(c2.a, c2.b);
  const dC = C1 - C2;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  const dH2 = Math.max(0, da * da + db * db - dC * dC);
  const sC = 1 + 0.045 * C1;
  const sH = 1 + 0.015 * C1;
  return Math.sqrt(dL * dL + (dC / sC) ** 2 + dH2 / (sH * sH));
}

/** OKLab ユークリッド距離（×100 スケールで ΔE と桁を揃える）。 */
export function okLabDistance(
  a: { l: number; a: number; b: number },
  b: { l: number; a: number; b: number },
): number {
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b) * 100;
}

export type DeltaComponents = {
  /** 明度差 ΔL*（CIELAB） */
  dL: number;
  /** 彩度差 ΔC*（CIELAB クロマ） */
  dC: number;
  /** 色相角差 Δh（度・-180〜180） */
  dHdeg: number;
};

/** 成分ごとの差分内訳（CIELAB / LCH ベース）。 */
export function deltaComponents(c1: LAB, c2: LAB): DeltaComponents {
  const C1 = Math.hypot(c1.a, c1.b);
  const C2 = Math.hypot(c2.a, c2.b);
  const h1 = (Math.atan2(c1.b, c1.a) * 180) / Math.PI;
  const h2 = (Math.atan2(c2.b, c2.a) * 180) / Math.PI;
  let dH = h2 - h1;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;
  return { dL: c2.L - c1.L, dC: C2 - C1, dHdeg: C1 < 1 || C2 < 1 ? 0 : dH };
}
