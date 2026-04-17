# ライブラリ・定数・多言語

## src/libs/

### colorUtils.ts

色変換と配色パレット分析のユーティリティ群。

| 関数 | 概要 |
|---|---|
| `hexToRgb(hex)` | HEX → `{ r, g, b }` |
| `rgbToHsv(r, g, b)` | RGB → `{ h, s, v }` |
| `hexToHsv(hex)` | HEX → HSV 直変換 |
| `formatHsv(hsv)` | `"H:0° S:0% V:0%"` 形式 |
| `calculateEntropy(values, maxValue)` | 値の分布エントロピー |
| `calculateColorDistance(colors)` | chroma-js の色距離の平均 |
| `calculateColorMetrics(colors)` | 色相・彩度・明度のエントロピー |
| `getColorEvaluationText(metrics)` | スコアから評価文を生成 |
| `analyzeColorPalette(colors)` | 多様性・統一性・バランス・総合エントロピーを返し、「統一感 / バランス / カラフル」等のカテゴリに分類 |

`CardEntropy` / `CardHSV` から主に使用されます。

### relativeLuminance.ts

WCAG 2.0 の相対輝度計算。

| 関数 | 概要 |
|---|---|
| `calculateRelativeLuminance(color)` | HEX → 相対輝度（0〜1） |
| `getLuminance(r, g, b)` | RGB 版 |
| `formatLuminance(luminance)` | 小数 3 桁文字列 |
| `getLuminanceLevel(luminance)` | 5 段階レベル判定 |
| `getLuminanceBackgroundColor(luminance)` | バッジ用 Tailwind クラスを返す |

### wcag.ts

| 関数 | 概要 |
|---|---|
| `getContrastRatio(color1, color2)` | `(L₁+0.05) / (L₂+0.05)` によるコントラスト比 |
| `getWCAGLevel(ratio, isLargeText)` | `"AAA"` / `"AA"` / `"不適合"` 判定 |
| `formatContrastRatio(ratio)` | `"X:1"` 形式フォーマット |

### colorExport.ts

設定の入出力。

- `type ExportFormat = "csv" \| "tailwind-js" \| "tailwind-ts" \| "css" \| "sass" \| "json"`
- `generatePreviewContent(colors, format)` — プレビュー文字列を生成
- `exportColorSettings(colors, format)` — Blob を生成しブラウザでダウンロード
- `parseColorSettings(csvText)` — インポートされた CSV をパース

## src/const/

### colorConst.ts

- **デフォルト値**
  - `defaultMainColor = "#000000"`
  - `defaultBaseColor = "#a3a3a3"`
  - `defaultAccentColor = "#2EA9DF"`
  - `defaultTextColor = "#000000"`
- **colorTemplate**: 10 種のプリセット配色。各要素は `{ id, name, mainA, mainB, baseA, baseB, accentA, accentB, textA, textB }` の形。Template カードから参照され、適用時に `myColorStore` を一括更新

## src/types/

### common.d.ts

- `TranslationType` — `common.json` の JSON 構造を `typeof` で拾った型
- `HelpPanelKey` — `null | "expend" | "contrast" | "cie2000" | "hsv" | "entropy" | "preview" | "luminance"`

### delta-e.d.ts

`chroma-js` の `deltaE` 拡張型定義。

## src/contexts/

### TranslationContext.tsx

- **Context**: `{ t, locale, setLocale, isLoading }`
- **Hook**: `useTranslation()`
- **初期化**: デフォルトで `public/locales/ja/common.json` を fetch
- **言語切り替え**: `setLocale("ja" | "en")` で対応 JSON を再取得

## 多言語対応

### 対応ロケール

[public/locales/](../public/locales/) 配下に 2 言語分の辞書を配置。

- `ja/common.json` — 日本語（デフォルト）
- `en/common.json` — 英語

### 主な翻訳キー階層

- `page.{home,about,contact}` — ナビゲーション
- `title.*` — 各機能のタイトル
- `sidebar.*` — サイドバーのボタンラベル（9 カード + MyColor）
- `csv.{import,export,exportBtn}` — CSV カード UI
- `description.ciede2000` — 機能解説
- `about.description1`〜`description9` — About モーダル本文
- `help.{expend,contrast,ciede2000,...}.*` — 各ヘルプモーダル本文

## 外部サービス

### EmailJS

- 用途: ContactPanel の送信
- SDK: `@emailjs/browser`
- 必要な環境変数:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

他の外部 API は利用していません。配色解析はすべてクライアントサイドで完結します。
