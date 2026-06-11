import type { Locale } from "@/lib/i18n/messages";

/** 指標ヘルプ文言（docs/10 §4・モック helpMap 準拠の13指標）。ja / en の2言語。 */
export type HelpEntry = { title: string; body: string; guide: string };

const HELP_JA = {
  usage: {
    title: "パレットバーの使い方",
    body:
      "スウォッチをクリックで選択します（ペアでは前景 FG に。背景 BG をクリックすると FG/BG が入れ替わります）。" +
      "ダブルクリックで編集、色の下のカラーコードはクリックでコピー、右上の × で削除、右下の塗りつぶしアイコンでその色を画面の差し色（アクセント）に指定できます。" +
      "下段の「単位」はどの粒度で見るか（単色 / ペア / パレット）、「観点」は目的（検証 = 診断 / 設計 = 配色づくり）を切り替え、組み合わせで表示カードが決まります。",
    guide: "FG=前景 / BG=背景 / 塗りつぶし=アクセント指定",
  },
  value: {
    title: "色値",
    body: "同じ色を RGB・HEX・HSL・HSV など複数の数値表現で表したものです。用途に応じて使い分けます。",
    guide: "HEX=#RRGGBB / RGB=0–255 / HSL・HSV=角度と%",
  },
  hsv: {
    title: "HSV（色相・彩度・明度）",
    body: "色相(Hue)で色味、彩度(Saturation)で鮮やかさ、明度(Value)で明るさを表す直感的な色空間です。",
    guide: "H 0–360° / S 0–100% / V 0–100%",
  },
  luminance: {
    title: "相対輝度",
    body: "人間が知覚する明るさを 0（黒）〜1（白）で表した値。コントラスト比計算の基礎になります。",
    guide: "0.0 = 黒  /  1.0 = 白",
  },
  wheel: {
    title: "色相環",
    body: "色相を円環状に配置した図。中心からの距離が鮮やかさ（彩度×明度）を表し、パレット各色の色相関係を一目で把握できます。黒・白・グレーは中心に集まります。",
    guide: "角度=色相 / 距離=鮮やかさ",
  },
  name: {
    title: "最寄り色名",
    body: "基準色から色差(ΔE)が最も小さい代表色名を表示します。色をことばで説明する際の手がかりになります。",
    guide: "ΔE が小さいほど名前に近い",
  },
  contrast: {
    title: "WCAG コントラスト比",
    body: "2色の相対輝度の比。文字の可読性基準として WCAG が定義しています。通常テキストは AA 4.5:1・AAA 7:1、大きな文字は AA 3:1・AAA 4.5:1 が目安です。",
    guide: "1:1（同一）〜 21:1（黒×白）",
  },
  deltae: {
    title: "色差 ΔE",
    body: "2色の知覚的な違いの大きさ。CIEDE2000 で算出し、小さいほど似ています。約2以下で人はほぼ区別できません。",
    guide: "ΔE<2 ほぼ同一 / >10 明確な差",
  },
  cvd: {
    title: "色覚シミュレーション",
    body: "P型・D型・T型それぞれの色覚での見え方を再現します。特定の色覚でも配色が区別できるかを確認できます。",
    guide: "P=赤系 / D=緑系 / T=青系の弱",
  },
  cmatrix: {
    title: "コントラスト比マトリクス",
    body: "パレット全色の総当たりコントラスト比。組み合わせとして使える色ペアを一覧で確認できます。太字が AA 合格です。",
    guide: "太枠・太字 = 4.5:1 以上",
  },
  dmatrix: {
    title: "色差 ΔE マトリクス",
    body: "パレット全色ペアの知覚的な色差。値が小さいペアは紛らわしく、区別しにくい組み合わせです。",
    guide: "小さい値ほど似ている色ペア",
  },
  huedist: {
    title: "色相分布",
    body: "パレット各色の色相を 0–360° の軸上に配置。色相が偏っていないか、バランスを確認できます。",
    guide: "点が散る=多彩 / 集まる=単調",
  },
  harmony: {
    title: "調和スキーム生成",
    body: "基準色の色相を回転させ、補色・類似色・トライアドなど色彩理論に基づく配色候補を生成します。",
    guide: "補色=180° / 類似=±30° / 三分=120°",
  },
  tone: {
    title: "トーン展開",
    body: "基準色を 500 として、明るい 50 から暗い 900 まで明度を段階変化させた色階調です（MUI 等のカラーパレットの流儀）。",
    guide: "50=最明 / 500=基準色 / 900=最暗",
  },
  hueshift: {
    title: "色相シフト",
    body: "基準色の明度・彩度を保ったまま、色相だけを OKLCH で段階回転した候補です。基準色とトーンが揃ったまま色味だけ変わるため、アクセントカラーの検討に向きます。",
    guide: "±30°=隣接色 / ±150°〜180°=補色寄り",
  },
} as const satisfies Record<string, HelpEntry>;

