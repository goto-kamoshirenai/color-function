import type { MetadataRoute } from "next";

/** PWA マニフェスト（Next のファイル規約で /manifest.webmanifest に出力・自動リンク）。 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Color Follows Function",
    short_name: "CFF",
    description:
      "配色を感覚でなく数値で扱う、配色の検証・設計支援ツール。コントラスト比・色差・色覚シミュレーションなどで定量的に可視化する。",
    id: "/",
    start_url: "/",
    // インストール後の対象範囲（未指定でも "/" と解釈されるが明示する）
    scope: "/",
    lang: "ja",
    dir: "ltr",
    categories: ["design", "productivity", "utilities"],
    display: "standalone",
    background_color: "#ededee",
    theme_color: "#16161a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // インストール前のプレビュー（リッチなインストール UI 用）。
    // 生成は scripts/generate-screenshots.mjs（pnpm screenshots）。
    screenshots: [
      {
        src: "/screenshots/wide.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "ペア×検証（コントラスト比の判定）",
      },
      {
        src: "/screenshots/narrow.png",
        sizes: "412x892",
        type: "image/png",
        form_factor: "narrow",
        label: "スマホでの配色パレットと検証カード",
      },
    ],
    // 主要モードへの直行（インストール後のホーム画面ショートカット）
    shortcuts: [
      {
        name: "検証（ペア）",
        short_name: "検証",
        description: "文字色と背景色のコントラストを検証する",
        url: "/",
      },
      {
        name: "使い方",
        short_name: "使い方",
        description: "操作手順と結果の持ち出し方",
        url: "/guide",
      },
      {
        name: "学習コンテンツ",
        short_name: "学習",
        description: "指標別リファレンス・記事・用語集",
        url: "/learn",
      },
      {
        name: "図書館",
        short_name: "図書館",
        description: "配色を学ぶ書籍",
        url: "/library",
      },
    ],
  };
}
