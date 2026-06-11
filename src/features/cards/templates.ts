/**
 * 配色テンプレート（docs/04 G「配色テンプレート適用」）。
 * 用途別の出発点。適用はパレット全置換（URL ハッシュに即同期されるので
 * ブラウザバックや共有リンクで戻れる）。
 */
export type PaletteTemplate = {
  id: string;
  /** 表示名（ja / en） */
  name: { ja: string; en: string };
  hexes: string[];
};

export const PALETTE_TEMPLATES: PaletteTemplate[] = [
  {
    id: "mono-accent",
    name: { ja: "モノクロ＋アクセント", en: "Mono + Accent" },
    hexes: ["#111114", "#5A5A60", "#A8A8AD", "#F2F2F0", "#E83015"],
  },
  {
    id: "corporate",
    name: { ja: "コーポレート", en: "Corporate" },
    hexes: ["#0F2540", "#2D6CDF", "#7FA8E8", "#EEF2F8", "#F2B705"],
  },
  {
    id: "pastel",
    name: { ja: "パステル", en: "Pastel" },
    hexes: ["#FBD3E0", "#FDE8C9", "#D9EFD3", "#CFE5F2", "#E1D4F0"],
  },
  {
    id: "earth",
    name: { ja: "アースカラー", en: "Earth" },
    hexes: ["#3E2F23", "#7A5230", "#A98A5B", "#D4C5A3", "#8A9A5B"],
  },
  {
    id: "high-contrast",
    name: { ja: "ハイコントラスト", en: "High Contrast" },
    hexes: ["#000000", "#FFFFFF", "#FFD500", "#0057B8", "#D7263D"],
  },
  {
    id: "dark-ui",
    name: { ja: "ダーク UI", en: "Dark UI" },
    hexes: ["#0C0C0D", "#1E1E21", "#43434A", "#9A9AA2", "#4D82E8"],
  },
];
