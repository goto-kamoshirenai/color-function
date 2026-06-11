/**
 * 指標ごとの参考資料（座学用の外部リンク集）。
 * アプリの目的（色の数値化・定量判断）には背景知識が不可欠なため、
 * 各カードから一次資料・定番解説へ1クリックで届くようにする。
 * リンク切れしにくい定番（Wikipedia / W3C / WebAIM 等）を優先して厳選。
 * title はリンク先自身の言語で表記し、lang タグで言語を示す。
 */
export type Reference = {
  title: string;
  source: string;
  url: string;
  lang: "ja" | "en";
};

export const REFERENCES: Record<string, Reference[]> = {
  value: [
    {
      title: "色空間",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/色空間",
      lang: "ja",
    },
    {
      title: "<color> — CSS の色値",
      source: "MDN Web Docs",
      url: "https://developer.mozilla.org/ja/docs/Web/CSS/color_value",
      lang: "ja",
    },
    {
      title: "RGB color model",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/RGB_color_model",
      lang: "en",
    },
  ],
  hsv: [
    {
      title: "HSV色空間",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/HSV色空間",
      lang: "ja",
    },
    {
      title: "HSL and HSV",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/HSL_and_HSV",
      lang: "en",
    },
  ],
  luminance: [
    {
      title: "Relative luminance（定義）",
      source: "W3C WCAG 2.2",
      url: "https://www.w3.org/TR/WCAG22/#dfn-relative-luminance",
      lang: "en",
    },
    {
      title: "WCAG 2.1 日本語訳",
      source: "WAIC",
      url: "https://waic.jp/translations/WCAG21/",
      lang: "ja",
    },
  ],
  wheel: [
    {
      title: "色相",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/色相",
      lang: "ja",
    },
    {
      title: "Color wheel",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_wheel",
      lang: "en",
    },
  ],
  name: [
    {
      title: "和色大辞典",
      source: "colordic.org",
      url: "https://www.colordic.org/w",
      lang: "ja",
    },
    {
      title: "<named-color> — CSS の色名",
      source: "MDN Web Docs",
      url: "https://developer.mozilla.org/ja/docs/Web/CSS/named-color",
      lang: "ja",
    },
  ],
  contrast: [
    {
      title: "Success Criterion 1.4.3 Contrast (Minimum)",
      source: "W3C WCAG 2.2",
      url: "https://www.w3.org/TR/WCAG22/#contrast-minimum",
      lang: "en",
    },
    {
      title: "Understanding WCAG Contrast Requirements",
      source: "WebAIM",
      url: "https://webaim.org/articles/contrast/",
      lang: "en",
    },
    {
      title: "WCAG 2.1 日本語訳",
      source: "WAIC",
      url: "https://waic.jp/translations/WCAG21/",
      lang: "ja",
    },
  ],
  deltae: [
    {
      title: "色差",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/色差",
      lang: "ja",
    },
    {
      title: "Color difference (ΔE)",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_difference",
      lang: "en",
    },
    {
      title: "Delta E (CIE 2000)",
      source: "Bruce Lindbloom",
      url: "http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html",
      lang: "en",
    },
  ],
  cvd: [
    {
      title: "カラーユニバーサルデザイン機構（CUDO）",
      source: "cudo.jp",
      url: "https://cudo.jp/",
      lang: "ja",
    },
    {
      title: "色覚多様性",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/色覚多様性",
      lang: "ja",
    },
    {
      title: "Color blindness",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_blindness",
      lang: "en",
    },
  ],
  cmatrix: [
    {
      title: "Success Criterion 1.4.3 Contrast (Minimum)",
      source: "W3C WCAG 2.2",
      url: "https://www.w3.org/TR/WCAG22/#contrast-minimum",
      lang: "en",
    },
    {
      title: "Understanding WCAG Contrast Requirements",
      source: "WebAIM",
      url: "https://webaim.org/articles/contrast/",
      lang: "en",
    },
  ],
  dmatrix: [
    {
      title: "色差",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/色差",
      lang: "ja",
    },
    {
      title: "Color difference (ΔE)",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_difference",
      lang: "en",
    },
  ],
  huedist: [
    {
      title: "配色",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/配色",
      lang: "ja",
    },
    {
      title: "Color scheme",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_scheme",
      lang: "en",
    },
  ],
  harmony: [
    {
      title: "補色",
      source: "Wikipedia",
      url: "https://ja.wikipedia.org/wiki/補色",
      lang: "ja",
    },
    {
      title: "Color theory",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Color_theory",
      lang: "en",
    },
    {
      title: "Adobe Color ホイール",
      source: "Adobe Color",
      url: "https://color.adobe.com/ja/create/color-wheel",
      lang: "ja",
    },
  ],
  tone: [
    {
      title: "PCCS（日本色研配色体系）",
      source: "日本色研事業",
      url: "https://www.sikiken.co.jp/pccs/",
      lang: "ja",
    },
    {
      title: "Tint, shade and tone",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Tint,_shade_and_tone",
      lang: "en",
    },
  ],
  hueshift: [
    {
      title: "OKLCH in CSS: why we moved from RGB and HSL",
      source: "Evil Martians",
      url: "https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl",
      lang: "en",
    },
    {
      title: "Oklab color space",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Oklab_color_space",
      lang: "en",
    },
    {
      title: "OKLCH Color Picker & Converter",
      source: "oklch.com",
      url: "https://oklch.com/",
      lang: "en",
    },
  ],
};
