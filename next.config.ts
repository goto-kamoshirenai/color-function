import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // PW_DIST が指定されたときだけビルド出力先を切り替える（Playwright 検証用）。
  // 既定（未指定）では .next のまま。開発サーバの出力に影響しない。
  ...(process.env.PW_DIST ? { distDir: process.env.PW_DIST } : {}),
};

export default nextConfig;
