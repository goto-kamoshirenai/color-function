import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * axe による a11y 検査（docs/02 §4「自身がアクセシブル」）。
 *
 * 方針:
 *  - `minor` 以外（`moderate` / `serious` / `critical`）を失敗として扱う。
 *    moderate には見出し階層・landmark・ARIA 属性の不備など、SR 利用に
 *    実害のある指摘が含まれるため素通ししない。
 *  - ホームの3モードだけでなく、オーバーレイ（ピッカー・確認ダイアログ・
 *    設定メニュー・ヘルプ／参考資料／実装例ポップオーバー）・`/learn`・
 *    `/library`・`/code`・
 *    書籍導線が出た状態・スプラッシュ表示中も解析対象にする。
 *  - `[data-specimen]` はユーザー指定色をそのまま見せる標本領域
 *    （プレビュー・CVDサンプル・調和チップ）。そのコントラストはアプリが
 *    「測定して見せる対象」であり、UI の a11y 違反ではないため除外する。
 */

const FAIL_IMPACTS = ["moderate", "serious", "critical"];

const analyze = async (page: Page) => {
  const results = await new AxeBuilder({ page })
    .exclude("[data-specimen]")
    .analyze();
  const violations = results.violations.filter(
    (v) => v.impact != null && FAIL_IMPACTS.includes(v.impact),
  );
  expect(
    violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
    JSON.stringify(violations, null, 2),
  ).toEqual([]);
};

const skipSplash = () => {
  try {
    sessionStorage.setItem("cff-splash-shown", "1");
  } catch {
    // 無視
  }
};

/** ハイドレーション（アクセント注入）完了まで待つ。 */
const ready = async (page: Page) => {
  await expect(page.getByRole("radio", { name: "検証" })).toBeVisible();
};

/**
 * 初回コーチマーク（FirstRunHint）はフェードイン／アウトする。opacity が 1 未満の
 * 途中で解析すると背後との合成色になり、色コントラストを誤検出する。そのため
 * 「出現しきるまで待つ」「閉じたなら DOM から外れるまで待つ」の両方を待ち切る。
 */
const coachSettled = async (page: Page, stays: boolean) => {
  const coach = page.getByRole("status").filter({ hasText: "ここから操作" });
  if (stays) {
    await expect(coach).toBeVisible();
    await expect
      .poll(() => coach.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
  } else {
    await expect(coach).toHaveCount(0);
  }
};

test.describe("ホームの各モード", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(skipSplash);
  });

  const SCENES = [
    { label: "ペア×検証（既定）", setup: async () => {}, coachStays: true },
    {
      label: "単色×検証",
      setup: (page: Page) => page.getByRole("radio", { name: "単色" }).click(),
      coachStays: false,
    },
    {
      label: "パレット×検証",
      setup: (page: Page) =>
        page.getByRole("radio", { name: "パレット" }).click(),
      coachStays: false,
    },
    {
      label: "設計ビュー",
      setup: (page: Page) => page.getByRole("radio", { name: "設計" }).click(),
      coachStays: false,
    },
  ] as const;

  for (const { label, setup, coachStays } of SCENES) {
    test(`${label} で違反ゼロ`, async ({ page }) => {
      await page.goto("/");
      await ready(page);
      await coachSettled(page, true);
      await setup(page);
      await coachSettled(page, coachStays);
      await analyze(page);
    });
  }
});

test.describe("オーバーレイ表示中", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("cff-splash-shown", "1");
        // コーチマークはオーバーレイ検査には無関係なので抑止する
        localStorage.setItem("cff-hint-seen", "1");
      } catch {
        // 無視
      }
    });
    await page.goto("/");
    await ready(page);
  });

  test("カラーピッカーで違反ゼロ", async ({ page }) => {
    await page.getByRole("button", { name: "色を追加" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await analyze(page);
  });

  test("全消去の確認ダイアログで違反ゼロ", async ({ page }) => {
    await page.getByRole("button", { name: "すべて消去" }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await analyze(page);
  });

  test("設定メニューで違反ゼロ", async ({ page }) => {
    await page.getByRole("button", { name: "設定", exact: true }).click();
    await expect(page.getByRole("radio", { name: "ダーク" })).toBeVisible();
    await analyze(page);
  });

  test("使い方ヘルプで違反ゼロ", async ({ page }) => {
    await page.getByRole("button", { name: "使い方 の説明" }).click();
    await expect(page.getByRole("heading", { name: "使い方" })).toBeVisible();
    await analyze(page);
  });

  test("カードの参考資料ポップオーバーで違反ゼロ", async ({ page }) => {
    await page
      .getByRole("button", { name: /の参考資料$/ })
      .first()
      .click();
    await expect(page.getByRole("heading", { name: "参考資料" })).toBeVisible();
    await analyze(page);
  });

  test("カードの実装例ポップオーバーで違反ゼロ", async ({ page }) => {
    await page
      .getByRole("button", { name: /の実装例$/ })
      .first()
      .click();
    await expect(page.getByRole("heading", { name: "実装例" })).toBeVisible();
    await analyze(page);
  });

  test("FG/BG バーのヒントで違反ゼロ", async ({ page }) => {
    // タブレット幅以上では常時表示のヒントボタンが出る
    await page.setViewportSize({ width: 1024, height: 800 });
    await page
      .getByRole("button", { name: "文字色と背景色の説明を表示" })
      .click();
    await expect(page.getByText(/コントラストは/)).toBeVisible();
    await analyze(page);
  });
});

test("学習コンテンツ（/learn）で違反ゼロ", async ({ page }) => {
  await page.addInitScript(skipSplash);
  await page.goto("/learn");
  await expect(
    page.getByRole("heading", { name: "学習コンテンツ" }),
  ).toBeVisible();
  await analyze(page);
});

test("実装（/code）で違反ゼロ", async ({ page }) => {
  await page.addInitScript(skipSplash);
  await page.goto("/code");
  await expect(page.getByRole("heading", { name: "実装" })).toBeVisible();
  await analyze(page);
});

test("図書館（/library）で違反ゼロ", async ({ page }) => {
  await page.addInitScript(skipSplash);
  await page.goto("/library");
  await expect(page.getByRole("heading", { name: "図書館" })).toBeVisible();
  await analyze(page);
});

test("書籍の詳細（/library/[id]）で違反ゼロ", async ({ page }) => {
  await page.addInitScript(skipSplash);
  await page.goto("/library/coady-color-accessibility");
  await expect(
    page.getByRole("heading", { level: 1, name: "カラー・アクセシビリティ" }),
  ).toBeVisible();
  await analyze(page);
});

test("結果連動の書籍導線が出た状態で違反ゼロ", async ({ page }) => {
  await page.addInitScript(skipSplash);
  // コントラスト不足のペア＝カード末尾に書籍導線の1行が出ている
  await page.goto("/#p=777777,808080");
  await ready(page);
  await coachSettled(page, true);
  await expect(page.getByRole("link", { name: /基準の直し方/ })).toBeVisible();
  await analyze(page);
});

test("スプラッシュ表示中で違反ゼロ", async ({ page }) => {
  await page.goto("/");
  const splash = page.getByRole("dialog", { name: /起動アニメーション/ });
  await expect(splash).toBeVisible();
  // 描画演出の途中（合成中の色）を拾わないよう、SKIP が操作可能になるまで待つ
  await expect(
    page.getByRole("button", { name: "起動アニメーションをスキップ" }),
  ).toBeFocused();
  await analyze(page);
});
