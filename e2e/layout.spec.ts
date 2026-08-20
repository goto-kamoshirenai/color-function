import { test, expect, type Page } from "@playwright/test";

/**
 * レイアウト崩れの回帰検査。
 *
 * 「見た目の崩れ」をスクリーンショット差分ではなく幾何で検出する:
 *  1. ページ全体が横スクロールしない（WCAG 1.4.10 リフロー / 320px 幅）
 *  2. 要素がビューポート右端を越えない（横スクロール容器の中は除く）
 *  3. overflow-x:hidden の要素が中身を切っていない（truncate は除く）
 *  4. カード（section）の中身がカード枠の外へ漏れていない
 *
 * 崩れやすい軸を掛け合わせて回す:
 *  - 幅: 320 / 768 / 1280（1 カラム・2 カラム・固定パネル各段階）
 *  - 言語: ja / en（英語はラベルが長い）
 *  - カラーコード表示形式: hex / hsl（hsl は文字数が倍になる）
 */

type Finding = { kind: string; selector: string; detail: string };

const collect = async (page: Page): Promise<Finding[]> =>
  page.evaluate(() => {
    const out: Finding[] = [];
    const label = (el: Element): string => {
      const heading = el.closest("section")?.querySelector("h2")?.textContent;
      const own =
        el.tagName.toLowerCase() +
        (typeof el.className === "string" && el.className
          ? "." + el.className.trim().split(/\s+/).slice(0, 4).join(".")
          : "");
      return (heading ? `[${heading.trim()}] ` : "") + own;
    };
    /** 視覚的に隠された要素（.sr-only / react-aria の 1px コンテナ）。 */
    const isHidden = (el: Element) =>
      el.closest(".sr-only") !== null ||
      el.clientWidth <= 1 ||
      el.clientHeight <= 1;
    /**
     * 意図的に親からはみ出す要素:
     *  - 装飾（透かし・コーナーブラケット等の aria-hidden / pointer-events:none）
     *  - data-overflow-ok を持つ領域（軸マーカーの配置レイヤーなど、子が
     *    レイヤー境界をまたぐことが設計上正しいもの）
     */
    const isDecor = (el: Element) =>
      el.getAttribute("aria-hidden") === "true" ||
      el.hasAttribute("data-overflow-ok") ||
      getComputedStyle(el).pointerEvents === "none";
    const scrollsX = (el: Element) => {
      const ox = getComputedStyle(el).overflowX;
      return ox === "auto" || ox === "scroll";
    };
    const insideScrollerX = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement)
        if (scrollsX(p)) return true;
      return false;
    };
    const overflowsHorizontally = (el: Element) => {
      const box = el.getBoundingClientRect();
      return Array.from(el.children).some((c) => {
        if (isDecor(c)) return false;
        const r = c.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return false;
        return r.right > box.right + 1 || r.left < box.left - 1;
      });
    };

    // 1. ページ全体の横スクロール
    const main = document.querySelector("main");
    for (const el of [document.documentElement, document.body, main]) {
      if (el && el.scrollWidth > el.clientWidth + 1)
        out.push({
          kind: "page-scrolls-horizontally",
          selector: label(el),
          detail: `scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`,
        });
    }

    const vw = document.documentElement.clientWidth;
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (isHidden(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;

      // 2. ビューポートの外
      if (!isDecor(el) && !insideScrollerX(el)) {
        if (r.right > vw + 1)
          out.push({
            kind: "past-viewport",
            selector: label(el),
            detail: `right=${Math.round(r.right)} viewport=${vw}`,
          });
        if (r.left < -1)
          out.push({
            kind: "before-viewport",
            selector: label(el),
            detail: `left=${Math.round(r.left)}`,
          });
      }

      // 3. 意図せぬ横方向のクリップ
      if (
        cs.overflowX === "hidden" &&
        cs.textOverflow !== "ellipsis" &&
        el.scrollWidth > el.clientWidth + 3 &&
        overflowsHorizontally(el)
      )
        out.push({
          kind: "clipped",
          selector: label(el),
          detail: `scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`,
        });
    }

    // 4. カード枠からの漏れ（main 内のカードのみ。パレットバーのスウォッチは
    //    バッジ・削除ボタンを意図的に色面の外へ出す設計なので対象外）
    for (const el of Array.from(
      document.querySelectorAll("main section, main section *"),
    )) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.overflowX !== "visible") continue;
      if (isHidden(el) || el.hasAttribute("data-overflow-ok")) continue;
      if (el.scrollWidth <= el.clientWidth + 3) continue;
      if (!overflowsHorizontally(el)) continue;
      out.push({
        kind: "overflows-card",
        selector: label(el),
        detail: `scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`,
      });
    }

    return out;
  });

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1280x800", width: 1280, height: 800 },
] as const;

