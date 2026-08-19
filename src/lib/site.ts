/**
 * サイトの公開 URL（絶対 URL の生成基準）。
 *
 * OG 画像・canonical・sitemap は絶対 URL を必要とする。値はハードコードせず
 * 環境変数から取り、未設定時は Vercel の提供値 →（開発用の）localhost の順で
 * 補う。プレビュー環境でも自分自身を指すよう VERCEL_URL を見る。
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();
