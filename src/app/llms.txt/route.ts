import { HELP } from "@/features/cards/help";
import { CARD_REGISTRY } from "@/features/cards/registry";
import {
  ARTICLES,
  TOOLS,
  BOOKS,
  CODE_LIBRARIES,
  REFERENCES,
  librariesForTopic,
} from "@/lib/references";
import { GLOSSARY } from "@/lib/glossary";
import { SITE_URL } from "@/lib/site";

/**
 * /llms.txt — このサイトを AI に読ませるための1枚（llmstxt.org の慣習に沿う）。
 *
 * 画面を辿らせる代わりに、指標の定義・目安・対応するライブラリ・参考資料を
 * テキストで渡す。内容は references.json / help.ts / glossary.json から
 * 生成するので、データを足せば自動で反映される（二重管理しない）。
 */
export const dynamic = "force-static";

function line(...parts: string[]): string {
  return parts.filter(Boolean).join(" — ");
}

function build(): string {
  const help = HELP.ja;
  // 指標はカードの登場順（レジストリ順）で、重複を除いて並べる
  const metrics = [...new Set(CARD_REGISTRY.map((c) => c.helpKey))].filter(
    (key) => help[key],
  );

  const out: string[] = [
    "# Color Follows Function",
    "",
    "> 配色を感覚ではなく数値で判断するためのツール。コントラスト比・色差 ΔE(CIEDE2000)・APCA・色覚シミュレーション(Machado 2009)・調和スキームなどをブラウザ内だけで計算する（サーバーに色を送らない）。",
    "",
    "配色は URL ハッシュ（`#p=rrggbb,rrggbb`）で共有・再現できる。",
    "",
    "## ページ",
    "",
    `- [ホーム](${SITE_URL}/) — 単位（単色 / ペア / パレット）× 観点（検証 / 設計）でカードが切り替わる作業画面`,
    `- [使い方](${SITE_URL}/guide) — 操作手順・モード別のカード一覧・結果の持ち出し方（画面写真つき）`,
    `- [学習コンテンツ](${SITE_URL}/learn) — 指標別リファレンス・記事・ベンチツール・用語集`,
    `- [図書館](${SITE_URL}/library) — 書籍（指標との対応つき）`,
    `- [実装](${SITE_URL}/code) — 指標を自分のコードで出すための計算ライブラリ`,
    "",
    "## 指標",
    "",
  ];

  for (const key of metrics) {
    const entry = help[key];
    const libs = librariesForTopic(key)
      .map((l) => l.pkg ?? l.name)
      .join(" / ");
    out.push(
      `### ${entry.title} (\`${key}\`)`,
      "",
      entry.body,
      "",
      line(`目安: ${entry.guide}`, libs ? `実装: ${libs}` : ""),
      "",
    );
    const refs = REFERENCES[key] ?? [];
    for (const r of refs) out.push(`- [${r.title}](${r.url}) — ${r.source}`);
    if (refs.length > 0) out.push("");
  }

  out.push("## 計算ライブラリ", "");
  for (const lib of CODE_LIBRARIES) {
    out.push(
      `- [${lib.name}](${lib.url})` +
        (lib.pkg ? ` \`${lib.pkg}\`` : "") +
        ` — ${lib.pitch.ja} API: ${lib.api} 指標: ${lib.topics.join(", ")}`,
    );
  }

  out.push("", "## 書籍", "");
  for (const book of BOOKS) {
    out.push(
      `- [${book.title}](${SITE_URL}/library/${book.id}) — ${book.author} / ${book.publisher} / ${book.year}。${book.pitch.ja} 指標: ${book.topics.join(", ")}`,
    );
  }

  out.push("", "## 記事・ベンチツール", "");
  for (const r of [...ARTICLES, ...TOOLS])
    out.push(`- [${r.title}](${r.url}) — ${r.source}`);

  out.push("", "## 用語", "");
  for (const g of GLOSSARY) out.push(`- **${g.term.ja}** — ${g.def.ja}`);

  out.push("");
  return out.join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
