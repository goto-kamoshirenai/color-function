import { defineConfig, devices } from "@playwright/test";

/**
 * E2E / アクセシビリティ検査（docs/12 §3）。テストは S7 で本格導入。
 * ローカルで dev サーバを起動して検査する。
 *
 * ポートは 3100 番台に固定（既定 3100）。開発時に別途立てている dev サーバ
 * （通常 3000）との衝突を避けるため。PORT 環境変数で上書き可能。
 */
const PORT = Number(process.env.PORT ?? 3100);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // 既存スペックは日本語 UI を前提とするため固定（i18n.spec.ts で en を別途検証）
    locale: "ja-JP",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // PW_START=1 のときは本番ビルド（PW_DIST）を next start で配信する。
    // 同一プロジェクトでは next dev を二重起動できない（Next 16 のロック）ため、
    // 別の dev サーバと並行して検証したい場合はこちらを使う。
    command: process.env.PW_START
      ? `pnpm exec next start --port ${PORT}`
      : `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
