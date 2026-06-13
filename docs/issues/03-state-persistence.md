# 03. 状態管理・永続化・データフロー

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14

コアの純関数層（`reconcile`/`clampUnit`/encode-decode）はサニタイズ・境界が堅牢でテストも妥当。
**脆いのは一貫して副作用層 `StoreSync`** で、データ喪失・過剰I/O・復元フラッシュの発生源になっている。

## 🐞 不具合

### <a id="bug-share-overwrite"></a>🔴 共有リンク(`#p=`)を開くと localStorage の保存配色が即上書き消去される

- **場所**: `src/components/StoreSync.tsx:29`（復元）, `:53-60`（persist）
- **内容**: 復元は `readPaletteFromHash() ?? readPaletteFromStorage()` でハッシュ優先。直後の `persist()` が `savePaletteToStorage()` を実行し、さらに subscribe が全変更で保存するため、**他人の共有リンクを一度開くだけで自分が保存していた配色が失われる**。docs 方針「共有=URL / 保存=localStorage」を破る。
- **改善方針**: ハッシュ由来の復元時は localStorage への書き戻しを抑止（復元元が hash か storage かを記録し、最初の persist をスキップ／ユーザー編集が入るまで保存しない）。

### 🟡 アクセント注入がテーマ切替直後に旧背景で計算されうる

- **場所**: `src/components/StoreSync.tsx:44-50` / `src/lib/theme.ts:30-37`
- **内容**: `applyAccent` は `getComputedStyle(root).getPropertyValue("--bg")` を読む。`setTheme` が `data-theme` 変更直後に同期発火するため、computed style 再計算の保証が無いブラウザでは暗→明直後にアクセントが旧背景基準で AA 補正され、コントラスト不足色が一瞬残りうる。
- **改善方針**: `--bg` を JS 側の真実源（テーマ→RGB マップ）から取得、または `requestAnimationFrame` 後に再計算。

## ⚠️ 課題

### <a id="concern-oversubscribe"></a>🟡 全状態変更で URL replaceState＋localStorage 書き込み（過剰副作用）

- **場所**: `src/components/StoreSync.tsx:62-65`
- **内容**: `subscribe` がセレクタ無しで全変更に反応。`toast` の set/解除、`picker` の HSV ドラッグ、`selectedId`/`confirmOpen` 等、配色と無関係な更新でも毎回 `applyAccent`(=`getComputedStyle` 強制レイアウト)＋`syncPaletteToHash`(replaceState)＋`savePaletteToStorage` が走る。ピッカードラッグ中は1ドラッグで数十〜百回。INP 劣化・不要 I/O。（[05 パフォーマンス](./05-pwa-performance-meta.md)にも関連）
- **改善方針**: `subscribeWithSelector` で palette/accent のみ購読、前回 hexes と差分比較、persist は 150ms 程度デバウンス、`getComputedStyle` はテーマ変更時のみ。

### <a id="concern-restore-flash"></a>🟡 復元待ちカバーがパレットバー限定で、カード領域は既定色がフラッシュ

- **場所**: `src/app/globals.css:163-165`（`[data-palette-restore] .cff-palette-strip{visibility:hidden}`）/ `src/app/layout.tsx:71`（`<main>` 無カバー）
- **内容**: カバーはパレットバーの色チップ列のみを隠す。カード群は SSR 既定色でレンダされるため、共有リンク復元時にコントラスト比カードやプレビューが「既定の黒/赤」で一瞬描画→差し替わるフラッシュが残る。docs の「既定色を見せない」意図がカードに効いていない。
- **改善方針**: カバー対象を `<main>`（または specimen/カード領域）へ拡張、復元完了まで `visibility:hidden`。

### 🟡 パレット拡張時に単位が下位に固定されたまま戻らない

- **場所**: `src/store/useColorStore.ts:104-108`（`clampUnit`）, `:198`（`hydratePalette`）
- **内容**: `clampUnit` は色数不足で下げるのみ（仕様）。だが「1色で single になった」状態のまま5色の共有リンクを復元しても `unit` は single 据え置きで palette 用カードが出ない（手動切替が必要）。
- **改善方針**: 仕様として許容ならドキュメント明記。復元時は色数に応じた妥当な既定単位へ再計算が自然。

### 🟡 役割・ビュー・選択が永続化されない（保存対象は HEX 列のみ）

- **場所**: `src/store/useColorStore.ts:19-27,202-260` / `src/lib/urlState.ts`
- **内容**: `view`/`unit`/`selectedId`/`fgId`/`bgId`/`accentId`/`picker` は保存対象外。共有/保存で FG/BG・アクセント役割・表示ビュー・選択は復元されず reconcile 既定（先頭/末尾）に戻る。役割指定はユーザー成果物なので「保存」期待とズレる可能性。
- **改善方針**: 仕様確認。含めるなら encode 形式を後方互換に拡張。

### 🟢 複数タブ同期なし（`storage` イベント未購読）

- **場所**: `src/components/StoreSync.tsx`（`"storage"` リスナ無し）
- **内容**: 別タブの編集に追従せず後勝ちで上書き。テーマ/言語/色形式も同様。「保存」を謳う以上データ喪失の温床。
- **改善方針**: 必要なら `window.addEventListener("storage", …)` で再 hydrate。

### 🟢 en ユーザーで SSR HTML が `lang="ja"` 固定・日本語が一瞬出る

- **場所**: `src/lib/i18n/locale.ts:20`（server snapshot `"ja"`）/ `src/app/layout.tsx:58`
- **内容**: SSR HTML が ja 固定テキストで配信され、en ユーザーは初回ペイントで日本語フラッシュ（`suppressHydrationWarning` で警告のみ抑止）。
- **改善方針**: 重要度低。文言フラッシュを嫌うなら locale もペイント前カバーで隠す検討。

## ✨ 機能追加・改善案

- **🟢 `crypto.randomUUID()` のフォールバック**（`src/store/useColorStore.ts:66`）。非 HTTPS/古環境で未定義→ストア初期化ごと失敗しうる。`Math.random` ベース等の代替を。
- **🟢 色数上限を `apply` 側に**（`useColorStore.ts`）。無制限で URL/localStorage が肥大化しうる（UX兼用）。
- **🟡 副作用層のテスト**（最も壊れやすいのに空白）。`StoreSync` の復元優先度・persist・accent 注入・テーマ購読、`urlState` の save/read（不正/空/removeItem）を jsdom+モックで。特に[共有が保存を上書き](#bug-share-overwrite)を検出する結合テストを。

## このトピックの最重要

1. 🔴 [共有リンクが localStorage を即上書き消去](#bug-share-overwrite)（`StoreSync.tsx:29,53-60`）
2. 🟡 [全状態変更で URL+localStorage+reflow](#concern-oversubscribe)（`StoreSync.tsx:62-65`）
3. 🟡 [復元カバーがパレットバー限定でカードが既定色フラッシュ](#concern-restore-flash)（`globals.css:163` / `layout.tsx:71`）
