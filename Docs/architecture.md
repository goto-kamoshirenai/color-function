# アーキテクチャ

## 技術スタック

| 分類 | 採用技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router) | ^16.2.4 |
| UI ライブラリ | React / React DOM | ^19.0.0 |
| 言語 | TypeScript | ^5 |
| スタイル | Tailwind CSS | ^3.3.0 |
| 状態管理 | Zustand | ^5.0.3 |
| アニメーション | Framer Motion | ^12.4.7 |
| 色計算 | chroma-js / tinycolor2 / delta-e / color-contrast-checker | - |
| カラーピッカー | @uiw/react-color / @uiw/react-color-wheel | ^2.4.1 |
| アイコン | react-icons | ^5.5.0 |
| メール送信 | @emailjs/browser | ^4.4.1 |
| クラス名結合 | clsx | ^2.1.1 |
| パッケージ管理 | pnpm | - |
| 未使用コード検出 | knip | ^6.4.1 |

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router エントリ
│   ├── layout.tsx         # RootLayout（フォント / Layout ラップ）
│   ├── page.tsx           # ホーム（全カードのトグル表示）
│   └── globals.css        # グローバル CSS
├── components/
│   ├── layout/            # Layout / Header / Sidebar
│   ├── elements/          # PanelWrapper / ColorChip / HueWheel 等の共通 UI
│   └── feature/           # 機能単位のコンポーネント
│       ├── card/          # 9 種類の機能カード
│       ├── my-color/      # 配色設定パネル
│       ├── about/         # About モーダル
│       ├── contact/       # Contact モーダル
│       ├── help/          # ヘルプモーダル群
│       └── preview/svg/   # PreviewSVG 用の SVG レイアウト
├── contexts/
│   └── TranslationContext.tsx  # 多言語コンテキスト
├── libs/
│   ├── colorUtils.ts      # 色変換・エントロピー計算
│   ├── relativeLuminance.ts
│   ├── wcag.ts
│   └── colorExport.ts     # 6 形式の出力/取込
├── store/                 # Zustand ストア
│   ├── myColorStore.ts
│   ├── panelStore.ts
│   └── helpPanelStore.ts
├── const/
│   └── colorConst.ts      # デフォルト色・10 種テンプレート
└── types/
    ├── common.d.ts
    └── delta-e.d.ts
```

## ルーティング

App Router による単一ルート構成です。

- `/` — 唯一のページ。サイドバーのトグルで 9 カードを表示切り替え、About / Contact / Help はモーダルで重ねます（[src/app/page.tsx](../src/app/page.tsx)）
- `/_not-found` — Next.js が自動生成

外部パスは存在せず、ナビゲーションはすべてモーダル / パネルで完結します。

## レイアウト階層

```
RootLayout (src/app/layout.tsx)
└── Layout (src/components/layout/Layout.tsx)
    ├── TranslationProvider          ← 言語切替の Context
    ├── SplashScreen                 ← 起動時 1 秒
    ├── Header                       ← 右上メニュー（Home / About / Contact）
    ├── Sidebar                      ← 左側カードトグル群
    └── page.tsx (Home)
        ├── <CardTemplate />         ← 各 isShow*Panel フラグで表示制御
        ├── <ColorExtend />
        ├── <CardPreviewSVG />
        ├── <CardContrast />
        ├── <CardRelativeLuminance />
        ├── <CardCIEDE2000 />
        ├── <CardEntropy />
        ├── <CardHSV />
        ├── <CardCSV />
        ├── <MyColorButton /> + <MyColorPanel />
        ├── <AboutPanel />
        ├── <ContactPanel />
        └── renderHelpPanel()        ← helpPanelKey に応じたヘルプ
```

## 状態管理（Zustand）

### 1. myColorStore（[src/store/myColorStore.ts](../src/store/myColorStore.ts)）

配色の中央ストア。アプリのあらゆる色はここから読み出されます。

**状態**
- `mainColorA` / `mainColorB`
- `baseColorA` / `baseColorB`
- `accentColorA` / `accentColorB`
- `textColorA` / `textColorB`

**主要アクション**
- `set<Role><A|B>(color)` — 各スロットの設定
- `get<Role>Color()` — A の取得
- `getHover<Role>Color()` — B があれば B、無ければ A にフォールバック
- `getBorderColor()` — `baseColorB ?? textColorA`
- `resetMyColorStore()` — デフォルト値に戻す

DevTools 拡張で `MyColorStore` 名称で監視可能。

### 2. panelStore（[src/store/panelStore.ts](../src/store/panelStore.ts)）

UI の表示フラグ。すべて boolean。

**モーダル/パネル系**
- `isMyColorPanelOpen`
- `isAboutPanelOpen`
- `isContactPanelOpen`
- `isNavigationOpen`

**カード表示系（初期値 true: Contrast / ColorExtend / PreviewSVG、他は false）**
- `isShowCardContrastPanel`
- `isShowCardHSVPanel`
- `isShowCardCSVPanel`
- `isShowCardEntropyPanel`
- `isShowColorExtendPanel`
- `isShowCardCIEDE2000Panel`
- `isShowCardPreviewSVGPanel`
- `isShowCardRelativeLuminancePanel`
- `isShowCardTemplatePanel`

`closeAllPanels()` で全モーダルを一括クローズします。

### 3. helpPanelStore（[src/store/helpPanelStore.ts](../src/store/helpPanelStore.ts)）

ヘルプモーダルの表示制御。

- `isHelpPanelOpen: boolean`
- `helpPanelKey: HelpPanelKey` — `"expend" | "contrast" | "cie2000" | "hsv" | "entropy" | "preview" | "luminance" | null`
- `openHelpPanel(key)` / `closeHelpPanel()`

`page.tsx` の `renderHelpPanel()` が `helpPanelKey` を switch して対応するヘルプコンポーネントを描画します。

## データフロー

```
[ ユーザ操作 ]
   ↓
[ MyColorPanel / CardTemplate / CardCSV 読込 ]
   ↓
[ myColorStore.set*() ]
   ↓
[ 各カード（useMyColorStore）が再レンダリング ]
   ↓
[ libs/ の計算関数で分析値を算出 ]
   ↓
[ ColorChip / HueWheel / ValueMeter / SVG で可視化 ]
```

配色は単方向で流れ、各カードは派生値を計算するだけのステートレスな表示層として振る舞います。
