import type { CardDef } from "./types";
import { CardValue } from "./cards/CardValue";
import { CardHsv } from "./cards/CardHsv";
import { CardLuminance } from "./cards/CardLuminance";
import { CardHueWheel } from "./cards/CardHueWheel";
import { CardNearestName } from "./cards/CardNearestName";
import { CardWcagContrast } from "./cards/CardWcagContrast";
import { CardDeltaE } from "./cards/CardDeltaE";
import { CardCvd } from "./cards/CardCvd";

const SINGLE_VERIFY = [{ unit: "single", view: "verify" }] as const;
const PAIR_VERIFY = [{ unit: "pair", view: "verify" }] as const;

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
];
