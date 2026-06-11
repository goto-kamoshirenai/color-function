import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * 主要フロー（docs/12 §3）: 色を入れる → 検証 → 共有URL復元。
 * ＋ axe による a11y 検査（docs/02 §4「自身がアクセシブル」）。
 * スプラッシュは本ファイルでは抑止する（専用テストは splash.spec.ts）。
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("cff-splash-shown", "1");
    } catch {
      // 無視
    }
  });
});

test("起動: 既定パレットとペア×検証カードが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
  await expect(page.getByText(":1", { exact: true }).first()).toBeVisible();
  // 既定2色（FG=黒 / BG=アクセント=赤）のスウォッチ
  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(2);
});

test("色を追加すると URL ハッシュとカードに即時反映される", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "色を追加" }).click();
  await page.getByRole("textbox").fill("#ABCDEF");
  await page.getByRole("button", { name: "追加", exact: true }).click();

  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(3);
  await expect(page).toHaveURL(/#p=.*ABCDEF/);
});

test("共有URLからパレットを復元できる", async ({ page }) => {
  await page.goto("/#p=112233,AABBCC");
  await expect(page.getByRole("button", { name: /を選択$/ })).toHaveCount(2);
  // パレットバーのカラーコード（クリックでコピー）として表示される
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("button", { name: "#112233 をコピー" }),
  ).toBeVisible();
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

test("設計ビュー: ペア単位のままでもスウォッチ選択が基準色に即時反映される", async ({
  page,
}) => {
  await page.goto("/");
  // 既定単位は「ペア」のまま設計ビューへ
  await page.getByRole("radio", { name: "設計" }).click();
  await expect(page.getByText("BASE #080808")).toBeVisible();

  await page.getByRole("button", { name: /色 2 #E83015 を選択/ }).click();
  await expect(page.getByText("BASE #E83015")).toBeVisible();
});

test("全消去は確認ダイアログを経由する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "すべて消去" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "消去する" }).click();
  await expect(page.getByText(/NO SWATCHES/)).toBeVisible();
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
      // ハイドレーション完了（アクセント注入）を待ってから解析する
      await expect(page.getByRole("radio", { name: "検証" })).toBeVisible();
      await setup(page);
      // [data-specimen] はユーザー指定色をそのまま表示する標本領域
      // （プレビュー・CVDサンプル・調和チップ）。そのコントラストは
      // アプリが「測定して見せる対象」であり、UI の a11y 違反ではない。
      const results = await new AxeBuilder({ page })
        .exclude("[data-specimen]")
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }
});
