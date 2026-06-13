# 06. テスト・コード品質・アーキテクチャ

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14

`pnpm test` は 28ファイル/178テスト全 PASS。core 純関数層・hooks 境界・class 不使用・any 不使用は
規約遵守で健全。一方、e2e の腐敗が CI で検出されず、registry↔LAYOUT の二重管理が構造的負債。

## 🐞 不具合

### <a id="bug-e2e-ci"></a>🔴 e2e「単色×検証」が現行レイアウトと不整合で失敗する＋e2e が CI 未組み込み

- **場所**: `e2e/workflow.spec.ts:53-58`（`最寄り色名` 見出しを期待）/ `.github/workflows/ci.yml`（`pnpm e2e` 無し）/ `.husky/pre-commit`（同）
- **内容**: 監査で確認 — テストは `最寄り色名`(nearest-name) の見出し表示を期待するが、`CardList.tsx` の `LAYOUT["single|verify"]` は `single-hero/hsv/luminance/spaces/perception/alpha/hue-wheel/gamut` のみで nearest-name/value を描画しない。よってこの e2e は落ちる（テスト名「5カード」も実描画8枚と矛盾＝旧仕様の遺物）。**CI は lint/format/knip/typecheck/test/build のみで Playwright を一切実行しない**ため、この腐敗も axe 検査も誰も気づかない。
- **改善方針**: e2e を現行レイアウトに修正（`色値` ヒーロー＋`HSV`/`相対輝度` 等を検証、`最寄り色名` 期待は削除、件数も実態へ）。CI に Playwright ジョブを追加（`playwright install --with-deps`→`PW_START=1` で build 成果物配信→`pnpm e2e`、最低 nightly か main マージ時）。

## ⚠️ 課題

### <a id="concern-dead-cards"></a>🟡 registry に残るが描画されない3カード（死にUI）

- **場所**: `src/features/cards/registry.ts`（`value` / `nearest-name` / `partner`）＋実装 `CardValue.tsx`/`CardNearestName.tsx`/`CardPartner.tsx`
- **内容**: いずれも `LAYOUT` に key が無く本番では永久に描画されない（`single-hero` が value/nearest-name を吸収、partner は設計から除外済み）。registry が import しているため **knip は未使用検出できない盲点**。`CardValue`/`CardPartner` はテスト0、`CardNearestName` だけ単体テストが「描画されないコンポーネント」を守っている。
- **改善方針**: 方針を docs/コメントで明記の上、(a) /learn 出典としてのみ必要なら `appliesTo` を外し別管理、(b) 不要なら registry エントリ＋実装＋テストを削除。少なくとも各エントリに「描画されない」コメントを付す。

### 🟡 registry と LAYOUT の二重管理（キー整合の保証が無い）

- **場所**: `src/features/cards/registry.ts` と `src/components/CardList.tsx:31-79`
- **内容**: 存在(registry)と配置(LAYOUT)が別ソースで、対応は実行時 `byKey.get(key)` 頼み。LAYOUT に typo/古い key があれば `if(!def) return null` で**無言で消える**。registry 追加＋LAYOUT 入れ忘れも気づけない（[死にカード](#concern-dead-cards)がまさにこれ）。整合テスト無し。
- **改善方針**: テスト追加 —「全 LAYOUT key が registry に存在」かつ「各 (unit,view) の registry 該当カードが LAYOUT に過不足なく出る（意図的除外はホワイトリスト）」。理想は `appliesTo` に配置情報を持たせ単一ソース化。

### 🟢 `renderedCount` が静的算出で実描画の空状態を反映しない

- **場所**: `src/components/CardList.tsx:97-99`
- **内容**: 「CARDS — N」は LAYOUT×registry 一致数の静的カウント。各カードが内部で空プレースホルダを出して実質非表示でも N は減らない。
- **改善方針**: 「レイアウト枠数」で良いなら定義をコメント明記（実カード数化は過剰）。

### 🟢 空状態プレースホルダの重複

- **場所**: `CardValue.tsx:52` / `CardNearestName.tsx:23-27` / `CardPartner.tsx:57-62` / `CardSingleHero.tsx:71-72` ほか多数
- **内容**: `<p className="text-text-3 font-mono text-xs">{t("card.empty")}</p>` 系がカード横断でコピペされクラスも微妙に揺れる。`needPair`/`needMatrix`/`needTwo` も同様。
- **改善方針**: `<CardEmpty messageKey="card.empty" />` 的な共通化（クラス統一＋テスト一元化）。

### 🟢 coverage 設定・閾値が無い

- **場所**: `vitest.config.ts:5-18`（coverage 設定なし）/ `package.json`（`test:cov` あるが CI 未実行）
- **内容**: `@vitest/coverage-v8` 導入済みだが閾値も計測も無い。設計カード十数枚（`CardGradient`/`CardMix`/`CardTokens`/`CardUiPreview`/`nudge`/`cvd-safe`/`complement`/`sort`/`templates` ほか）はロジック付きでも単体テスト皆無。
- **改善方針**: coverage provider/threshold を設定し CI に `test:cov` を追加。core 純関数層と分岐の多い設計カードを優先的にテスト。

### 🟢 ビジュアル回帰テストの不在

- **場所**: `e2e/*`
- **内容**: 複雑なグリッド（`md:grid-cols-*`）・テーマ透かし（color-mix）・カード見た目の回帰検出が無い。「見出しは出るがレイアウト崩れ」を捕捉できない。
- **改善方針**: Playwright `toHaveScreenshot()` を主要3モード×ライト/ダークで導入（差分は手動承認）。

## ✨ 機能追加・改善案

- **🟢 型アサーションの安全化**（any/unknown は皆無で良好）。`lib/theme.ts:20`(`dataset.theme as Theme`)・`ColorFormatSelect.tsx:27`・`ModeToggle.tsx:43` 等の DOM/react-aria Key 由来アサートを `isTheme()` 等の型ガード経由に統一（`colorFormat.ts:14` に既存ガードあり）。
- **🟢 未使用 i18n/help キーの検出**（ja↔en 網羅は型で保証済み）。`t("...")` リテラル走査で未使用 MessageKey/helpKey を検出する小テスト。`registry.test.ts` は helpKey→HELP は見るが逆（HELP→使用）は見ていない。未使用例: `palette.count`/`swatch.reorder*`、死にカード経由の `card.value.*`/`card.name.*`/`card.partner.*`。
- **🟢 命名規約の統一**。registry key ↔ helpKey ↔ i18n prefix ↔ title がアドホック（例 `ls-distribution`↔`lsdist`↔`card.lsdist.*`、`single-hero` が helpKey `value` を借用）。kebab の registry key を正として派生させ、ズレを registry.test で検査。

## このトピックの最重要

1. 🔴 [e2e「単色×検証」不整合＋e2e/axe が CI 未組み込み](#bug-e2e-ci)（`workflow.spec.ts:53-58` / `ci.yml`）
2. 🟡 [registry 残存の死にカード](#concern-dead-cards)（value/nearest-name/partner）
3. 🟡 registry↔LAYOUT 二重管理（整合テスト無し）