type HelpKey = keyof typeof HELP_JA;

const HELP_EN: Record<HelpKey, HelpEntry> = {
  usage: {
    title: "How to Use the Palette Bar",
    body:
      "Click a swatch to select it (in Pair mode it becomes the foreground FG; clicking the background BG swaps FG/BG). " +
      "Double-click to edit, click the color code below a swatch to copy it, remove with the × at the top right, and use the fill icon at the bottom right to make that color the UI accent. " +
      "In the bottom row, Unit sets the granularity (Single / Pair / Palette) and View sets the goal (Verify = diagnose / Design = build a scheme); their combination decides which cards are shown.",
    guide: "FG=foreground / BG=background / fill=set accent",
  },
  value: {
    title: "Color Value",
    body: "The same color expressed in multiple numeric notations such as RGB, HEX, HSL, and HSV. Use whichever fits the task.",
    guide: "HEX=#RRGGBB / RGB=0–255 / HSL·HSV=angle and %",
  },
  hsv: {
    title: "HSV (Hue · Saturation · Value)",
    body: "An intuitive color space: Hue for the color tone, Saturation for vividness, and Value for brightness.",
    guide: "H 0–360° / S 0–100% / V 0–100%",
  },
  luminance: {
    title: "Relative Luminance",
    body: "Perceived brightness expressed from 0 (black) to 1 (white). It is the basis of contrast ratio calculations.",
    guide: "0.0 = black  /  1.0 = white",
  },
  wheel: {
    title: "Hue Wheel",
    body: "Hues arranged in a circle. Distance from the center shows chroma (saturation × value), giving an at-a-glance view of hue relationships in the palette. Black, white, and grays gather at the center.",
    guide: "angle=hue / radius=chroma",
  },
  name: {
    title: "Nearest Color Name",
    body: "Shows the named color with the smallest color difference (ΔE) from the reference color — a handy way to describe a color in words.",
    guide: "smaller ΔE = closer to the name",
  },
  contrast: {
    title: "WCAG Contrast Ratio",
    body: "The ratio of two colors' relative luminance, defined by WCAG as a text readability criterion. Aim for AA 4.5:1 / AAA 7:1 for normal text and AA 3:1 / AAA 4.5:1 for large text.",
    guide: "1:1 (identical) – 21:1 (black × white)",
  },
  deltae: {
    title: "Color Difference ΔE",
    body: "The perceptual difference between two colors, computed with CIEDE2000. Smaller means more similar; below about 2 most people cannot tell them apart.",
    guide: "ΔE<2 nearly identical / >10 clearly different",
  },
  cvd: {
    title: "Color Vision Simulation",
    body: "Simulates how colors appear with protan, deutan, and tritan color vision, so you can check the scheme stays distinguishable.",
    guide: "P=red / D=green / T=blue weakness",
  },
  cmatrix: {
    title: "Contrast Ratio Matrix",
    body: "Pairwise contrast ratios across the whole palette — a quick overview of which color pairs are usable together. Bold means AA pass.",
    guide: "bold frame & text = 4.5:1 or higher",
  },
  dmatrix: {
    title: "ΔE Difference Matrix",
    body: "Perceptual color differences for every palette pair. Pairs with small values are confusably similar and hard to distinguish.",
    guide: "smaller value = more similar pair",
  },
  huedist: {
    title: "Hue Distribution",
    body: "Each palette color placed on a 0–360° hue axis, showing whether hues are skewed or balanced.",
    guide: "spread dots=varied / clustered=monotone",
  },
  harmony: {
    title: "Harmony Schemes",
    body: "Rotates the base color's hue to generate scheme candidates based on color theory: complementary, analogous, triadic, and more.",
    guide: "complementary=180° / analogous=±30° / triadic=120°",
  },
  tone: {
    title: "Tone Scale",
    body: "A tonal scale in the style of MUI-like color palettes: the base color sits at 500, stepping lighter to 50 and darker to 900.",
    guide: "50=lightest / 500=base / 900=darkest",
  },
  hueshift: {
    title: "Hue Shift",
    body: "Candidates that rotate only the hue in OKLCH while keeping the base color's lightness and chroma. The tone stays consistent while the hue changes, which makes this useful for exploring accent colors.",
    guide: "±30°=adjacent / ±150°–180°=near-complementary",
  },
};

export const HELP: Record<Locale, Record<string, HelpEntry>> = {
  ja: HELP_JA,
  en: HELP_EN,
};
