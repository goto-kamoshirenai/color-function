import { readFileSync } from "node:fs";

/**
 * references.json の全リンクの生存確認（pnpm links:check）。
 * ネットワークに依存するため CI / pre-commit には入れず、資料の追加・
 * 定期メンテ時に手動で実行する。書籍（Amazon 検索 URL）は bot 対策で
 * ステータスが安定しないため対象外。
 */
const data = JSON.parse(readFileSync("src/data/references.json", "utf8"));

const refs = [
  ...Object.entries(data.topics).flatMap(([key, list]) =>
    list.map((r) => ({ ...r, where: `topics.${key}` })),
  ),
  ...data.articles.map((r) => ({ ...r, where: "articles" })),
  ...data.tools.map((r) => ({ ...r, where: "tools" })),
];

// 同一 URL は1回だけ確認
const unique = [...new Map(refs.map((r) => [r.url, r])).values()];

const check = async (ref) => {
  const headers = {
    // 偽ブラウザ UA は逆に bot 判定されやすい（W3C 等）ため正直に名乗る
    "User-Agent": "cff-link-check/1.0 (+https://github.com/)",
    "Accept-Language": "ja,en;q=0.8",
  };
  try {
    let res = await fetch(ref.url, {
      method: "HEAD",
      headers,
      redirect: "follow",
    });
    // HEAD 不許可のサーバーは GET で再確認
    if (res.status >= 400) {
      res = await fetch(ref.url, {
        method: "GET",
        headers,
        redirect: "follow",
      });
    }
    return { ref, status: res.status, ok: res.status < 400 };
  } catch (e) {
    return { ref, status: String(e?.cause?.code ?? e), ok: false };
  }
};

const results = await Promise.all(unique.map(check));
const failed = results.filter((r) => !r.ok);

for (const { ref, status, ok } of results) {
  console.log(
    `${ok ? "OK " : "NG "} ${String(status).padEnd(3)} ${ref.where.padEnd(18)} ${ref.url}`,
  );
}
console.log(`\n${results.length} checked, ${failed.length} failed`);
if (failed.length > 0) process.exit(1);
