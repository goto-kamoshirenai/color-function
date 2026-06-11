# Color Follows Function（CFF）

**感覚で扱われがちな「色」を、数値で判断できるようにする色彩定量解析ツール。**

コントラスト比・色差 ΔE・色覚シミュレーションなどの指標で配色を「検証」し、
トーン展開・調和スキーム・アクセシブル化ナッジなどで配色を「設計」する、
ブラウザ完結（クライアント計算のみ）の Web アプリです。

## 主な機能

操作は「**単位**（単色 / ペア / パレット）×**観点**（検証 / 設計）」の組み合わせで、
表示される指標カード（全 38 枚）が切り替わります。
[docs/04 カードカタログ](./docs/04_card_catalog.md) の全項目を実装済みです。

### 検証（Verify）

| 単位          | カード                                                                                                                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 単色 (9)      | 色値（RGB/HEX/HSL/HSV）/ HSV メーター / 相対輝度・対白黒コントラスト / 色相環 / 最寄り色名 / 拡張色空間（OKLCH・OKLab・CIELAB・CIELCH・XYZ・xy・HWB・CMYK）/ 知覚明度・色温度 / 不透明度 / ガマット・出力適合               |
| ペア (5)      | WCAG コントラスト比（AA/AAA 判定・可読性プレビュー）/ 色差 ΔE（CIEDE2000）/ 色覚シミュレーション（P/D/T型）/ APCA コントラスト（Lc）/ 色差の内訳（ΔE76/94/00・成分差）                                                      |
| パレット (13) | コントラスト比マトリクス / ΔE マトリクス / 色相分布・エントロピー / 明度・彩度分布 / 暖寒バランス / グレースケール耐性 / 色覚識別性 / 冗長性検出 / 役割カバレッジ / 調和スキーム判定 / UI モック・SVG・データビズプレビュー |

### 設計（Design・単位共通 16 枚）

調和スキーム生成 / 相手色提案 / トーン展開（50–900）/ 色相シフト /
明度・彩度バリエーション / 2色間グラデーション（sRGB・OKLab・HSV 補間）/
色のミックス / アクセシブル化ナッジ（AA/AAA 補正）/ 色覚セーフ提案 /
不足色の補完提案 / ダーク・ライト変換 / 並べ替え・正規化 /
セマンティックロール割当 / 色名検索 / 配色テンプレート /
デザイントークン出力（CSS 変数・Tailwind・JSON）

### 横断機能

- **学習コンテンツ（/learn）** — 指標別リファレンス・記事・書籍・ベンチツール・用語集。各カードの「?」（解説）と本マーク（参考資料）からも参照可能
- **共有 URL** — パレットは URL ハッシュに同期され、リンクを開くだけで再現
- **カラーコード** — 表示形式（HEX/RGB/HSL/HSV）をアプリ全体で切替、どこでもクリックコピー
- **テーマ / 言語** — ライト・ダーク、日本語・英語（設定メニューから切替、localStorage に保持）
- **アクセントカラー** — パレットの任意の色を UI の差し色に指定（a11y 自動補正つき）
- **PWA** — インストール可能（マニフェスト・アイコン整備済み）

## 技術スタック

- **Next.js 16**（App Router・Turbopack）+ **React 19** + **TypeScript**（strict、`any`/`unknown` 不使用）
- **Tailwind CSS v4**（`@theme` デザイントークン）・react-aria-components・motion・iconoir-react
- **zustand**（状態）・**culori**（OKLCH/ガマットマッピング）・**zod**（静的データ検証）
- すべての色計算は `src/core/color` の純関数（CIEDE2000 は Sharma 標準データ、APCA は既知値で検証）

詳細は [docs/08 技術スタック](./docs/08_tech_stack.md) と [docs/07 計算仕様](./docs/07_card_calculation_specs.md) を参照。

## 開発

```bash
pnpm install
pnpm dev            # 開発サーバー（http://localhost:3000）

pnpm test           # ユニットテスト（vitest）
pnpm e2e            # E2E + axe アクセシビリティ検査（Playwright。dev サーバー起動中に実行）
pnpm typecheck      # tsc --noEmit
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm knip           # 未使用コード検出
pnpm links:check    # 参考資料リンクの生存確認（手動メンテ用）
```

コミット時は husky + lint-staged が format → typecheck → test → knip を自動実行します。
コミット規約は [docs/13](./docs/13_commit_convention.md)（Conventional Commits・日本語）。

## ディレクトリ構成

```
src/
  app/            # App Router（/ と /learn、レイアウト、PWA マニフェスト）
  components/     # 共有 UI（ヘッダー・パレットバー・設定・ピッカー等）
  core/color/     # 色計算の純関数層（変換・コントラスト・色差・CVD・分析・提案）
  features/
    cards/        # 指標カード（registry 駆動）・ヘルプ・テンプレート
    learn/        # 学習コンテンツ画面
  data/           # 構造化データ（references.json・glossary.json）
  lib/            # i18n・テーマ・アセットローダー等
  store/          # zustand ストア（パレット・モード・ピッカー）
docs/             # 設計ドキュメント（コンセプト〜実装計画）
e2e/              # Playwright テスト
```

設計ドキュメントの入口は [docs/README.md](./docs/README.md)。

## 書籍リンクのアフィリエイト設定

/learn の書籍リンクは Amazon 検索 URL です。`src/data/references.json` の
`amazonAssociateTag` にアソシエイト ID（例: `"yourtag-22"`）を設定すると
アフィリエイトリンクになります（PR 注記は表示済み）。
