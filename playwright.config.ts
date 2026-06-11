import { defineConfig, devices } from "@playwright/test";

/**
 * E2E / アクセシビリティ検査（docs/12 §3）。テストは S7 で本格導入。
 * ローカルで dev サーバを起動して検査する。
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // 既存スペックは日本語 UI を前提とするため固定（i18n.spec.ts で en を別途検証）
    locale: "ja-JP",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
