/**
 * 色計算レイヤの共通型（docs/11 §2）。
 * すべて純粋なプレーン型。RGB は 0–255、角度は度数法。
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };
export type HSV = { h: number; s: number; v: number };
export type OKLCH = { l: number; c: number; h: number };
export type OKLAB = { l: number; a: number; b: number };
export type LAB = { L: number; a: number; b: number };
/** CIELCH（LAB の極座標表現）。 */
export type LCH = { L: number; c: number; h: number };
/** HWB（CSS Color 4）。各 0–100。 */
export type HWB = { h: number; w: number; b: number };
/** CMYK 近似（ナイーブ変換・各 0–100）。 */
export type CMYK = { c: number; m: number; y: number; k: number };
/** CIE XYZ（D65・Y=1 基準の 0–1 スケール）。 */
export type XYZ = { x: number; y: number; z: number };

export type CvdType = "protan" | "deutan" | "tritan";
