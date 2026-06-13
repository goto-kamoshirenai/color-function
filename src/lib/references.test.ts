import { describe, it, expect } from "vitest";
import { REFERENCES, ARTICLES, TOOLS, BOOKS, bookUrl } from "./references";
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

  it("書籍リンクは Amazon 検索 URL（タグ未設定時は tag パラメータなし）", () => {
    for (const b of BOOKS) {
      const url = new URL(bookUrl(b));
      expect(url.origin).toBe("https://www.amazon.co.jp");
      expect(url.searchParams.get("k")).toBe(b.query);
      expect(url.searchParams.get("tag")).toBeNull();
    }
  });
});
