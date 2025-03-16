export const defaultMainColor = "#000000";
export const defaultMainColorB = "#404040";
export const defaultBaseColor = "#a3a3a3";
export const defaultBaseColorB = "#d4d4d4";
export const defaultAccentColor = "#2EA9DF";
export const defaultAccentColorB = "#005CAF";
export const defaultTextColor = "#000000";
export const defaultTextColorB = "#404040";

export const colorTemplate: {
  id: number;
  mainA: string;
  mainB?: string;
  baseA: string;
  baseB?: string;
  accentA: string;
  accentB?: string;
  textA: string;
  textB?: string;
}[] = [
  {
    id: 1,
    mainA: defaultMainColor,
    mainB: undefined,
    baseA: defaultBaseColor,
    baseB: undefined,
    accentA: defaultAccentColor,
    accentB: undefined,
    textA: defaultTextColor,
    textB: undefined,
  },
  {
    id: 2,
    mainA: "#5B9BD5", // 青系（Hexウェブサイト）
    mainB: "#4285B4",
    baseA: "#E6EBF0",
    baseB: "#C8D1DC",
    accentA: "#1E1E1E", // 黒
    accentB: "#333333",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 3,
    mainA: "#8FCFB9", // ミントグリーン（天気アプリ）
    mainB: "#6DB396",
    baseA: "#D5E8E0",
    baseB: "#B2D0C4",
    accentA: "#F8A398", // サーモンピンク
    accentB: "#E57F73",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 4,
    mainA: "#F8B7C9", // ピンク（アイスクリームアプリ）
    mainB: "#E595AD",
    baseA: "#FDE8EF",
    baseB: "#F8D0DE",
    accentA: "#E75480", // ストロベリー
    accentB: "#C73B66",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 5,
    mainA: "#D2C0B2", // ベージュ/サンド系（ドライフラワーサイト）
    mainB: "#BEA89A",
    baseA: "#EFE6DD",
    baseB: "#E5D7C9",
    accentA: "#5D4B3C", // ダークブラウン
    accentB: "#483A2F",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 6,
    mainA: "#1E1E1E", // ダークグレー/ブラック（iDraftダッシュボード）
    mainB: "#2D2D2D",
    baseA: "#F5F5F5",
    baseB: "#E0E0E0",
    accentA: "#757575", // ミディアムグレー
    accentB: "#616161",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 7,
    mainA: "#006D5B", // ティールグリーン（金融アプリ）
    mainB: "#00574A",
    baseA: "#C5E8B7",
    baseB: "#A5D996",
    accentA: "#004D40", // ダークティール
    accentB: "#00352C",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 8,
    mainA: "#3F51B5", // インディゴブルー（Ecourse言語学習アプリ）
    mainB: "#303F9F",
    baseA: "#E8E6F0",
    baseB: "#D1C4E9",
    accentA: "#FF5722", // オレンジ
    accentB: "#E64A19",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 9,
    mainA: "#8A9A5B", // オリーブグリーン（Elemisスキンケア製品サイト）
    mainB: "#6B7A3D",
    baseA: "#F0EFE2",
    baseB: "#E0DECB",
    accentA: "#556B2F", // ダークオリーブ
    accentB: "#3B4A1F",
    textA: "#212121",
    textB: "#757575",
  },
  {
    id: 10,
    mainA: "#FFEB3B", // イエロー（在庫管理ダッシュボード）
    mainB: "#FDD835",
    baseA: "#F5F5F5",
    baseB: "#EEEEEE",
    accentA: "#FF9800", // オレンジ
    accentB: "#F57C00",
    textA: "#212121",
    textB: "#757575",
  },
];
