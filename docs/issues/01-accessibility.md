# 01. アクセシビリティ（a11y）

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14

react-aria-components ベースで土台は良いが、独自実装したトグル/スプラッシュ/マトリクスに
キーボード・スクリーンリーダー(SR)対応の穴がある。既存の axe e2e は `serious/critical`・
ホーム3画面のみで、以下の多くは検出網から漏れている。

## 🐞 不具合

### <a id="bug-toggle-disabled"></a>🟡 無効モードボタンが SR/キーボードには「有効」に見え、操作しても無反応

- **場所**: `src/components/ModeToggle.tsx:42-65`
- **内容**: 色数不足の `ペア`/`パレット` は `aria-disabled` を付けるだけで react-aria の `isDisabled`/`disabledKeys` を使っていない。`role=radio` としてフォーカス・選択は通常どおり通り、`onSelectionChange` 内で握り潰す。SR/キーボードでは「選択可能」に見えて押しても何も起きず、理由も届かない（`title` は hover 専用・`aria-describedby` なし）。e2e も `getByRole("radio", {name:"単色"})` を使っており radio 露出が裏付けられる。
- **改善方針**: `ToggleButtonGroup` の `disabledKeys` で真に無効化し、理由は `aria-describedby` で関連付ける。または無効ボタン自体をやめ「2色以上で有効」のヒントを近接表示（`card.needPair` 系）に寄せる。

### 🟡 スウォッチの矢印キー並べ替えでフォーカスが追従せず、状態変化が SR に伝わりにくい

- **場所**: `src/components/Swatch.tsx:65-73` / `src/components/PaletteBar.tsx:110-118`
- **内容**: ←/→ で `moveBy`→`apply(reorder)` で DOM 再構築。`aria-label` の連番 `n` は配列インデックス由来で入れ替わる一方、フォーカス位置との関係が SR に不明瞭。端では `return` するだけでフィードバック無し。
- **改善方針**: 並べ替え後に移動先へフォーカス再設定、`aria-label` に総数（`{n}/{total}`）を含める。端到達時も `showToast` で通知。

### 🟡 全画面スプラッシュが `role="dialog"` だがフォーカストラップ・初期フォーカス・背後 inert が無い

- **場所**: `src/components/SplashScreen.tsx:99-108`
- **内容**: 素の `motion.div` に `role="dialog"` を手書き。フォーカスがダイアログ内に移らず Tab が背後へ抜ける。SKIP に初期フォーカスも当たらない。背後 `<main>` に `aria-hidden`/`inert` も無い（Esc は window リスナで独自に処理）。
- **改善方針**: react-aria の `Modal`/`Dialog`(`isDismissable`) へ置換、最低限「初期フォーカス＝SKIP＋背後 inert」を実装。

## ⚠️ 課題

### 🟡 マトリクスがSR非対応（行列対応・セル値・合否が伝わらない）

- **場所**: `src/features/cards/cards/MatrixGrid.tsx:38,64-77` / `CardContrastMatrix.tsx:40-47`
- **内容**: `<p class="sr-only">` は表全体の一文要約のみ。`inline-grid` の `div` で `role="table/row/cell"` 無し、ヘッダーは色塗りセル（hex は `title` のみ＝SR非対応）、合否は「太字＋インセット枠」の視覚のみ。SR には数値が行列対応なく散発的に読まれる。
- **改善方針**: `role="table"`＋`scope` 付きヘッダー、各値セルに `色1 対 色2: 4.52 合格` 形式の visually-hidden ラベル、合否を文字でも表示。

### 🟡 無効ボタンの `opacity-40` が（実際は操作可能なため）コントラスト要件を割る

- **場所**: `src/components/ModeToggle.tsx:56-57`
- **内容**: 真に disabled なら 1.4.3 免除だが、本実装は operable（[上記バグ](#bug-toggle-disabled)）。operable 要素の文字は AA 必須で `text-2`×opacity-40 は不足。axe はインライン opacity を見ないため未検出。
- **改善方針**: 真の無効化で免除対象に。operable を保つなら opacity を落とさず別指標に。

### 🟡 `::selection` の文字色が固定 `#fff` で、明るいアクセント時に読めない

- **場所**: `src/app/globals.css:131-132`（`::selection{background:var(--accent);color:#fff}`）
- **内容**: アクセント色はユーザー指定＋JS補正だが、選択時の文字色は白固定。明るいアクセントで白文字が不可視。`text-accent`（アクセントを前景に使う箇所, 例 `Swatch.tsx`）も同様の検証要。
- **改善方針**: `::selection` の文字色もアクセント連動（`--bg` 等）にするか補正対象へ含める。

### 🟢 axe e2e のカバレッジ不足

- **場所**: `e2e/workflow.spec.ts:150-156`
- **内容**: `impact === serious|critical` のみ失敗扱いで `moderate` を素通り。解析は `/` の3パターンのみで、ColorPicker/ConfirmDialog/SettingsMenu/Help・References ポップオーバー/`/learn`/スプラッシュ表示中は未解析。
- **改善方針**: `moderate` まで対象化（or 個別許容リスト）。各オーバーレイと `/learn` を axe 対象に追加。

### 🟢 スキップリンクが無い

- **場所**: `src/app/layout.tsx:66-82`
- **内容**: landmark はあるがメインへの skip link 無し。ヘッダー/フッターのコントロールを毎回 Tab する必要。
- **改善方針**: body 先頭にフォーカスで現れる「メインへスキップ」（`href="#main"`、`<main id="main">`）。

### 🟢 ペアバー Tooltip がタッチ非対応・aria-label と本文が重複

- **場所**: `src/components/PairRolePicker.tsx:83-98`
- **内容**: `TooltipTrigger` のヒントはタッチで出ずモバイルで情報欠落、`aria-label` と本文が重複。
- **改善方針**: ヒントを Popover 等タッチ対応へ、重複整理。

## ✨ 機能追加・改善案

- **🟢 スウォッチ並べ替えを react-aria の `GridList`+`useDragAndDrop` へ**（`Swatch.tsx`/`PaletteBar.tsx`）。HTML5 DnD はキーボード非対応で、現状 ←/→ を自前実装。標準化でキーボードDnD・SRアナウンス・ドロップ位置通知が揃い、上記の並べ替え課題も解消。
- **🟢 マトリクスの table セマンティクス化**（凡例 `BOLD = AA` を `aria-describedby` で関連付け、合否を `data-pass`＋visually-hidden で明示）。
- **🟢 a11y e2e 拡張**: 各オーバーレイ＋`/learn`＋スプラッシュ中を axe 対象に。Tab 順序・スウォッチ ←/→・モーダルのフォーカストラップ/復帰の e2e を追加。

## このトピックの最重要

1. 🟡 [無効 ModeToggle の握り潰し](#bug-toggle-disabled)（`ModeToggle.tsx:42-65`）
2. 🟡 マトリクスのSR非対応（`MatrixGrid.tsx`/`CardContrastMatrix.tsx`）
3. 🟡 スプラッシュのフォーカストラップ欠如（`SplashScreen.tsx:99-108`）
