import { test, expect } from "@playwright/test";

/** スプラッシュ（セッション初回のみ・スキップ可・再訪では出ない）。 */

test("初回訪問でスプラッシュが表示され、SKIP でアプリに入れる", async ({
  page,
}) => {
  await page.goto("/");

  const splash = page.getByRole("dialog", { name: /起動アニメーション/ });
  await expect(splash).toBeVisible();
  await expect(splash.locator("svg path").first()).toBeVisible();

  await page
    .getByRole("button", { name: "起動アニメーションをスキップ" })
    .click();
  await expect(splash).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();

  // 同一セッションの再訪では表示されない
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
  await expect(splash).not.toBeVisible();
});

test("モーション低減設定ではスプラッシュを表示しない", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: /起動アニメーション/ }),
  ).not.toBeVisible();
  await context.close();
});
