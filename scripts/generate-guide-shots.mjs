import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

/*
 * 使い方ページ（/guide）の画面写真を、E2E と同じ Playwright で撮る。
 *
 *   pnpm build && pnpm start &   # もしくは pnpm dev
 *   node scripts/generate-guide-shots.mjs [URL]
 *
 * 手で撮らないのは、UI を変えたら撮り直すのを忘れるから。ここに「どの操作の
 * 結果を撮るか」を書いておけば、いつでも同じ状態を再現して撮り直せる。
 *
 * 出力:
 *  - public/guide/<id>-<theme>.png … ライト/ダークの2枚（ページ側で出し分け）
 *  - src/data/guideShots.json      … CSS ピクセルの寸法（レイアウトシフト防止）
 */

const BASE = process.argv[2] ?? process.env.SITE ?? "http://localhost:3000";
const THEMES = ["light", "dark"];
const VIEWPORT = { width: 1180, height: 900 };
/* 2倍で撮って CSS ピクセル寸法で並べる（HiDPI でも滲まない） */
const SCALE = 2;

/** 既定パレット（#080808 / #009B4C / #576FFF / #E83015）を明示して再現性を持たせる */
const PALETTE = "#p=080808,009b4c,576fff,e83015";

const card = (page, title) =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });

const SHOTS = [
  {
    id: "palette",
    // 配色パレット＋単位/観点トグル＋持ち出し導線（画面下部の操作台）
    open: async (page) => {
      await page.goto(`${BASE}/${PALETTE}`, { waitUntil: "networkidle" });
      await page.getByRole("radio", { name: "ペア" }).click();
    },
    target: (page) => page.locator("footer").last(),
  },
  {
    id: "card",
    // 指標カード（見出しの ⟨/⟩・本・? が見える状態）
    open: async (page) => {
      await page.goto(`${BASE}/${PALETTE}`, { waitUntil: "networkidle" });
      await page.getByRole("radio", { name: "ペア" }).click();
    },
    target: (page) => card(page, "WCAG コントラスト比"),
  },
  {
    id: "snippet",
    // 実装例ポップオーバー（いま表示中の色が埋まったコード）
    open: async (page) => {
      await page.goto(`${BASE}/${PALETTE}`, { waitUntil: "networkidle" });
      await page.getByRole("radio", { name: "ペア" }).click();
      await page
        .getByRole("button", { name: /の実装例$/ })
        .first()
        .click();
      await page.getByRole("heading", { name: "実装例" }).waitFor();
    },
    target: (page) => page.getByRole("dialog"),
  },
  {
    id: "tokens",
    // デザイントークン出力（設計ビュー）
    open: async (page) => {
      await page.goto(`${BASE}/${PALETTE}`, { waitUntil: "networkidle" });
      await page.getByRole("radio", { name: "設計" }).click();
      await card(page, "デザイントークン出力").scrollIntoViewIfNeeded();
    },
    target: (page) => card(page, "デザイントークン出力"),
  },
];

const browser = await chromium.launch();
mkdirSync("public/guide", { recursive: true });

const shots = {};

for (const shot of SHOTS) {
  for (const theme of THEMES) {
    const page = await browser.newPage({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      locale: "ja-JP",
      // アニメーションを止めて、同じ操作なら同じ絵になるようにする
      reducedMotion: "reduce",
    });
    await page.addInitScript((t) => {
      try {
        sessionStorage.setItem("cff-splash-shown", "1");
        localStorage.setItem("cff-onboarded", "1");
        localStorage.setItem("cff-palette-collapsed", "0");
        localStorage.setItem("cff-theme", t);
      } catch {
        // 無視
      }
    }, theme);

    await shot.open(page);
    const target = shot.target(page);
    await target.waitFor();

    const file = `public/guide/${shot.id}-${theme}.png`;
    await target.screenshot({ path: file, animations: "disabled" });

    if (theme === "light") {
      const box = await target.boundingBox();
      if (!box) throw new Error(`no bounding box: ${shot.id}`);
      shots[shot.id] = {
        width: Math.round(box.width),
        height: Math.round(box.height),
      };
    }
    await page.close();
    console.log(`${file}`);
  }
}

writeFileSync(
  "src/data/guideShots.json",
  JSON.stringify({ schemaVersion: "1.0.0", shots }, null, 2) + "\n",
  "utf8",
);
console.log("src/data/guideShots.json");

await browser.close();
