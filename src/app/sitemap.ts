import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/references";
import { SITE_URL } from "@/lib/site";

/**
 * サイトマップ（Next のファイル規約で /sitemap.xml に出力）。
 * 配色は URL ハッシュ（#p=）で共有されるが、ハッシュはクロール対象外なので
 * 列挙するのは実ページだけ。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/guide", "/learn", "/library", "/code"];
  return [
    ...routes.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...BOOKS.map((b) => ({
      url: `${SITE_URL}/library/${b.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
