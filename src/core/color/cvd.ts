import { srgbToLinear, linearToSrgb } from "./convert";
import type { CvdType, RGB } from "./types";

type Matrix3 = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

/**
 * Machado et al. 2009 の重度 1.0 行列（線形RGB で適用, docs/06 §5）。
 * 実運用の強度段階別テーブルは S4 で cvd アセットから供給する。ここは既定値。
 */
const MACHADO_2009_SEVERITY_1: Record<CvdType, Matrix3> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 3×3 行列を線形RGB ベクトルに適用。 */
function applyMatrixLinear(rgb: RGB, m: Matrix3): RGB {
  const lr = srgbToLinear(rgb.r / 255);
  const lg = srgbToLinear(rgb.g / 255);
  const lb = srgbToLinear(rgb.b / 255);

  const or = m[0][0] * lr + m[0][1] * lg + m[0][2] * lb;
  const og = m[1][0] * lr + m[1][1] * lg + m[1][2] * lb;
  const ob = m[2][0] * lr + m[2][1] * lg + m[2][2] * lb;

  return {
    r: linearToSrgb(clamp01(or)) * 255,
    g: linearToSrgb(clamp01(og)) * 255,
    b: linearToSrgb(clamp01(ob)) * 255,
  };
}

/** 重度 s に応じて単位行列と重度1.0行列を線形補間。 */
function severityMatrix(type: CvdType, severity: number): Matrix3 {
  const s = Math.max(0, Math.min(1, severity));
  const full = MACHADO_2009_SEVERITY_1[type];
  const identity: Matrix3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const mix = (a: number, b: number) => a * (1 - s) + b * s;
  return [
    [
      mix(identity[0][0], full[0][0]),
      mix(identity[0][1], full[0][1]),
      mix(identity[0][2], full[0][2]),
    ],
    [
      mix(identity[1][0], full[1][0]),
      mix(identity[1][1], full[1][1]),
      mix(identity[1][2], full[1][2]),
    ],
    [
      mix(identity[2][0], full[2][0]),
      mix(identity[2][1], full[2][1]),
      mix(identity[2][2], full[2][2]),
    ],
  ];
}

/**
 * 色覚シミュレーション（Machado 2009・線形RGB, docs/06 §5）。
 * severity 0 = 原色、1 = 二色覚相当。
 */
export function simulateCvd(rgb: RGB, type: CvdType, severity = 1): RGB {
  return applyMatrixLinear(rgb, severityMatrix(type, severity));
}
