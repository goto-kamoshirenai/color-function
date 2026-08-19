import { test, expect } from "@playwright/test";

/**
 * 主要フロー（docs/12 §3）: 色を入れる → 検証 → 共有URL復元。
 * a11y（axe）は a11y.spec.ts、レイアウト崩れは layout.spec.ts が受け持つ。
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
  // 既定4色（FG=黒 … BG=アクセント=赤）のスウォッチ。
  // FG/BG セレクトの aria-label も「…を選択」で終わるため、
  // 数え上げはパレットバー（contentinfo）内に限定する。
  await expect(
    page.getByRole("contentinfo").getByRole("button", { name: /を選択$/ }),
  ).toHaveCount(4);
});

test("色を追加すると URL ハッシュとカードに即時反映される", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "色を追加" }).click();
  await page.getByRole("textbox").fill("#ABCDEF");
  await page.getByRole("button", { name: "追加", exact: true }).click();

  await expect(
    page.getByRole("contentinfo").getByRole("button", { name: /を選択$/ }),
  ).toHaveCount(5);
  await expect(page).toHaveURL(/#p=.*ABCDEF/);
});

test("共有URLからパレットを復元できる", async ({ page }) => {
  await page.goto("/#p=112233,AABBCC");
  await expect(
    page.getByRole("contentinfo").getByRole("button", { name: /を選択$/ }),
  ).toHaveCount(2);
  // パレットバーのカラーコード（クリックでコピー）として表示される
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("button", { name: "#112233 をコピー" }),
  ).toBeVisible();
});

test("モード切替: 単色×検証のカード群に切り替わる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "単色" }).click();
  // ヒーロー（色値）＋単色向けカード。最寄り色名はヒーローが吸収するため
  // 独立カードとしては現れない（CardList の LAYOUT を参照）。
  await expect(page.getByRole("heading", { name: "色値" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "HSV" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "ガマット・出力適合" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "最寄り色名" })).toHaveCount(
    0,
  );
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

  // ラベルは「色 {n}/{総数}」形式（総数は操作で変わりうるため緩く照合）
  await page.getByRole("button", { name: /色 2\/\d+ #009B4C を選択/ }).click();
  await expect(page.getByText("BASE #009B4C")).toBeVisible();
});

test("ヘッダーから学習コンテンツ画面に遷移できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "学習コンテンツを開く" }).click();

  await expect(
    page.getByRole("heading", { name: "学習コンテンツ" }),
  ).toBeVisible();
  // 指標別・記事・ツール・用語集の4セクション（書籍は図書館へ分離）
  for (const name of [
    "指標別リファレンス",
    "記事・読み物",
    "ベンチツール",
    "用語集",
  ]) {
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  // 外部リンクは新しいタブで開く
  const first = page.getByRole("link", { name: /Contrast Checker/ }).first();
  await expect(first).toHaveAttribute("target", "_blank");

  // ツールへ戻れる（ヘッダーの学習トグルが「ホームに戻る」になる）
  await page.getByRole("link", { name: "ホームに戻る" }).click();
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
});

test("学習コンテンツから図書館へ渡り、書籍の詳細まで辿れる", async ({
  page,
}) => {
  await page.goto("/learn");

  // /learn 先頭の帯から図書館へ
  await page.getByRole("link", { name: /書籍で学ぶ/ }).click();
  await expect(page.getByRole("heading", { name: "図書館" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "蔵書" })).toBeVisible();

  // 購入リンクは別タブ・sponsored
  const buy = page
    .getByRole("link", { name: /カラー・アクセシビリティ を Amazon で見る/ })
    .first();
  await expect(buy).toHaveAttribute("target", "_blank");
  await expect(buy).toHaveAttribute("rel", /sponsored/);

  // 書名から詳細ページへ
  await page
    .getByRole("link", { name: "カラー・アクセシビリティ", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "カラー・アクセシビリティ" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "この本について" }),
  ).toBeVisible();

  // 扱う指標から指標別リファレンスへ戻れる
  await page
    .getByRole("link", { name: "WCAG コントラスト比", exact: true })
    .click();
  await expect(page).toHaveURL(/\/learn#topic-contrast$/);
});

test("ヘッダーの図書館トグルでホームと往復できる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "図書館を開く" }).click();
  await expect(page.getByRole("heading", { name: "図書館" })).toBeVisible();

  await page.getByRole("link", { name: "ホームに戻る" }).click();
  await expect(
    page.getByRole("heading", { name: "WCAG コントラスト比" }),
  ).toBeVisible();
});

test("全消去は確認ダイアログを経由する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "すべて消去" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "消去する" }).click();
  await expect(page.getByText(/NO SWATCHES/)).toBeVisible();
});