const LABELS = {
  ja: {
    single: "単色",
    palette: "パレット",
    design: "設計",
    add: "色を追加",
  },
  en: {
    single: "Single",
    palette: "Palette",
    design: "Design",
    add: "Add color",
  },
} as const;

type Labels = (typeof LABELS)["ja" | "en"];

const SCENES: {
  name: string;
  path?: string;
  hash?: string;
  setup?: (page: Page, l: Labels) => Promise<void>;
}[] = [
  { name: "ペア×検証" },
  {
    name: "単色×検証",
    setup: (p, l) => p.getByRole("radio", { name: l.single }).click(),
  },
  {
    name: "パレット×検証",
    setup: (p, l) => p.getByRole("radio", { name: l.palette }).click(),
  },
  {
    name: "パレット×検証（12色）",
    hash: "#p=112233,AABBCC,FF0000,00FF00,0000FF,FFFF00,FF00FF,00FFFF,888888,FFFFFF,000000,7A3B2E",
    setup: (p, l) => p.getByRole("radio", { name: l.palette }).click(),
  },
  {
    name: "設計",
    setup: (p, l) => p.getByRole("radio", { name: l.design }).click(),
  },
  { name: "1色のみ", hash: "#p=336699" },
  { name: "空のパレット", hash: "#p=" },
  { name: "使い方", path: "/guide" },
  { name: "学習コンテンツ", path: "/learn" },
  { name: "図書館", path: "/library" },
  { name: "書籍の詳細", path: "/library/coady-color-accessibility" },
  { name: "実装", path: "/code" },
  {
    // 基準未達のペア＝カード末尾の書籍導線が出ている状態
    name: "ペア×検証（コントラスト不足）",
    hash: "#p=777777,808080",
  },
  {
    // 似すぎた色＝冗長性・色覚識別性の書籍導線が出ている状態
    name: "パレット×検証（似色）",
    hash: "#p=2D6CDF,2F6EDD,3070E0,336699",
    setup: (p, l) => p.getByRole("radio", { name: l.palette }).click(),
  },
  {
    name: "カラーピッカー",
    setup: (p, l) => p.getByRole("button", { name: l.add }).click(),
  },
];

/** 検査する組み合わせ（言語・表示形式は幅ごとに 1 つに絞って実行時間を抑える）。 */
const MATRIX = [
  { locale: "ja", format: "hex" },
  { locale: "en", format: "hex" },
  { locale: "ja", format: "hsl" },
] as const;

for (const vp of VIEWPORTS) {
  for (const { locale, format } of MATRIX) {
    test.describe(`${vp.name} / ${locale} / ${format}`, () => {
      test.use({
        viewport: { width: vp.width, height: vp.height },
        locale: locale === "ja" ? "ja-JP" : "en-US",
      });

      test.beforeEach(async ({ page }) => {
        await page.addInitScript(
          ([fmt]) => {
            try {
              // スプラッシュ・初回ヒントは抑止し、パレットバーは展開状態で検査する
              sessionStorage.setItem("cff-splash-shown", "1");
              localStorage.setItem("cff-hint-seen", "1");
              localStorage.setItem("cff-palette-collapsed", "0");
              localStorage.setItem("cff-color-format", fmt);
            } catch {
              // localStorage 不可環境は既定値のまま検査する
            }
          },
          [format],
        );
      });

      for (const scene of SCENES) {
        test(`${scene.name} で崩れない`, async ({ page }) => {
          await page.goto((scene.path ?? "/") + (scene.hash ?? ""));
          await expect(page.locator("h1").first()).toBeVisible();
          if (scene.setup) await scene.setup(page, LABELS[locale]);

          const findings = await collect(page);
          expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
        });
      }
    });
  }
}
