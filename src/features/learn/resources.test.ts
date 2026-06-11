import { describe, it, expect } from "vitest";
import { ARTICLES, TOOLS, BOOKS, bookUrl } from "./resources";

describe("learn リソース", () => {
  it("記事・ツールの全 URL が妥当", () => {
    for (const r of [...ARTICLES, ...TOOLS]) {
      expect(() => new URL(r.url)).not.toThrow();
      expect(r.url).toMatch(/^https?:\/\//);
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.source.length).toBeGreaterThan(0);
    }
  });

  it("書籍リンクは Amazon 検索 URL（タグ未設定時は tag パラメータなし）", () => {
    for (const b of BOOKS) {
      const url = new URL(bookUrl(b));
      expect(url.origin).toBe("https://www.amazon.co.jp");
      expect(url.searchParams.get("k")).toBe(b.query);
      expect(url.searchParams.get("tag")).toBeNull();
    }
  });
});
