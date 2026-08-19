import { test, expect } from "@playwright/test";

/**
 * オフライン起動（PWA）。Service Worker は本番ビルドでのみ登録するため、
 * 本番成果物を配信している実行（PW_START=1）でだけ検証する。
 *   pnpm build && PW_START=1 pnpm e2e -- e2e/offline.spec.ts
 */
test.describe("オフライン起動", () => {
  test.skip(
    !process.env.PW_START,
    "本番ビルド配信時のみ（Service Worker は dev では登録しない）",
  );

  test("2 回目以降はオフラインでも起動して検証できる", async ({
    page,
    context,
  }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("cff-splash-shown", "1");
        localStorage.setItem("cff-hint-seen", "1");
      } catch {
        // 無視
      }
    });

    // 1 回目: SW 登録＋プリキャッシュ
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "WCAG コントラスト比" }),
    ).toBeVisible();
    await page.waitForFunction(
      () => navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 20_000 },
    );

    // 2 回目（オンライン）でチャンクもキャッシュに入る
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "WCAG コントラスト比" }),
    ).toBeVisible();

    // オフラインにして起動し直す
    await context.setOffline(true);
    await page.reload();

    await expect(
      page.getByRole("heading", { name: "WCAG コントラスト比" }),
    ).toBeVisible();
    // 計算はクライアント側で完結する（コントラスト比が出る）
    await expect(page.getByText(":1", { exact: true }).first()).toBeVisible();

    // 色名辞書（静的アセット）もキャッシュから読める
    await page.getByRole("radio", { name: "単色" }).click();
    await expect(page.getByRole("heading", { name: "色値" })).toBeVisible();

    await context.setOffline(false);
  });
});
