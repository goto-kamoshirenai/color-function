# 課題・改善ドキュメント（issues）

「Color Follows Function」を観点別に網羅監査した結果の索引。各トピックは
**🐞 不具合 / ⚠️ 課題 / ✨ 機能追加・改善案** の3分類で、`file:line` 付きで記録する。

- 監査日: 2026-06-14
- 対象ブランチ: `featrure/fix-ui`
- 重大度凡例: 🔴 高 / 🟡 中 / 🟢 低
- 注記: ここは「課題のカタログ」であり仕様書ではない。着手時は最新コードで再確認すること。

## トピック一覧

| #   | ドキュメント                                            | 主な領域                                                   |
| --- | ------------------------------------------------------- | ---------------------------------------------------------- |
| 01  | [accessibility.md](./01-accessibility.md)               | a11y（キーボード・ARIA・SR・コントラスト・reduced-motion） |
| 02  | [color-correctness.md](./02-color-correctness.md)       | 色計算の正しさ・数値堅牢性・spec 整合                      |
| 03  | [state-persistence.md](./03-state-persistence.md)       | ストア・URL/localStorage 永続化・SSR/復元                  |
| 04  | [ux-responsive-i18n.md](./04-ux-responsive-i18n.md)     | UX・レスポンシブ・デザイン一貫性・i18n                     |
| 05  | [pwa-performance-meta.md](./05-pwa-performance-meta.md) | PWA・パフォーマンス・メタ/SEO・ビルド                      |
| 06  | [testing-code-quality.md](./06-testing-code-quality.md) | テスト・死にコード・型安全・アーキテクチャ                 |

## 横断的に最優先で対処したい上位

1. 🔴 **共有リンク(`#p=`)を開くと localStorage の保存配色が即上書き消去される**（データ喪失）。→ [03](./03-state-persistence.md#bug-share-overwrite)
2. 🔴 **e2e が CI 未組み込み＋「単色×検証」e2e が現行レイアウトと不整合**（回帰検出が機能していない）。→ [06](./06-testing-code-quality.md#bug-e2e-ci)
3. 🔴 **UI モックプレビューのサンプル文言が日本語ハードコード**（英語UIで崩れる、規約違反）。→ [04](./04-ux-responsive-i18n.md#bug-uipreview-hardcode)
4. 🔴 **Service Worker 不在でインストール後オフライン起動不可**（静的志向 PWA の核が欠落）。→ [05](./05-pwa-performance-meta.md#bug-no-sw)
5. 🟡 **StoreSync が全状態変更で URL replaceState＋localStorage＋getComputedStyle を実行**（ピッカードラッグ等で INP 劣化）。→ [03](./03-state-persistence.md#concern-oversubscribe) / [05](./05-pwa-performance-meta.md)
6. 🟡 **無効モードボタンが `aria-disabled` のみで実際は操作可能・無反応**（SR/キーボードに「有効」と見える）。→ [01](./01-accessibility.md#bug-toggle-disabled)
7. 🟡 **registry に残るが描画されない死にカード（value/nearest-name/partner）＋ registry↔LAYOUT 二重管理**。→ [06](./06-testing-code-quality.md#concern-dead-cards)

## 監査の進め方（再現）

各トピックは独立したサブエージェントが該当コードを精読して作成。コードは未変更。
着手単位として、各 issue は「場所・内容・改善方針」を備えるためそのままタスク化できる。
