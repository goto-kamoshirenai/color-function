# 機能仕様

画面上で操作できる機能を、機能カード → モーダル → 共通 UI の順で記述します。

## 機能カード一覧

すべて [src/components/feature/card/](../src/components/feature/card/) 配下にあります。`PanelWrapper` で共通の枠（タイトル + ヘルプアイコン）に包まれ、サイドバーのトグルで表示/非表示を切り替えます。

### 1. Template（配色テンプレート）

- **ファイル**: [CardTemplate.tsx](../src/components/feature/card/CardTemplate.tsx)
- **テンプレート定義**: [src/const/colorConst.ts](../src/const/colorConst.ts) の `colorTemplate`（10 種類）
- **機能**:
  - 10 種のプリセット配色（Google 風 / ミント / ピンク / ベージュ / ダーク / ティール / インディゴ / オリーブ / イエローなど）をカード表示
  - 「適用」で 8 色すべてを `myColorStore` に一括セット
  - 各色の HEX をコピー可能

### 2. ColorExtend（色の展開）

- **ファイル**: [ColorExtend.tsx](../src/components/feature/card/ColorExtend.tsx)
- **関連**: [ColorVariationRow.tsx](../src/components/feature/card/ColorVariationRow.tsx), [ColorMenu.tsx](../src/components/feature/card/ColorMenu.tsx)
- **機能**:
  - 8 色の中から 1 色を選択
  - tinycolor2 で明度・彩度・色相方向のバリエーションを自動生成
  - 生成色をメニューから任意スロットに置き換え適用できる
- **ヘルプキー**: `"expend"`（[HelpExpend.tsx](../src/components/feature/help/HelpExpend.tsx)）

### 3. PreviewSVG（配色プレビュー）

- **ファイル**: [CardPreviewSVG.tsx](../src/components/feature/card/CardPreviewSVG.tsx)
- **SVG レイアウト**: [src/components/feature/preview/svg/](../src/components/feature/preview/svg/) に 14 ファイル（本体 7 種 + サイドバー連動 7 種）
- **機能**:
  - 設定中の配色で実際の UI モックを即時プレビュー
  - 7 種のレイアウト: レイアウト比率 / アート / ブログ / シンプル / ダッシュボード / モバイル / EC
- **ヘルプキー**: `"preview"`

### 4. Contrast（WCAG コントラスト）

- **ファイル**: [CardContrast.tsx](../src/components/feature/card/CardContrast.tsx)
- **計算ロジック**: [src/libs/wcag.ts](../src/libs/wcag.ts) — 詳細は [wcag.md](./wcag.md) 参照
- **機能**:
  - 相対輝度からコントラスト比 `(L1+0.05)/(L2+0.05)` を算出
  - WCAG 2.1 / 2.2 の基準（AAA ≥ 7.0 / AA ≥ 4.5 / 不適合）で判定
  - Text × (Main/Base/Accent) の A/B 組合せをマトリクス表示
- **ヘルプキー**: `"contrast"`

### 5. RelativeLuminance（相対輝度）

- **ファイル**: [CardRelativeLuminance.tsx](../src/components/feature/card/CardRelativeLuminance.tsx)
- **計算ロジック**: [src/libs/relativeLuminance.ts](../src/libs/relativeLuminance.ts) — 詳細は [wcag.md](./wcag.md) 参照
- **機能**:
  - WCAG 2.0 定義の相対輝度（0-1）を算出
  - 5 段階（非常に明るい / 明るい / 中程度 / 暗い / 非常に暗い）でレベル判定し、`bg-blue-100`〜`bg-blue-500` のバッジで表示
  - 各色ごとに値とレベルを一覧
- **ヘルプキー**: `"luminance"`

### 6. CIEDE2000（色差マトリクス）

- **ファイル**: [CardCIEDE2000.tsx](../src/components/feature/card/CardCIEDE2000.tsx)
- **計算**: `chroma-js` の `deltaE`（CIEDE2000）を使用 — しきい値詳細は [wcag.md](./wcag.md) 参照
- **機能**:
  - 8 色の総当たり色差をマトリクスで表示
  - ΔE₀₀ ≥ 5.0 「明確な差」 / ≥ 2.0 「認識可能」 / < 2.0 「差が小さい」の 3 段階バッジ
- **ヘルプキー**: `"cie2000"`

### 7. Entropy（分布分析）

- **ファイル**: [CardEntropy.tsx](../src/components/feature/card/CardEntropy.tsx)
- **計算ロジック**: [src/libs/colorUtils.ts](../src/libs/colorUtils.ts) の `analyzeColorPalette`
- **機能**:
  - 色相分布（円形）・彩度×明度分布（2D）を SVG で描画
  - 色相多様性・彩度統一性・明度バランス・総合エントロピーを計算
  - スコアから「統一感 / バランス / カラフル」などのカテゴリ判定と評価文を生成
