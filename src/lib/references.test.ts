import { describe, it, expect } from "vitest";
import {
  REFERENCES,
  ARTICLES,
  TOOLS,
  BOOKS,
  bookLinks,
  bookById,
  booksForTopic,
} from "./references";
import { CARD_REGISTRY } from "@/features/cards/registry";
import { HELP } from "@/features/cards/help";

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

describe("書籍のメタデータ（図書館ページ用）", () => {
  it("全書籍が紹介文・要約・書架・カバー色を持つ", () => {
    for (const b of BOOKS) {
      expect(b.pitch.ja.length, b.id).toBeGreaterThan(0);
      expect(b.pitch.en.length, b.id).toBeGreaterThan(0);
      expect(b.summary.ja.length, b.id).toBeGreaterThan(0);
      expect(b.summary.en.length, b.id).toBeGreaterThan(0);
      expect(b.accent, b.id).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(b.shelf, b.id).toBeTruthy();
    }
  });

  it("書籍の topics はすべて実在する指標（helpKey）", () => {
    // 指標の集合はヘルプ文言（HELP）を正とする。カードとして描かれなくなった
    // 指標（最寄り色名・相手色提案など）も /learn では学ぶ対象として残る。
    const keys = new Set(Object.keys(HELP.ja));
    for (const b of BOOKS) {
      expect(b.topics.length, `${b.id} に topics がない`).toBeGreaterThan(0);
      for (const key of b.topics) {
        expect(keys.has(key), `${b.id} の topics "${key}" が未知の指標`).toBe(
          true,
        );
      }
    }
  });

  it("bookById は ID で書籍を引ける", () => {
    for (const b of BOOKS) expect(bookById(b.id)).toBe(b);
    expect(bookById("no-such-book")).toBeUndefined();
  });

  it("booksForTopic は指標に紐づく書籍を BOOKS の順で返す", () => {
    for (const b of BOOKS) {
      for (const key of b.topics) {
        expect(booksForTopic(key)).toContain(b);
      }
    }
    expect(booksForTopic("no-such-topic")).toEqual([]);

    const first = BOOKS[0];
    const listed = booksForTopic(first.topics[0]);
    expect(listed).toEqual(BOOKS.filter((b) => listed.includes(b)));
  });

  it("書籍を1冊も持たない指標があってもよいが、検証系の主要指標は必ず持つ", () => {
    for (const key of ["contrast", "cvd", "harmony", "value"]) {
      expect(booksForTopic(key).length, key).toBeGreaterThan(0);
    }
  });
});
