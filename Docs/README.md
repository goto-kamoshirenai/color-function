# Color Follows Function 仕様書

色/配色を分析する Web ツール「Color Follows Function」のアプリケーション仕様をまとめた資料です。

## このディレクトリの構成

| ファイル | 内容 |
|---|---|
| [README.md](./README.md) | 全体概要・目次（本ファイル） |
| [architecture.md](./architecture.md) | 技術スタック、ディレクトリ構成、ルーティング、状態管理 |
| [features.md](./features.md) | 9 種類の機能カード、モーダルパネル、共通 UI の仕様 |
| [libraries.md](./libraries.md) | ユーティリティ関数、定数、型定義、多言語対応 |
| [wcag.md](./wcag.md) | WCAG コントラスト比 / 相対輝度 / CIEDE2000 の計算式としきい値 |
| [calculations.md](./calculations.md) | WCAG 以外の計算仕様（HSV 変換、配色分析、色展開、CSV/Tailwind 等の入出力） |
| [personas.md](./personas.md) | 想定ユーザー像（ペルソナ）と機能フィット分析、プロダクト見直しの論点 |
| [requirements.md](./requirements.md) | 4 つのコア価値に基づく必要機能の洗い出しと優先度付きロードマップ |
| [ui-redesign-discussion.md](./ui-redesign-discussion.md) | UI 再設計の議論ベース。論点 A〜M の選択肢とトレードオフを整理 |
| [ui-design.md](./ui-design.md) | UI 設計の確定事項と派生論点。Web 開発メイン動線 + パネル組み替えの方針 |

## アプリ概要

- **名称**: Color Follows Function
- **目的**: 4 系統 × 2 段階（Main / Base / Accent / Text × A/B）の配色を設定し、コントラスト比・色差・輝度・分布などを多角的に分析して、UI 配色の妥当性を確認する Web ツール
- **画面構成**: シングルページアプリ。`/` のみがルートで、9 つの機能カードをサイドバーからトグルし、About / Contact / Help / MyColor はモーダルで重ねて表示する
- **対応言語**: 日本語（デフォルト）・英語
- **実行環境**: Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 3

## 配色モデル

アプリの全機能はこの 8 スロットの配色モデルに基づいて動作します（[src/store/myColorStore.ts](../src/store/myColorStore.ts)）。

| 役割 | A (通常) | B (ホバー/副色) |
|---|---|---|
| Main（主要色） | `mainColorA` | `mainColorB` |
| Base（背景色） | `baseColorA` | `baseColorB` |
| Accent（強調色） | `accentColorA` | `accentColorB` |
| Text（文字色） | `textColorA` | `textColorB` |

B 系列は任意。未設定時は A 系列にフォールバックします。

## 主な機能（詳細は [features.md](./features.md)）

1. **Template** — 10 種類のプリセット配色から一括適用
2. **ColorExtend** — 指定色から明度・彩度・色相バリエーションを自動生成
3. **PreviewSVG** — 7 種類の UI レイアウト（ダッシュボード / ブログ / EC 等）で配色プレビュー
4. **Contrast** — WCAG 2.2 コントラスト比判定
5. **RelativeLuminance** — WCAG 相対輝度の計算と 5 段階レベル判定
6. **CIEDE2000** — 全 8 色間の知覚色差マトリクス
7. **Entropy** — 色相/彩度/明度のエントロピー分析と配色評価
8. **HSV** — 各色の HSV 値を色相環・メーターで可視化
9. **CSV** — 6 形式（CSV / Tailwind JS・TS / CSS / SASS / JSON）で入出力

## 起動・ビルド

```bash
pnpm install
pnpm dev      # 開発サーバ
pnpm build    # 本番ビルド
pnpm lint     # Lint
pnpm knip     # 未使用コード検出
```

パッケージマネージャは pnpm に移行済みです。コミット規約は [../Agents.md](../Agents.md) 参照。
