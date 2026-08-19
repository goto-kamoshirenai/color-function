import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { MESSAGES } from "./messages";
import { HELP } from "@/features/cards/help";
import { REFERENCES } from "@/lib/references";

/**
 * 未使用の文言キー検出（docs/13 の「死にコードを残さない」の一環）。
 * ja↔en の網羅は型で保証されているが、「定義されているが誰も参照しない」
 * キーは型では検出できないため、ソース中の文字列リテラルを走査して照合する。
 */

const SRC = join(process.cwd(), "src");

function collectSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      collectSources(path, out);
      continue;
    }
    if (!/\.tsx?$/.test(entry)) continue;
    // テストと辞書そのものは参照元に数えない
    if (/\.test\.tsx?$/.test(entry)) continue;
    if (path.endsWith(join("i18n", "messages.ts"))) continue;
    out.push(path);
  }
  return out;
}

/** ソース中に現れる文字列リテラル（キー参照の候補）。 */
const literals = new Set<string>();
for (const path of collectSources(SRC)) {
  const text = readFileSync(path, "utf8");
  for (const m of text.matchAll(/["'`]([a-zA-Z0-9._-]+)["'`]/g))
    literals.add(m[1]);
}

describe("文言キーの参照", () => {
  it("未使用の MessageKey が無い", () => {
    const unused = Object.keys(MESSAGES.ja).filter((k) => !literals.has(k));
    expect(unused, `未使用キー: ${unused.join(", ")}`).toEqual([]);
  });

  it("未使用の helpKey が無い（HELP → 参照の逆向き検査）", () => {
    // ヘルプ文言はカード（helpKey）だけでなく、/learn の指標別リファレンス
    // （references.json の topic）の見出しにも使う。どちらからも参照されない
    // エントリだけを未使用とみなす。
    const unused = Object.keys(HELP.ja).filter(
      (k) => !literals.has(k) && !REFERENCES[k]?.length,
    );
    expect(unused, `未使用ヘルプ: ${unused.join(", ")}`).toEqual([]);
  });
});
