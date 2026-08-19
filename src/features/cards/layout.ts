import type { Unit, View } from "@/store/useColorStore";

/**
 * モード別のカード配置（v2 のグリッド構成。キーは registry のカード key）。
 *
 * 「どのカードが存在するか」は registry、「どこに並ぶか」はこの LAYOUT が持つ。
 * 対応は registry.test の整合テストで検査する（LAYOUT の typo や、registry へ
 * 追加して LAYOUT に入れ忘れたカードが無言で消えるのを防ぐ）。
 */
export const LAYOUT: Record<string, { className: string; keys: string[] }[]> = {
  "single|verify": [
    { className: "", keys: ["single-hero"] },
    { className: "md:grid-cols-[1.35fr_1fr]", keys: ["hsv", "luminance"] },
    { className: "", keys: ["spaces"] },
    {
      className: "md:grid-cols-[1fr_1fr]",
      keys: ["perception", "alpha"],
    },
    { className: "md:grid-cols-2", keys: ["hue-wheel", "gamut"] },
  ],
  "pair|verify": [
    { className: "", keys: ["wcag-contrast"] },
    { className: "md:grid-cols-[1fr_1.3fr]", keys: ["delta-e", "cvd"] },
    {
      className: "md:grid-cols-[1fr_1.3fr]",
      keys: ["apca", "delta-breakdown"],
    },
  ],
  "palette|verify": [
    { className: "", keys: ["palette-overview"] },
    { className: "", keys: ["contrast-matrix"] },
    {
      className: "md:grid-cols-[1.4fr_1fr]",
      keys: ["delta-matrix", "hue-distribution"],
    },
    { className: "md:grid-cols-2", keys: ["ls-distribution", "warm-cool"] },
    { className: "md:grid-cols-2", keys: ["grayscale", "cvd-matrix"] },
    { className: "md:grid-cols-2", keys: ["redundancy", "roles"] },
    {
      className: "md:grid-cols-[1fr_1.3fr]",
      keys: ["scheme-match", "ui-preview"],
    },
    { className: "md:grid-cols-2", keys: ["svg-preview", "chart-preview"] },
  ],
  design: [
    { className: "", keys: ["base-scheme"] },
    { className: "", keys: ["harmony"] },
    { className: "", keys: ["tone"] },
    { className: "", keys: ["hue-shift"] },
    { className: "", keys: ["ls-variations"] },
    { className: "", keys: ["gradient"] },
    { className: "md:grid-cols-[1.3fr_1fr]", keys: ["nudge", "mix"] },
    { className: "md:grid-cols-2", keys: ["cvd-safe", "complement"] },
    { className: "md:grid-cols-2", keys: ["dark-light", "sort-normalize"] },
    { className: "md:grid-cols-2", keys: ["semantic-roles", "name-search"] },
    { className: "md:grid-cols-[1fr_1.3fr]", keys: ["templates", "tokens"] },
  ],
};

/** 現在の単位×観点に対応する配置（設計ビューは単位共通）。 */
export function layoutFor(unit: Unit, view: View) {
  return view === "design" ? LAYOUT.design : LAYOUT[`${unit}|verify`];
}
