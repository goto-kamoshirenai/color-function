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
  };
}
