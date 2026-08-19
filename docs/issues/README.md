# 課題・改善ドキュメント（issues）

「Color Follows Function」を観点別に網羅監査した結果の索引。各トピックは
**🐞 不具合 / ⚠️ 課題 / ✨ 機能追加・改善案** の3分類で、`file:line` 付きで記録する。

- 監査日: 2026-06-14 / 一括対応: 2026-08-19（下記「対応状況」）
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

## 対応状況（2026-08-19 の一括対応）

上位7件を含む 🐞不具合 / ⚠️課題 はすべて対応済み。主な内容:

| トピック         | 対応                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 a11y          | 単位トグルの真の無効化・スウォッチ並べ替えの SR 通知・スプラッシュのモーダル化（フォーカストラップ/初期フォーカス/背後 inert）・マトリクスの表セマンティクス化・`::selection` のアクセント連動・スキップリンク・FG/BG ヒントの Popover 化・axe を moderate まで＋オーバーレイ/`/learn`/スプラッシュへ拡張・キーボード操作の e2e |
| 02 色計算        | 変換入口での RGB 正規化と CMYK の 0除算ガード・無彩色を色相0°に集計しない・調和スキーム判定の双方向マッチ・明度探索の二分法＋両方向比較（8bit 量子化後で判定）・CCT の妥当域ガード・境界/null 分岐のテスト・色相ヘルパ集約・印刷近似の限界注記                                                                                  |
| 03 状態/永続化   | 共有リンクが保存配色を上書きする問題の解消・購読を配色変化に限定＋150ms デバウンス・テーマ変更時のアクセント再補正・復元カバーをカード領域へ拡張・復元時の単位再計算・色数上限・`randomUUID` フォールバック・副作用層と永続化のテスト                                                                                           |
| 04 UX/i18n       | UI モック文言の i18n 化・共有リンクのコピー導線・「UI アクセント」と accent ロールの用語分離・ヘッダー高トークン集約・空/不足状態の共通化と出し分け・SVG プレビューの図形間引き・未使用文言キーの削除と en 可算表現の統一・`/learn` 末尾の戻り導線・コーチマークの矢を ＋ へ                                                    |
| 05 PWA/性能/メタ | Service Worker（アプリシェル＋静的データのプリキャッシュ）とオフライン起動 e2e・`metadataBase`/canonical/OG/Twitter/動的 OG 画像/robots/sitemap・マニフェスト補完（scope/lang/categories/shortcuts/screenshots）・静的データのビルド同梱（fetch 廃止）・マトリクスと最寄り色名のメモ化・セキュリティヘッダ                      |
| 06 テスト/品質   | CI に e2e（本番ビルド配信）とカバレッジ閾値を追加・死にカード（value/nearest-name/partner）の削除・registry↔LAYOUT の整合テスト・`CardEmpty` 共通化・未使用文言キー検出テスト・型アサーションを型ガードへ・設計カードのロジックテスト                                                                                           |

### 意図的に見送った項目（理由付き）

- **01 ✨ スウォッチ並べ替えを react-aria `GridList`+`useDragAndDrop` へ**: UI の作り直しになる規模。←→ キー操作＋ライブリージョン通知＋フォーカス追従で機能面は担保したため、置換は独立タスクとする。
- **03 🟢 複数タブ同期**: last-write-wins を維持（`lib/urlState.ts` に明記）。編集中のタブへ他タブの値を割り込ませる方が害が大きい。
- **03 🟡 役割・ビュー・選択の永続化**: 共有対象は「色と並び順」のみという方針を明文化（`lib/urlState.ts`）。復元側は reconcile / clampUnit で整える。
- **03 🟢 en ユーザーの初回ペイントでの日本語フラッシュ**: SSR を ja 固定のまま維持（重要度低）。言語別 URL を持たないため hreflang は `x-default` のみ付与。
- **05 🟢 サーバーコンポーネント化 / `LazyMotion`**: マストヘッドを含む表示要素がモード状態（クライアント）に依存するため分割の利得が薄い。`optimizePackageImports` を試したがバンドル出力はバイト単位で同一（Turbopack が既に tree-shaking 済み）だったため設定は入れていない。スプラッシュは初期表示そのものなので motion の遅延読み込みも不適。
- **05 🟢 計測の導入（Speed Insights / web-vitals / Lighthouse CI）**: 依存追加と外部送信の是非（docs/02 §4 のプライバシー方針）に判断が必要。
- **05 🟢 `appleWebApp.startupImage`**: 端末別スプラッシュ画像の生成が前提。`background_color` は設定済み。
- **06 🟢 ビジュアル回帰（`toHaveScreenshot`）**: ベースラインは CI(Linux) で生成する前提。現状は `layout.spec.ts` の幾何検査（横スクロール・枠外漏れ）で崩れを検出している。
- **06 ✨ 命名規約の統一（helpKey の短縮形リネーム）**: 文言・参考資料データの移行を伴うため、対応関係と新規カードの方針を `registry.ts` に明記するに留めた。

## 監査の進め方（再現）

各トピックは独立したサブエージェントが該当コードを精読して作成。
各 issue は「場所・内容・改善方針」を備えるためそのままタスク化できる。行番号は
監査時点のものなので、着手時は最新コードで再確認すること。
