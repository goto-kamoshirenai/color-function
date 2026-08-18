import { describe, it, expect } from "vitest";
import { REFERENCES, ARTICLES, TOOLS, BOOKS, bookLinks } from "./references";
import { CARD_REGISTRY } from "@/features/cards/registry";

describe("参考資料データ（references.json）", () => {
  // スキーマ検証自体は import 時の zod parse が担う（不正なら即失敗）

  it("全リンクの URL が妥当", () => {
    const all = [...Object.values(REFERENCES).flat(), ...ARTICLES, ...TOOLS];
    expect(all.length).toBeGreaterThan(0);
    for (const r of all) {
      expect(() => new URL(r.url)).not.toThrow();
      expect(r.url).toMatch(/^https?:\/\//);
    }
  });

  it("レジストリの全指標に対応する資料がある", () => {
    // サマリーヒーロー（要約カード）は単一指標ではないため参考資料を持たない
    const SUMMARY_NO_REFS = new Set(["overview"]);
    for (const card of CARD_REGISTRY) {
      if (SUMMARY_NO_REFS.has(card.helpKey)) continue;
      expect(
        REFERENCES[card.helpKey]?.length,
        `topics.${card.helpKey} が references.json にない`,
      ).toBeGreaterThan(0);
    }
  });

  it("書籍リンクは Amazon アソシエイトの短縮リンク", () => {
    for (const b of BOOKS) {
      const links = bookLinks(b);
      expect(links[0].format, `${b.id} の先頭は単行本`).toBe("print");
      for (const l of links) {
        expect(new URL(l.url).origin, `${b.id} / ${l.format}`).toBe(
          "https://amzn.to",
        );
      }
    }
  });

  it("書籍の版リンクは重複せず、ID は一意", () => {
    const urls = BOOKS.flatMap((b) => bookLinks(b).map((l) => l.url));
    expect(new Set(urls).size).toBe(urls.length);
    expect(new Set(BOOKS.map((b) => b.id)).size).toBe(BOOKS.length);
  });
});
