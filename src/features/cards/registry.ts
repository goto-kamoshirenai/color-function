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
import { CardHueShift } from "./cards/CardHueShift";
import { CardSpaces } from "./cards/CardSpaces";
import { CardPerception } from "./cards/CardPerception";
import { CardAlpha } from "./cards/CardAlpha";
import { CardGamut } from "./cards/CardGamut";
import { CardApca } from "./cards/CardApca";
import { CardDeltaBreakdown } from "./cards/CardDeltaBreakdown";
import { CardLightSatDist } from "./cards/CardLightSatDist";
import { CardWarmCool } from "./cards/CardWarmCool";
import { CardGrayscale } from "./cards/CardGrayscale";
import { CardCvdMatrix } from "./cards/CardCvdMatrix";
import { CardRedundancy } from "./cards/CardRedundancy";
import { CardRoles } from "./cards/CardRoles";
import { CardSchemeMatch } from "./cards/CardSchemeMatch";
import { CardUiPreview } from "./cards/CardUiPreview";
import { CardSvgPreview } from "./cards/CardSvgPreview";
import { CardChartPreview } from "./cards/CardChartPreview";
import { CardPartner } from "./cards/CardPartner";
import { CardLsVariations } from "./cards/CardLsVariations";
import { CardGradient } from "./cards/CardGradient";
import { CardMix } from "./cards/CardMix";
import { CardComplement } from "./cards/CardComplement";
import { CardDarkLight } from "./cards/CardDarkLight";
import { CardSortNormalize } from "./cards/CardSortNormalize";
import { CardSemanticRoles } from "./cards/CardSemanticRoles";
import { CardNameSearch } from "./cards/CardNameSearch";
import { CardNudge } from "./cards/CardNudge";
import { CardTemplates } from "./cards/CardTemplates";
import { CardCvdSafe } from "./cards/CardCvdSafe";
import { CardTokens } from "./cards/CardTokens";

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
  {
    key: "hue-shift",
    title: "色相シフト",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "hueshift",
    Component: CardHueShift,
  },

  // ---- カタログ全実装（docs/04、2026-06-12）: 単色×検証 ----
  {
    key: "spaces",
    title: "拡張色空間",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "spaces",
    Component: CardSpaces,
  },
  {
    key: "perception",
    title: "知覚明度・色温度",
    category: "luminance",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "perception",
    Component: CardPerception,
  },
  {
    key: "alpha",
    title: "不透明度",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "alpha",
    Component: CardAlpha,
  },
  {
    key: "gamut",
    title: "ガマット・出力適合",
    category: "space",
    appliesTo: [...SINGLE_VERIFY],
    helpKey: "gamut",
    Component: CardGamut,
  },

  // ---- ペア×検証 ----
  {
    key: "apca",
    title: "APCA コントラスト",
    category: "contrast",
    appliesTo: [...PAIR_VERIFY],
    helpKey: "apca",
    Component: CardApca,
  },
  {
    key: "delta-breakdown",
    title: "色差の内訳",
    category: "difference",
    appliesTo: [...PAIR_VERIFY],
    helpKey: "dbreak",
    Component: CardDeltaBreakdown,
  },

  // ---- パレット×検証 ----
  {
    key: "ls-distribution",
    title: "明度・彩度分布",
    category: "stats",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "lsdist",
    Component: CardLightSatDist,
  },
  {
    key: "warm-cool",
    title: "暖寒バランス",
    category: "stats",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "warmcool",
    Component: CardWarmCool,
  },
  {
    key: "grayscale",
    title: "グレースケール耐性",
    category: "luminance",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "grayscale",
    Component: CardGrayscale,
  },
  {
    key: "cvd-matrix",
    title: "色覚識別性",
    category: "cvd",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "cvdmatrix",
    Component: CardCvdMatrix,
  },
  {
    key: "redundancy",
    title: "冗長性検出",
    category: "stats",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "redundancy",
    Component: CardRedundancy,
  },
  {
    key: "roles",
    title: "役割カバレッジ",
    category: "stats",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "roles",
    Component: CardRoles,
  },
  {
    key: "scheme-match",
    title: "調和スキーム判定",
    category: "harmony",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "scheme",
    Component: CardSchemeMatch,
  },
  {
    key: "ui-preview",
    title: "UI モックプレビュー",
    category: "preview",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "uipreview",
    Component: CardUiPreview,
  },
  {
    key: "svg-preview",
    title: "SVG プレビュー",
    category: "preview",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "svgpreview",
    Component: CardSvgPreview,
  },
  {
    key: "chart-preview",
    title: "データビズプレビュー",
    category: "preview",
    appliesTo: [...PALETTE_VERIFY],
    helpKey: "chartpreview",
    Component: CardChartPreview,
  },

  // ---- 設計（単位共通） ----
  {
    key: "partner",
    title: "相手色提案",
    category: "harmony",
    appliesTo: [...ALL_DESIGN],
    helpKey: "partner",
    Component: CardPartner,
  },
  {
    key: "ls-variations",
    title: "明度・彩度バリエーション",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "lsvar",
    Component: CardLsVariations,
  },
  {
    key: "gradient",
    title: "2色間グラデーション",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "gradient",
    Component: CardGradient,
  },
  {
    key: "mix",
    title: "色のミックス",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "mix",
    Component: CardMix,
  },
  {
    key: "nudge",
    title: "アクセシブル化ナッジ",
    category: "contrast",
    appliesTo: [...ALL_DESIGN],
    helpKey: "nudge",
    Component: CardNudge,
  },
  {
    key: "cvd-safe",
    title: "色覚セーフ提案",
    category: "cvd",
    appliesTo: [...ALL_DESIGN],
    helpKey: "cvdsafe",
    Component: CardCvdSafe,
  },
  {
    key: "complement",
    title: "不足色の補完提案",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "complement",
    Component: CardComplement,
  },
  {
    key: "dark-light",
    title: "ダーク/ライト変換",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "darklight",
    Component: CardDarkLight,
  },
  {
    key: "sort-normalize",
    title: "並べ替え・正規化",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "sort",
    Component: CardSortNormalize,
  },
  {
    key: "semantic-roles",
    title: "セマンティックロール割当",
    category: "generate",
    appliesTo: [...ALL_DESIGN],
    helpKey: "semroles",
    Component: CardSemanticRoles,
  },
  {
    key: "name-search",
    title: "色名検索",
    category: "naming",
    appliesTo: [...ALL_DESIGN],
    helpKey: "namesearch",
    Component: CardNameSearch,
  },
  {
    key: "templates",
    title: "配色テンプレート",
    category: "harmony",
    appliesTo: [...ALL_DESIGN],
    helpKey: "templates",
    Component: CardTemplates,
  },
  {
    key: "tokens",
    title: "デザイントークン出力",
    category: "export",
    appliesTo: [...ALL_DESIGN],
    helpKey: "tokens",
    Component: CardTokens,
  },
];
