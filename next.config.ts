import type { NextConfig } from "next";

/**
 * セキュリティ関連のレスポンスヘッダ（全ルート）。
 *
 * CSP はここに含めない: ペイント前にテーマ・言語を確定するインライン
 * スクリプト（app/layout.tsx の themeInit）があり、厳格な CSP には nonce が
 * 必要になる。全ページを静的生成している現構成では nonce を発行できないため、
 * CSP を入れるなら「インライン初期化をやめる（＝初回のちらつきを受け入れる）」
 * かミドルウェア導入とセットで検討する。
 */
const securityHeaders = [
  // MIME スニッフィング禁止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 参照元は同一オリジンのみ送る（外部リンクへはオリジンまで）
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 他サイトへの埋め込み禁止（クリックジャッキング対策）
  { key: "X-Frame-Options", value: "DENY" },
  // 使わない強力な API は明示的に無効化する
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // サーバー名を漏らさない
  poweredByHeader: false,
  // PW_DIST が指定されたときだけビルド出力先を切り替える（Playwright 検証用）。
  // 既定（未指定）では .next のまま。開発サーバの出力に影響しない。
  ...(process.env.PW_DIST ? { distDir: process.env.PW_DIST } : {}),
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
