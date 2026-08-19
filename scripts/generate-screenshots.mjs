import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

/*
 * マニフェスト用スクリーンショット（リッチなインストール UI 向け）。
 *
 *   pnpm build && pnpm start &   # もしくは pnpm dev
 *   node scripts/generate-screenshots.mjs [URL]
 *
 * 既定 URL は http://localhost:3000。UI を大きく変えたら撮り直す。
 */

const BASE = process.argv[2] ?? process.env.SITE ?? "http://localhost:3000";

const SHOTS = [
  {
    file: "public/screenshots/wide.png",
    width: 1280,
    height: 800,
    setup: async () => {},
  },
  {
    file: "public/screenshots/narrow.png",
    width: 412,
    height: 892,
    // スマホ幅はパレットバーを展開した状態を見せる（操作の要）
    setup: async (page) => {
      await page.evaluate(() =>
        localStorage.setItem("cff-palette-collapsed", "0"),
      );
      await page.reload();
    },
  },
];

const browser = await chromium.launch();
mkdirSync("public/screenshots", { recursive: true });

for (const shot of SHOTS) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 1,
    locale: "ja-JP",
  });
  // 起動演出・初回コーチマークは撮影対象から外す
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("cff-splash-shown", "1");
      localStorage.setItem("cff-onboarded", "1");
    } catch {
      // 無視
    }
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await shot.setup(page);
  await page.waitForSelector("h1");
  await page.screenshot({ path: shot.file });
  await page.close();
  console.log(`${shot.file} (${shot.width}x${shot.height})`);
}

await browser.close();
