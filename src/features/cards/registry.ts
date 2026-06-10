import type { CardDef } from "./types";
import { CardValue } from "./cards/CardValue";
import { CardHsv } from "./cards/CardHsv";
import { CardLuminance } from "./cards/CardLuminance";
import { CardHueWheel } from "./cards/CardHueWheel";
import { CardNearestName } from "./cards/CardNearestName";
import { CardWcagContrast } from "./cards/CardWcagContrast";
import { CardDeltaE } from "./cards/CardDeltaE";
import { CardCvd } from "./cards/CardCvd";
import { CardContrastMatrix } from "./cards/CardContrastMatrix";
import { CardDeltaMatrix } from "./cards/CardDeltaMatrix";
import { CardHueDistribution } from "./cards/CardHueDistribution";
import { CardHarmony } from "./cards/CardHarmony";
import { CardTone } from "./cards/CardTone";

const SINGLE_VERIFY = [{ unit: "single", view: "verify" }] as const;
const PAIR_VERIFY = [{ unit: "pair", view: "verify" }] as const;
const PALETTE_VERIFY = [{ unit: "palette", view: "verify" }] as const;
// 設計ビューは単位を問わず同じカード群（docs/10 §4「設計（単位共通）」）
const ALL_DESIGN = [
  { unit: "single", view: "design" },
  { unit: "pair", view: "design" },
  { unit: "palette", view: "design" },
] as const;

/** カードレジストリ（docs/10 §4 / docs/11 §4）。スプリント毎に追加していく。 */
export const CARD_REGISTRY: CardDef[] = [
  {
    key: "value",
    title: "色値",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "value",
    Component: CardValue,
  },
  {
    key: "hsv",
    title: "HSV",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "hsv",
    Component: CardHsv,
  },
  {
    key: "luminance",
    title: "相対輝度",
    category: "luminance",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "luminance",
    Component: CardLuminance,
  },
  {
    key: "hue-wheel",
    title: "色相環",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "wheel",
    Component: CardHueWheel,
  },
  {
    key: "nearest-name",
    title: "最寄り色名",
    category: "naming",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "name",
    Component: CardNearestName,
  },
  {
    key: "wcag-contrast",
    title: "WCAG コントラスト比",
    category: "contrast",
    appliesTo: [...PAIR_VERIFY],
    helpKey: "contrast",
    Component: CardWcagContrast,
  },
  {
    key: "delta-e",
    title: "色差 ΔE",
    category: "difference",
    appliesTo: [...PAIR_VERIFY],
    helpKey: "deltae",
    Component: CardDeltaE,
  },
  {
    key: "cvd",
    title: "色覚シミュレーション",
    category: "cvd",
    appliesTo: [...PAIR_VERIFY],
    helpKey: "cvd",
    Component: CardCvd,
  },
  {
    key: "contrast-matrix",
    title: "コントラスト比マトリクス",
    category: "contrast",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "cmatrix",
    Component: CardContrastMatrix,
  },
  {
    key: "delta-matrix",
    title: "色差 ΔE マトリクス",
    category: "difference",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "dmatrix",
    Component: CardDeltaMatrix,
  },
  {
    key: "hue-distribution",
    title: "色相分布",
    category: "stats",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "huedist",
    Component: CardHueDistribution,
  },
  {
    key: "harmony",
    title: "調和スキーム生成",
    category: "harmony",
    appliesTo: [...ALL_DESIGN],
    helpKey: "harmony",
    Component: CardHarmony,
  },
  {
    key: "tone",
    title: "トーン展開",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "tone",
    Component: CardTone,
  },
];