- **ヘルプキー**: `"entropy"`

### 8. HSV（HSV 分析）

- **ファイル**: [CardHSV.tsx](../src/components/feature/card/CardHSV.tsx)
- **表示**: 各色の HSV 値を [HueWheel.tsx](../src/components/elements/HueWheel.tsx)（色相環）と [ValueMeter.tsx](../src/components/elements/ValueMeter.tsx)（彩度・明度メーター）で可視化
- **ヘルプキー**: `"hsv"`

### 9. CSV（設定の入出力）

- **ファイル**: [CardCSV.tsx](../src/components/feature/card/CardCSV.tsx)
- **変換ロジック**: [src/libs/colorExport.ts](../src/libs/colorExport.ts)
- **機能**:
  - **エクスポート**（6 形式）
    | 形式 | 出力ファイル |
    |---|---|
    | CSV | `color-settings.csv` |
    | Tailwind (JS) | `tailwind.config.js` |
    | Tailwind (TS) | `tailwind.config.ts` |
    | CSS 変数 | `color-settings.css` |
    | SASS 変数 | `color-settings.scss` |
    | JSON | `color-settings.json` |
  - **プレビュー**: 選択した形式での出力内容を画面で確認
  - **インポート**: CSV ファイルをドラッグ & ドロップで読み込み、8 色を一括反映

## モーダル/パネル

### MyColorPanel（配色設定）

- **ファイル**: [my-color/MyColorPanel.tsx](../src/components/feature/my-color/MyColorPanel.tsx)
- **関連**: [MyColorButton.tsx](../src/components/feature/my-color/MyColorButton.tsx), [ColorInput.tsx](../src/components/feature/my-color/ColorInput.tsx)
- **機能**: 4 役割 × 2 段階の計 8 色を `@uiw/react-color` のピッカーで個別設定

### AboutPanel

- **ファイル**: [about/AboutPanel.tsx](../src/components/feature/about/AboutPanel.tsx)
- **内容**: アプリコンセプト「色彩は機能に従う」の説明。翻訳キー `about.description1`〜`description9`

### ContactPanel

- **ファイル**: [contact/ContactPanel.tsx](../src/components/feature/contact/ContactPanel.tsx)
- **送信**: EmailJS（`@emailjs/browser`）
- **環境変数**:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- **フォーム項目**: 名前 / メールアドレス / 本文

### Help モーダル群

- **ファイル**: [help/](../src/components/feature/help/) の 7 ファイル
  - `HelpExpend` / `HelpContrast` / `HelpCIEDE2000` / `HelpHSV` / `HelpEntropy` / `HelpPreview` / `HelpLuminance`
- **起動**: 各カードの `PanelWrapper` のヘルプアイコン → `helpPanelStore.openHelpPanel(key)`
- **描画**: `page.tsx` の `renderHelpPanel()` が `helpPanelKey` を switch

### SplashScreen

- **ファイル**: [elements/SplashScreen.tsx](../src/components/elements/SplashScreen.tsx)
- **表示時間**: 1000ms
- **演出**: Framer Motion でスケール 0.7→1
- **ロゴ**: `/public/color-function_big-logo.svg`

## レイアウト系コンポーネント

| ファイル | 役割 |
|---|---|
| [Layout.tsx](../src/components/layout/Layout.tsx) | TranslationProvider / SplashScreen / Header / Sidebar を組み合わせる |
| [Header.tsx](../src/components/layout/Header.tsx) | ロゴクリックでメニュー開閉。Framer Motion でアニメーション、Home / About / Contact |
| [Sidebar.tsx](../src/components/layout/Sidebar.tsx) | 9 カード + MyColor ボタン。スクロール必要時は `scrollable-container` クラスが付与される |

## 共通 UI 要素

すべて [src/components/elements/](../src/components/elements/) に配置。

| ファイル | 役割 |
|---|---|
| `PanelWrapper` | カード外枠（タイトル / ヘルプアイコン） |
| `ModalWrapper` | モーダル背景と閉じるボタン |
| `HelpWrapper` | ヘルプ専用モーダル枠 |
| `ColorChip` | 色見本 + ラベル表示（`sm` / `md`） |
| `HueWheel` | 色相環 |
| `ValueMeter` | 縦型の 0-100% メーター（100 目盛 + マーカー） |
| `CommonButton` | 共通スタイルボタン（ホバーで mainB/accentA に切替） |
| `SlashIcon` | スラッシュ装飾アイコン |
| `SplashScreen` | 起動演出 |
