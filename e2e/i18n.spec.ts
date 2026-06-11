import { test, expect } from "@playwright/test";

/**
 * 多言語対応（ja/en）:
 *  - 初期値はブラウザ言語（ja 以外は en にフォールバック）
 *  - 手動切替は localStorage に保持され、次回訪問時の初期値になる
 * 既定コンテキストは playwright.config.ts で ja-JP。
 */

const skipSplash = () => {
  try {
    sessionStorage.setItem("cff-splash-shown", "1");
  } catch {
    // 無視
  }
};

test("ブラウザ言語が日本語なら日本語 UI で表示される", async ({ page }) => {
  await page.addInitScript(skipSplash);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
});

test("ブラウザ言語が英語なら英語 UI にフォールバックする", async ({
  browser,
}) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.addInitScript(skipSplash);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "WCAG Contrast Ratio" }),
  ).toBeVisible();
  await context.close();
});

test("ブラウザ言語が ja/en 以外なら英語 UI になる", async ({ browser }) => {
  const context = await browser.newContext({ locale: "fr-FR" });
  const page = await context.newPage();
  await page.addInitScript(skipSplash);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "WCAG Contrast Ratio" }),
  ).toBeVisible();
  await context.close();
});

test("手動切替は localStorage に保持され、再訪時の初期値になる", async ({
  page,
}) => {
  await page.addInitScript(skipSplash);
  await page.goto("/");

  // ja → en へ切替（設定メニュー経由）
  await page.getByRole("button", { name: "設定", exact: true }).click();
  await page.getByRole("radio", { name: "English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "WCAG Contrast Ratio" }),
  ).toBeVisible();

  // 再訪（ja-JP ブラウザのまま）でも保持値 en が優先される
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "WCAG Contrast Ratio" }),
  ).toBeVisible();

  // en → ja へ戻す
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "日本語" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});
