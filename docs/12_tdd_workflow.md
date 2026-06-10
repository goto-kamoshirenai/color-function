# 12. TDD 開発手順書

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [実装ロードマップ](./11_implementation_plan.md) / [計算仕様](./07_card_calculation_specs.md) / [技術選定](./08_tech_stack.md)

本プロジェクトは **テスト駆動開発（TDD）** で進める。本書はその手順・規律・レイヤ別戦略を定める**正の手順書**。
実装に着手する AI／開発者は、着手前に本書を読み、Red→Green→Refactor を厳守すること。

---

## 1. 原則

- **テストを先に書く**。失敗（Red）を確認してから実装する。
- **最小実装で通す**（Green）。テストを通す以上のことをしない。
- **緑のままリファクタ**（Refactor）。挙動を変えずに整える。テストが安全網。
- **1サイクル＝小さく**。1つの振る舞いごとにループを回す。
- 計算系（`core/color`）は[07 §10](./07_card_calculation_specs.md)の**参照値**を正とする。式の自己流変更は禁止（決定済み: CIEDE2000 / Machado2009 / OKLCH）。

---

## 2. 基本ループ（Red → Green → Refactor）

```
1. Red      失敗するテストを1つ書く（期待値は仕様/参照値から）
            → `npm run test:watch` で赤を確認
2. Green    そのテストだけを通す最小コードを書く
            → 緑を確認
3. Refactor 重複除去・命名整理・抽出。挙動は変えない
            → 緑を維持
4. Commit   1つの振る舞いが緑で揃ったら自動コミット（push しない）
            → 次の振る舞いへ
```

> 迷ったら「次に増やす最小の振る舞いは何か」を1つ選び、その期待値をテストにする。

---

## 3. レイヤ別テスト戦略

| レイヤ | 道具 | TDDの濃さ | 何をテストするか |
|--------|------|----------|----------------|
| `core/color`（計算） | Vitest | **完全TDD** | 変換・コントラスト・ΔE2000・CVD・調和・アクセント補正。[07 §10]の参照値・CIEDE2000 Sharma34組 |
| `store`（Zustand） | Vitest | **完全TDD** | `apply` 一本化、`selectColor`のペア挙動、`setAccent`、選択補正、URL同期の入出力 |
| `features/cards`・`components` | Vitest + Testing Library + happy-dom | 振る舞いをTDD | 描画・コピー・ヘルプ開閉・モード別表示。スナップショット偏重にしない |
| フロー / a11y | Playwright + @axe-core/playwright | シナリオ後追い可 | 「色を入れる→検証→共有URL復元」、キーボード操作、axe 違反ゼロ |

- **計算とストアは純粋ロジック**なので最も TDD に向く。ここを厚く。
- UI は「ユーザーに見える振る舞い」をテストする（実装詳細・クラス名に依存しない）。
- アクセシビリティは axe を**自動テストの一級市民**として扱う（自身がアクセシブルであるための担保 [02 §4]）。

---

## 4. 1サイクルの具体手順（コマンド）

> スクリプトは S0（[11 §6](./11_implementation_plan.md)）で `package.json` に定義する。以下は確定予定の名前。

```bash
npm run test:watch     # Vitest ウォッチ（TDDの主戦場）
npm run test           # 一括実行（CI相当）
npm run test:cov       # カバレッジ（core/color の網羅確認）
npm run e2e            # Playwright（フロー/a11y）
npm run lint           # ESLint + Prettier 検査
npm run typecheck      # tsc --noEmit
npm run dev            # 開発サーバ（Turbopack）
```

1コミット前のローカル確認: `npm run lint && npm run typecheck && npm run test`（Husky/lint-staged が pre-commit でも担保）。

---

## 5. テストの書き方（規約）

- **配置**: 実装と同階層に `*.test.ts`（例 `core/color/contrast.test.ts`）。E2E は `e2e/`。
- **構成**: Arrange–Act–Assert。1テスト＝1振る舞い。説明的な `describe/it`（日本語可）。
- **参照値の出典明記**: 期待値には根拠コメント（例 `// WCAG: #000 on #fff = 21.00`、`// Sharma 2000 pair #12`）。
- **境界・異常系**: 不正HEX→null、無彩色の色相、コントラスト1.0/21.0、ΔE 同色=0 などを必ず1ケース。
- **浮動小数**: `toBeCloseTo(expected, 精度)` を使う（[07 §1] 内部は丸めない）。
- **fixture**: CIEDE2000 標準34組などは `core/color/__fixtures__/` に表として置き、ループで照合。

例:
```ts
// core/color/contrast.test.ts
describe('contrastRatio', () => {
  it('黒×白は 21.00（WCAG 既知値）', () => {
    expect(contrastRatio(parseHex('#000000')!, parseHex('#ffffff')!)).toBeCloseTo(21, 2);
  });
  it('同色は 1.00', () => {
    const c = parseHex('#777777')!;
    expect(contrastRatio(c, c)).toBeCloseTo(1, 5);
  });
});
```

---

## 6. 作業単位とコミット

- **作業単位** = [11 §6](./11_implementation_plan.md) のスプリント内の「1カード」「1関数群」「1ストアアクション」程度の粒度。
- **コミット方針**（[memory: 自動コミット方針]）: 作業（緑のサイクル）が一区切りしたら**確認なしで自動コミット、push はしない**。
- メッセージは日本語、prefix（`ADD`/`FIX`/`TEST`/`REFACTOR`/`DOCS`）＋要点。
- 1コミットは「テスト＋それを通す実装」をまとめてよい（Red単独コミットはしない）。

---

## 7. TDDの規律（やってはいけないこと）

- ❌ 実装を先に書いてからテストを後付けする（振る舞いの設計機会を失う）。
- ❌ 1サイクルで複数の振る舞いを盛る。
- ❌ 参照値・式を「テストを通すために」歪める（仕様が正、[07](./07_card_calculation_specs.md)）。
- ❌ 実装詳細（内部クラス名・DOM構造）に強く結合したテスト。
- ❌ 赤を放置して次へ進む。常に緑に戻してからコミット。

---

## 8. スプリント別 TDD 着手ポイント

[11 §6](./11_implementation_plan.md) と対応。

| S | TDDで最初に書くテスト |
|---|----------------------|
| S0 | `npm run test` が動く最小テスト（scaffold疎通）。トークン適用のスモーク |
| S1 | `core/color`：parseHex/toHex → relativeLuminance/contrastRatio → rgbToHsl/Hsv → rgbToLab → deltaE2000(Sharma34) → cvd → harmony(OKLCH) → ensureReadableAccent |
| S2 | `store`：apply(set/add/remove/reorder/replaceAll)、selectColor(ペア入替)、setAccent、URL encode/decode |
| S3–S6 | 各カード：モード別表示条件、算出値の表示、コピー、ヘルプ開閉 |
| S7 | Playwright：主要フロー＋axe 違反ゼロ |

> **S1 の core/color から TDD を始める**のが本プロジェクトの出発点。純粋関数かつ参照値があり、TDD が最も効く。

---

## 9. チェックリスト（各サイクル末）

- [ ] テストを先に書き、赤を確認した
- [ ] 最小実装で緑にした
- [ ] 緑のままリファクタした
- [ ] 境界/異常系を1ケース足した
- [ ] lint / typecheck / test が緑
- [ ] 自動コミット済み（push していない）
