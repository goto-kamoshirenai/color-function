import type { RGB } from "./types";

/**
 * APCA コントラスト（APCA-W3 0.0.98G-4g 定数・WCAG 3 ドラフト系）。
 * 戻り値は Lc（Lightness contrast）。正=暗い文字/明るい背景、負=その逆。
 * 目安: |Lc| 90≒AAA 相当の本文、75=本文下限、60=大きめ文字、45=太字大文字、30=UI最低限。
 */
const SA = {
  trc: 2.4,
  rCo: 0.2126729,
  gCo: 0.7151522,
  bCo: 0.072175,
  normBg: 0.56,
  normTxt: 0.57,
  revTxt: 0.62,
  revBg: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scale: 1.14,
  loOffset: 0.027,
  loClip: 0.1,
  deltaYmin: 0.0005,
} as const;

function screenY({ r, g, b }: RGB): number {
  return (
    SA.rCo * (r / 255) ** SA.trc +
    SA.gCo * (g / 255) ** SA.trc +
    SA.bCo * (b / 255) ** SA.trc
  );
}

function softClamp(y: number): number {
  return y >= SA.blkThrs ? y : y + (SA.blkThrs - y) ** SA.blkClmp;
}

/** APCA Lc 値（テキスト色×背景色）。 */
export function apcaContrast(text: RGB, bg: RGB): number {
  const yTxt = softClamp(screenY(text));
  const yBg = softClamp(screenY(bg));
  if (Math.abs(yBg - yTxt) < SA.deltaYmin) return 0;

  if (yBg > yTxt) {
    const sapc = (yBg ** SA.normBg - yTxt ** SA.normTxt) * SA.scale;
    return sapc < SA.loClip ? 0 : (sapc - SA.loOffset) * 100;
  }
  const sapc = (yBg ** SA.revBg - yTxt ** SA.revTxt) * SA.scale;
  return sapc > -SA.loClip ? 0 : (sapc + SA.loOffset) * 100;
}

/** APCA の用途目安（フォントサイズ表の簡約。|Lc| ベース）。 */
export function apcaUsage(lc: number): "body" | "large" | "ui" | "fail" {
  const a = Math.abs(lc);
  if (a >= 75) return "body";
  if (a >= 60) return "large";
  if (a >= 45) return "ui";
  return "fail";
}
