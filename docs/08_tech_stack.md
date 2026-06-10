# 08. 技術選定

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [制約・前提](./02_constraints.md) / [データモデルとカード契約](./05_data_model_and_card_contract.md) / [計算仕様](./07_card_calculation_specs.md)

確定スタックと、それを補完する追加ツールの提案。
追加ツールは **必須 / 推奨 / 任意** で優先度を示す。判断材料は [制約](./02_constraints.md)（DBレス・クライアント計算・プライバシー）と
[05](./05_data_model_and_card_contract.md)（計算レイヤ分離・URL状態・カード契約）。

---

## 1. 確定スタック

| 領域 | 採用 | 役割 |
|------|------|------|
| フレームワーク | **Next.js**（App Router） | 画面・ルーティング・静的アセット配信 |
| 状態管理 | **Zustand** | グローバル `palette / selection / mode`（[05 §2](./05_data_model_and_card_contract.md)） |
| スタイリング | **Tailwind CSS** | UI スタイル |
| 単体テスト | **Vitest** | `core/color` の計算・ロジック（[07 §10](./07_card_calculation_specs.md) の参照値） |
| バンドラ | **Turbopack** | 開発・ビルド |
| E2E | **Playwright** | 主要フローの結合テスト |
| ホスティング | **Vercel** | デプロイ・CDN |

> パッケージマネージャは既存 `package-lock.json` に従い **npm**（pnpm への移行は任意）。

---

## 2. 追加提案 ── 必須

これらが無いと MVP（[05 §8](./05_data_model_and_card_contract.md)）の品質・実装速度に直接効く。

| ツール | 用途 | 理由 |
|--------|------|------|
| **culori** | 色計算エンジン（変換/ΔE/OKLCH 等） | tree-shakeable・OKLCH/広色域対応。式は[07](./07_card_calculation_specs.md)で固定済みなので、`core/color` の薄いラッパ越しに使い、[07 §10]の参照値で検算。将来差し替え可 |
| **zod** | 静的アセット・URL状態のバリデーション | [06](./06_static_assets_schema.md)のJSONを読み込み時に検証、URLデコード（[05 §4](./05_data_model_and_card_contract.md)）を安全に。スキーマ崩れを早期検出 |
| **nuqs** | URL検索パラメータの型安全な同期 | `palette / mode` のURL状態（[05 §4]）を Next.js で宣言的に。共有リンクの中核 |
| **Radix UI Primitives**（または shadcn/ui） | アクセシブルなUI部品 | Dialog（確認ダイアログ [03 §6]）/ ToggleGroup（2軸モード [03 §3]）/ Tooltip・Popover（指標ヘルプ）。**自身がアクセシブルであること**（[02 §4]）の土台。shadcn/ui なら Radix+Tailwind で所有コードとして導入 |
| **react-colorful** | カラーピッカー | 約2.8kB・依存なし。どこからでも編集（[03 §6]）の入力UI |
| **lucide-react** | アイコン | 軽量・一貫したアイコンセット |
| **@testing-library/react** + **happy-dom** | コンポーネントテスト | Vitest 上でカード描画をテスト |
| **@axe-core/playwright** | アクセシビリティ自動検査 | アクセシビリティを評価するアプリ自身のa11yをCIで担保（[02 §4]） |
| **Prettier** + **prettier-plugin-tailwindcss** | 整形・クラス並べ替え | Tailwind クラス順を自動正規化。差分ノイズ低減 |
| **Husky** + **lint-staged** | pre-commit ゲート | コミット時に整形・型・lint を通す |
| **GitHub Actions** | CI | lint / typecheck / vitest / playwright / build を自動化 |

---

## 3. 追加提案 ── 推奨

あると開発体験・品質が上がるが、MVP直後でも可。

| ツール | 用途 | 補足 |
|--------|------|------|
| **Storybook** | カードの単独開発・カタログ化 | カード＝独立部品（[05 §6](./05_data_model_and_card_contract.md)）と相性良。視覚回帰の足場にも |
| **@vitest/coverage-v8** | カバレッジ | `core/color` の網羅性を可視化 |
| **TypeScript（tsc）型検査をCIに** | 型ゲート | Next 既定の型に加え、CIで `tsc --noEmit` |
| **Vercel Speed Insights / Analytics** | 軽量メトリクス | Cookieレス・プライバシー配慮（[02 §4]と整合）。導入は任意 |

---

## 4. 追加提案 ── 任意 / 将来

| ツール | 用途 | 備考 |
|--------|------|------|
| **Framer Motion (motion)** | モード切替・カード出現のアニメ | 仕上げ段階。過度な演出は避ける |
| **Serwist**（または next-pwa） | オフライン/PWA化 | [02 §4]の「オフライン耐性」を将来実現。静的アセット中心なので相性良 |
| **next-intl** | 多言語化 | 旧版に en/ja があった。表示ラベルは状態と分離済み（[05 §2]）なので後付け可能 |
| **colorjs.io** | 高精度色計算の検算用 | culori の結果照合や、未対応指標の参照実装に |
| **@bjornlu/colorblind 等** | 色覚シミュレーション参照 | [06 §5]の行列を自前実装する際の照合用 |

---

## 5. 主要な選定理由（要点）

- **culori を「エンジン」に、`core/color` を「契約」に**: 計算式は[07](./07_card_calculation_specs.md)で固定済み。ライブラリは内部実装にすぎず、参照値テストで挙動を保証 → 後から自前実装やcolorjs.ioに差し替え可能。
- **nuqs + zod で URL状態を堅牢に**: DBレスの共有手段（[02 §2.3]）はURLが生命線。型安全なエンコード/デコードとバリデーションで壊れにくくする。
- **Radix/shadcn + axe で「アクセシブルなアクセシビリティツール」**: 矛盾を作らないため、UI部品とCI検査の両面でa11yを担保。
- **計算とUIの分離をテストで固定**: Vitest（[07 §10]の参照値）でロジックを、Playwright+axeでフローとa11yを守る。

---

## 6. 想定ディレクトリ（技術選定の帰結）

```
src/
  app/                 # Next.js App Router（ページ・レイアウト＝アプリシェル）
  core/color/          # 計算レイヤ（フレームワーク非依存・culoriラッパ＋自前ロジック）
  store/               # Zustand ストア（palette/selection/mode）
  features/cards/      # カード群（CardDef レジストリ＋各カード）
  components/          # 共通UI（パレットバー・ピッカー・ダイアログ・shadcn部品）
  lib/                 # URL同期(nuqs)・アセット読み込み(zod検証)・ユーティリティ
public/data/           # 静的アセット（[06]のスキーマ）
```

---

## 7. 未決事項（次に詰める）

1. **shadcn/ui 採用の可否**（Radix 直叩き vs shadcn のコード所有モデル）。
2. **culori 採用の最終確認**（自前実装に振る範囲：[07]の式をどこまで自前にするか）。
3. CIワークフローの具体ジョブ構成（並列・キャッシュ・Playwright のブラウザ）。
4. Storybook 導入タイミング（スプリント1から or 後）。
