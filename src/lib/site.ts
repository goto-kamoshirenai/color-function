/**
 * サイトの公開 URL（絶対 URL の生成基準）。
 *
 * OG 画像・canonical・sitemap・llms.txt は絶対 URL を必要とする。優先順位は
 * 環境変数 → Vercel のプレビュー URL → 本番ドメイン → localhost。
 * プレビュー環境だけは自分自身を指すよう VERCEL_URL を先に見る
 * （プレビューの canonical が本番を指すと、検証中のページが本番に化ける）。
 */
const PRODUCTION_URL = "https://color-follows-function.net";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== "production") {
    const preview = process.env.VERCEL_URL;
    if (preview) return `https://${preview}`;
  }
  if (vercelEnv === "production") return PRODUCTION_URL;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();
