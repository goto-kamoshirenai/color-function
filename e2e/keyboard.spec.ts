import { test, expect } from "@playwright/test";

/**
 * キーボード操作の回帰検査（docs/02 §4）。
 *  - スウォッチの ←→ 並べ替えでフォーカスが移動先に追従する
 *  - モーダル（カラーピッカー）でフォーカスが内側に閉じ、閉じると復帰する
 *  - 色数不足の単位ボタンは Tab で到達しない（真に無効）
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("cff-splash-shown", "1");
      localStorage.setItem("cff-hint-seen", "1");
      localStorage.setItem("cff-palette-collapsed", "0");
    } catch {
      // 無視
    }
  });
});

test("スウォッチの ←→ 並べ替えでフォーカスが色に追従する", async ({ page }) => {
  await page.goto("/#p=112233,AABBCC,FF0000");
  // ラベルは「色 {n}/{総数} {hex}(FG/BG バッジ) を選択」
  const first = page.getByRole("button", { name: /色 1\/3 #112233/ });
  await first.focus();

  await page.keyboard.press("ArrowRight");

  // 同じ色（#112233）が 2 番目になり、フォーカスもその色に乗ったまま
  await expect(
    page.getByRole("button", { name: /色 2\/3 #112233/ }),
  ).toBeFocused();

  // 端ではそれ以上動かず、ライブリージョンで通知する
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("button", { name: /色 3\/3 #112233/ }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText(/これ以上移動できません/)).toBeVisible();
});

test("カラーピッカーはフォーカスを閉じ込め、閉じると呼び出し元へ戻す", async ({
  page,
}) => {
  await page.goto("/");
  const add = page.getByRole("button", { name: "色を追加" });
  await add.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  // 何度 Tab しても背後（ヘッダー・パレットバー）へ抜けない
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const inside = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(add).toBeFocused();
});

test("色数が足りない単位ボタンは Tab で到達しない", async ({ page }) => {
  await page.goto("/#p=112233");
  const pair = page.getByRole("radio", { name: "ペア" });
  await expect(pair).toBeDisabled();

  // 無効なボタンにはフォーカスを当てられない
  await page.getByRole("radio", { name: "単色" }).focus();
  await page.keyboard.press("Tab");
  await expect(pair).not.toBeFocused();
});
