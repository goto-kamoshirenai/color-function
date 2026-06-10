import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * 主要フロー（docs/12 §3）: 色を入れる → 検証 → 共有URL復元。
 * ＋ axe による a11y 検査（docs/02 §4「自身がアクセシブル」）。
 */

test("起動: 既定パレットとペア×検証カードが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
  await expect(page.getByText(/: 1/).first()).toBeVisible();
  // 既定5色のスウォッチ
  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(5);
});

test("色を追加すると URL ハッシュとカードに即時反映される", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "色を追加" }).click();
  await page.getByRole("textbox").fill("#ABCDEF");
  await page.getByRole("button", { name: "追加", exact: true }).click();

  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(6);
  await expect(page).toHaveURL(/#p=.*ABCDEF/);
});

test("共有URLからパレットを復元できる", async ({ page }) => {
  await page.goto("/#p=112233,AABBCC");
  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(2);
  await expect(page.getByRole("button", { name: /#112233/ })).toBeVisible();
});

test("モード切替: 単色×検証 → 5カード", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "単色" }).click();
  await expect(page.getByRole("heading", { name: "色値" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "最寄り色名" })).toBeVisible();
});

test("設計ビュー: 調和スキームから色を追加できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "設計" }).click();
  await expect(
    page.getByRole("heading", { name: "調和スキーム生成" }),
  ).toBeVisible();
  const before = await page.getByRole("button", { name: /を選択$/ }).count();
  await page
    .getByRole("button", { name: /補色の色 .* をパレットに追加/ })
    .first()
    .click();
  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(
    before + 1,
  );
});

test("全消去は確認ダイアログを経由する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "すべて消去" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "消去する" }).click();
  await expect(page.getByText(/色がありません/)).toBeVisible();
});

test.describe("アクセシビリティ (axe)", () => {
  for (const [label, setup] of [
    ["ペア×検証（既定）", async () => {}],
    [
      "単色×検証",
      async (page: import("@playwright/test").Page) => {
        await page.getByRole("radio", { name: "単色" }).click();
      },
    ],
    [
      "設計ビュー",
      async (page: import("@playwright/test").Page) => {
        await page.getByRole("radio", { name: "設計" }).click();
      },
    ],
  ] as const) {
    test(`${label} で重大違反ゼロ`, async ({ page }) => {
      await page.goto("/");
      await setup(page);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }
});
