# 04. UX・レスポンシブ・デザイン一貫性・i18n

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14

ヒーロー/固定パネル/オンボーディング等の設計（ADR 0001/0002）は丁寧。残課題は i18n の取りこぼし、
共有導線の不在、safe-area の片手落ち、用語の二重概念など。

## 🐞 不具合

### <a id="bug-uipreview-hardcode"></a>🔴 UI モックプレビューのサンプル文言が日本語ハードコード（英語UIで切替わらない）

- **場所**: `src/features/cards/cards/CardUiPreview.tsx:49-53`
- **内容**: 「見出しテキスト」「本文テキストのサンプルです。割当: …」が JSX 直書きで en でも日本語のまま。同種の `CardWcagContrast` は `card.contrast.sample*` で i18n 済みなのにこのカードだけ漏れ。規約「ハードコード回避」にも反する。
- **改善方針**: `card.uipreview.sampleHeading`/`sampleBody` を ja/en に追加し `t()` 化（既存 `card.uipreview.note` と統合検討）。

### <a id="bug-palettebar-safearea"></a>🟡 展開時のパレットバーに safe-area-inset-bottom が無い

- **場所**: `src/components/PaletteBar.tsx`（折りたたみ footer `:155` は `pb-[env(safe-area-inset-bottom)]` あり、展開 footer `:208` は無し）
- **内容**: `viewport-fit=cover`(layout.tsx:36) 下で、展開時の下段（ModeToggle/CLEAR ALL/折りたたみトグル `bottom-[11px]` 絶対配置）が iOS ホームインジケータに食い込む。**監査で実コードを確認し、`pb-[env...]` は1箇所のみ**（折りたたみ側だけ）。
- **改善方針**: 展開 footer にも `pb-[env(safe-area-inset-bottom)]` を付与、トグルの `bottom` もセーフエリア加味。

## ⚠️ 課題

### <a id="concern-no-share"></a>🔴 明示的な「共有」導線が存在しない（共有=URLハッシュが暗黙）

- **場所**: `src/lib/urlState.ts` / `src/components/StoreSync.tsx:53-57`（UI 側に共有ボタン無し）
- **内容**: 配色は `replaceState` で `#p=` に自動反映されるだけで、「リンクをコピー/共有」UI がどこにも無い（`navigator.share`/clipboard 実装なし）。ユーザーはアドレスバーから手動コピーが必要で、URL が共有手段であることに気づけない。一方 `card.templates.note` 等の文言は共有URLの存在を前提にしており矛盾。
- **改善方針**: ヘッダーまたはパレットバー下段に「リンクをコピー」ボタン（`navigator.clipboard.writeText(location.href)`＋トースト、`navigator.share` 併用可）。i18n `share.copy` 等を新設。

### 🟡 「アクセント」の二重概念（UIの差し色 vs 並び順4番目のロール）

- **場所**: `src/components/Swatch.tsx:130-150` / `src/components/StoreSync.tsx:34-51` / `src/features/cards/hooks.ts:40-58`
- **内容**: スウォッチの塗りつぶしで設定する「アクセント」(`accentId`→`--accent` 注入＝UI差し色)と、`CardUiPreview`/`SemanticRoles` の「accent ロール」(並び順4番目)が別物。同じ語で別概念のため混乱。UiPreview の note は「4=accent」と説明するがユーザー指定アクセントは反映されない。
- **改善方針**: 用語分離（"UIアクセント" vs "アクセント役")、または UiPreview で `accentId` を優先。

### 🟡 ペアバーの固定 top 値がマジックナンバーでヘッダー実高とズレる

- **場所**: `src/components/PairRolePicker.tsx`（`sm:top-*` / `xl:top-[64px]`）/ ヘッダー高 `calc(3.5rem + env(safe-area-inset-top))`
- **内容**: スクロールは `main` 内。固定/吸着の `top` 値がヘッダー実高（56px＋safe-area-top）と完全一致せず、ノッチ端末で隙間/重なりが変動。
- **改善方針**: `top` をヘッダー高 `calc(3.5rem + env(safe-area-inset-top))` ベースに統一。

### 🟢 空/不足状態の文言が状況と不一致なカードがある

- **場所**: `src/features/cards/cards/CardComplement.tsx:37-40`（`card.complement.tooFew`「有彩色が2色以上必要」）
- **内容**: `suggestGapFill` が null の全ケース（0色含む）で一律「有彩色が2色以上必要」。0色時は `card.empty` が適切で、空状態の体裁がカード間で不揃い。
- **改善方針**: 0色は `card.empty`、有彩色不足のみ `tooFew` に分岐。空状態は共通化（[06](./06-testing-code-quality.md)参照）。

### 🟢 少色時にプレビュー系がスカスカ/単調

- **場所**: `src/features/cards/cards/CardSvgPreview.tsx:13`（`i % palette.length`）/ `CardChartPreview.tsx:23`
- **内容**: 2-3色だと同色図形が反復し情報密度が低い。ADR0002 の「スカスカ整理は次ラウンド」の宿題が残存。
- **改善方針**: 少色時は図形数を色数に合わせ間引く等。

### 🟢 i18n: 未使用キー／英語の単複表現

- **場所**: `src/lib/i18n/messages.ts`
- **内容**: 未使用キー `palette.count`/`swatch.reorder`/`swatch.reorderTitle`（ja/en 双方、`t(...)` 参照ゼロ）。`card.overview.grayNg`「{n} merge」や `card.cvdmatrix.count` の `(s)` 表記など en の単複/可算が不自然・不統一。
- **改善方針**: 未使用キー削除（[06](./06-testing-code-quality.md)に検出策）。en の単複表現と `(s)` 方針を統一。

## ✨ 機能追加・改善案

- **🟢 /learn 末尾に「ホームに戻る」リンク**（既存 `nav.backHome` 流用）。長い用語集スクロール後の戻り導線が上部2箇所のみ。
- **🟢 空かつ初回はパレットバーを自動展開** or コーチマークの矢印を `＋` ボタンへ寄せる（折りたたみ初回で押下先が弱い）。`src/components/PaletteBar.tsx:159-162` / `FirstRunHint.tsx`
- **（良い点）** `FirstRunHint`（初回判定・スプラッシュ後表示・dismiss・reduced-motion・SSR非表示・`/`限定）と home/learn トグル（`aria-current`）は設計が丁寧で問題なし。

## このトピックの最重要

1. 🔴 [CardUiPreview の日本語ハードコード](#bug-uipreview-hardcode)（`CardUiPreview.tsx:49-53`）
2. 🔴 [明示的な共有導線の欠如](#concern-no-share)（UI 全体 / `urlState.ts`）
3. 🟡 [展開パレットバーの safe-area 欠落](#bug-palettebar-safearea)（`PaletteBar.tsx:208`）
