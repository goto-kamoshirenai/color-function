import { describe, it, expect } from "vitest";
import { snippetFor, SNIPPET_KEYS, type SnippetContext } from "./snippets";
import { HELP } from "./help";
import { codeLibraryById } from "@/lib/references";

const ctx: SnippetContext = {
  primary: "#3A7BD5",
  fg: "#777777",
  bg: "#FFFFFF",
  hexes: ["#3A7BD5", "#E83015", "#FFFFFF"],
};

describe("カードのスニペット", () => {
  it("スニペットのある指標はすべて実在し、既知のライブラリを指す", () => {
    expect(SNIPPET_KEYS.length).toBeGreaterThan(0);
    for (const key of SNIPPET_KEYS) {
      expect(HELP.ja[key], `${key} のヘルプ文言がない`).toBeDefined();
      const snippet = snippetFor(key, ctx);
      expect(snippet, key).not.toBeNull();
      if (!snippet) continue;
      expect(
        codeLibraryById(snippet.libId),
        `${key} の libId "${snippet.libId}" が references.json にない`,
      ).toBeDefined();
      expect(snippet.code.length, key).toBeGreaterThan(0);
    }
  });

  it("いま表示中の色がコードに埋まる", () => {
    expect(snippetFor("contrast", ctx)?.code).toContain('"#777777", "#FFFFFF"');
    expect(snippetFor("luminance", ctx)?.code).toContain("#3A7BD5");
    // パレット全体を使う指標は全色を列挙する
    const matrix = snippetFor("cvdmatrix", ctx)?.code ?? "";
    for (const hex of ctx.hexes) expect(matrix).toContain(hex);
  });

  it("画面に出ている値と同じ計算結果をコメントで示す", () => {
    // #777777 on #FFFFFF = 4.48:1（AA にわずかに届かない）
    expect(snippetFor("contrast", ctx)?.code).toContain("4.48");
  });

  it("2色未満でも壊れない（ペア前提の指標は primary で埋める）", () => {
    const single: SnippetContext = {
      primary: "#3A7BD5",
      fg: "#3A7BD5",
      bg: "#3A7BD5",
      hexes: ["#3A7BD5"],
    };
    for (const key of SNIPPET_KEYS) {
      expect(() => snippetFor(key, single), key).not.toThrow();
    }
  });

  it("スニペットを持たない指標は null", () => {
    expect(snippetFor("no-such-metric", ctx)).toBeNull();
  });
});
