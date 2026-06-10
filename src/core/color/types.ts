/**
 * 色計算レイヤの共通型（docs/11 §2）。
 * すべて純粋なプレーン型。RGB は 0–255、角度は度数法。
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };
export type HSV = { h: number; s: number; v: number };
export type OKLCH = { l: number; c: number; h: number };
export type LAB = { L: number; a: number; b: number };

export type CvdType = "protan" | "deutan" | "tritan";
