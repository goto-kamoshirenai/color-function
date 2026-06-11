import type { Reference } from "@/features/cards/references";

/**
 * 座学・ベンチツール画面（/learn）の追加リソース。
 * 指標別の資料は features/cards/references.ts を再利用し、
 * ここでは一般記事・書籍・外部ツールを管理する。
 */

/** 一般記事・読み物（消えにくい定番を優先）。 */
export const ARTICLES: Reference[] = [
  {
    title: "色",
    source: "Wikipedia",
    url: "https://ja.wikipedia.org/wiki/色",
    lang: "ja",
  },
  {
    title: "Color",
    source: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Color",
    lang: "en",
  },
  {
    title: "Color and contrast accessibility",
    source: "web.dev (Google)",
    url: "https://web.dev/articles/color-and-contrast-accessibility",
    lang: "en",
  },
  {
    title: "ウェブアクセシビリティ導入ガイドブック",
    source: "デジタル庁",
    url: "https://www.digital.go.jp/resources/introduction-to-web-accessibility-guidebook",
    lang: "ja",
  },
];

/** ベンチツール（検証・配色作業に使える外部ツール）。 */
export const TOOLS: Reference[] = [
  {
    title: "Contrast Checker",
    source: "WebAIM",
    url: "https://webaim.org/resources/contrastchecker/",
    lang: "en",
  },
  {
    title: "Who Can Use",
    source: "whocanuse.com",
    url: "https://www.whocanuse.com/",
    lang: "en",
  },
  {
    title: "OKLCH Color Picker & Converter",
    source: "oklch.com",
    url: "https://oklch.com/",
    lang: "en",
  },
  {
    title: "Adobe Color ホイール",
    source: "Adobe Color",
    url: "https://color.adobe.com/ja/create/color-wheel",
    lang: "ja",
  },
  {
    title: "和色大辞典",
    source: "colordic.org",
    url: "https://www.colordic.org/",
    lang: "ja",
  },
  {
    title: "Viz Palette",
    source: "Susie Lu",
    url: "https://projects.susielu.com/viz-palette",
    lang: "en",
  },
];

/**
 * Amazon アソシエイトタグ。設定すると書籍リンクがアフィリエイトリンクになる
 * （例: "yourtag-22"）。空文字の間は通常の検索リンク。
 */
export const AMAZON_ASSOCIATE_TAG = "";

export type Book = {
  title: string;
  author: string;
  publisher: string;
  /** Amazon 検索クエリ（ASIN 直リンクは商品改版で切れやすいため検索を使う） */
  query: string;
};

/** 書籍（色彩の定番書を厳選）。 */
export const BOOKS: Book[] = [
  {
    title: "配色の設計 — Interaction of Color",
    author: "ジョセフ・アルバース",
    publisher: "ビー・エヌ・エヌ",
    query: "配色の設計 アルバース",
  },
  {
    title: "配色アイデア手帖",
    author: "桜井輝子",
    publisher: "SBクリエイティブ",
    query: "配色アイデア手帖",
  },
  {
    title: "色彩検定 公式テキスト 2級編",
    author: "色彩検定協会（A・F・T）",
    publisher: "色彩検定協会",
    query: "色彩検定 公式テキスト 2級",
  },
  {
    title: "カラー・アクセシビリティ",
    author: "Geri Coady",
    publisher: "ビー・エヌ・エヌ",
    query: "カラー・アクセシビリティ Coady",
  },
  {
    title: "色彩心理図鑑",
    author: "ポーポー・ポロダクション",
    publisher: "日本文芸社",
    query: "色彩心理図鑑",
  },
];

/** 書籍の Amazon 検索 URL（アソシエイトタグ設定時はアフィリエイトリンク）。 */
export function bookUrl(book: Book): string {
  const url = new URL("https://www.amazon.co.jp/s");
  url.searchParams.set("k", book.query);
  if (AMAZON_ASSOCIATE_TAG) url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
  return url.toString();
}
