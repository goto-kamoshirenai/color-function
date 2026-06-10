# AGENTS.md — Color Follows Function

配色を「感覚」でなく「数値」で扱う、配色の検証・設計支援 Web アプリ。
このファイルは、本リポジトリで作業する AI エージェント／開発者の**入口**。着手前に必ず読むこと。

---

## 🚦 最初にやること（必読）

1. **[docs/README.md](./docs/README.md)** … 設計ドキュメントの索引。全体像はここから。
2. **[docs/12_tdd_workflow.md](./docs/12_tdd_workflow.md)** … 開発手順（TDD）。**実装は必ずこの手順に従う**。
3. **[docs/11_implementation_plan.md](./docs/11_implementation_plan.md)** … 何を・どの順で作るか（モジュール設計・スプリント）。
4. **[docs/10_design_reference.md](./docs/10_design_reference.md)** … UI/挙動の**基準**（確定モック `Color Follows Function v2.html`）。

> 迷ったら docs を正とする。本ファイルと docs が食い違う場合は docs の最新を優先し、本ファイルを直す。

---

## 開発の鉄則

1. **TDDで進める** — [docs/12](./docs/12_tdd_workflow.md) の Red→Green→Refactor を厳守。テストを先に書き、失敗を見てから実装する。出発点は `core/color`（S1）。
2. **デザイン基準は v2 モック** — `Color Follows Function v2.html`（[docs/10](./docs/10_design_reference.md)）。**モノクロUIベース＋ユーザー指定色を単一 `--accent` としてアプリ全体に適用**（a11y不足時は明度自動補正）。
3. **計算は精度仕様（自己流変更禁止）** — 色差=**CIEDE2000**、色覚=**Machado2009・線形RGB**、調和=**OKLCH色相回転**。式と期待値は [docs/07](./docs/07_card_calculation_specs.md) が正。
4. **アーキテクチャ規律** — 色の正準は **sRGB**。`core/color/*` は**純粋・フレームワーク非依存**。UIは状態を持たず、palette変更は **`apply()` 一本**（[docs/05](./docs/05_data_model_and_card_contract.md)/[docs/11](./docs/11_implementation_plan.md)）。
5. **自身がアクセシブルであること** — a11y を評価するツール自体が a11y であること。`@axe-core/playwright` を一級のテストとして扱う。
6. **DBを持たない** — 永続化なし。共有は URL ハッシュ（`#p=hex,hex`）、一時保存は localStorage（[docs/02](./docs/02_constraints.md)/[docs/10 §3](./docs/10_design_reference.md)）。
7. **コミット** — 詳細は [docs/13 コミット規約](./docs/13_commit_convention.md)（Conventional Commits 準拠）。
   - 作業は**常に適切な粒度でコミット**する（1コミット＝1つの論理的変更）。緑のサイクルが一区切りしたら確認なしで自動コミット。
   - **メッセージは規約に従う**: `<type>(<scope>): <要約>`（type=`feat`/`fix`/`docs`/`test`/`refactor`/`chore` 等）。
   - **push は禁止、コミットまで**で止める。
8. **言語** — ドキュメント・コミットメッセージ（要約）・テスト記述は日本語可。コード識別子は英語。

---

## 技術スタック

Next.js(App Router) / TypeScript / Zustand / Tailwind CSS / **react-aria-components**(UI部品·headless) /
culori(色計算エンジン) / zod(検証) / nuqs(URL) / lucide-react /
Vitest + Testing Library + happy-dom(単体·コンポーネント) / Playwright + @axe-core/playwright(E2E·a11y) /
Turbopack / Vercel。詳細は [docs/08](./docs/08_tech_stack.md)。

### コマンド（S0 scaffold 後に有効）

```bash
npm run dev          # 開発サーバ
npm run test:watch   # Vitest ウォッチ（TDDの主戦場）
npm run test         # 一括実行
npm run e2e          # Playwright（フロー/a11y）
npm run lint         # ESLint + Prettier
npm run typecheck    # tsc --noEmit
```

コミット前: `npm run lint && npm run typecheck && npm run test`（Husky/lint-staged でも担保）。

---

## ディレクトリ構成（[docs/11 §1](./docs/11_implementation_plan.md)）

```
src/
  app/            # Next.js App Router（シェル・ワークスペース）
  core/color/     # 計算レイヤ（純粋関数・TDDの中心）
  store/          # Zustand（palette/selection/mode/accent）
  features/cards/ # カード（CardDef レジストリ＋各カード）
  components/     # 共通UI（react-aria-components ベース）
  lib/            # URL同期・アセット読込(zod)・ユーティリティ
public/data/      # 静的アセット（色名/WCAG/調和/色覚。[docs/06]）
docs/             # 設計ドキュメント（正）
```

---

## 現在地

- フェーズ: **設計完了 → 実装着手前**。次は **S0（基盤scaffold）**（[docs/11 §6](./docs/11_implementation_plan.md)）。
- ブランチ: `feature/planning`。
- モック: `Color Follows Function v2.html`（現行・自己展開バンドル、ブラウザで閲覧可）。v1 は削除済み。
