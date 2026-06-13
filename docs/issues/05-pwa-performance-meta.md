# 05. PWA・パフォーマンス・メタ/SEO・ビルド

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14

`manifest.ts`・apple-web-app メタ・`viewport-fit=cover`＋safe-area は整備済み。一方で
オフライン対応の核（SW）が無く、メタ/SEO 基盤も未整備。パフォーマンスは [03](./03-state-persistence.md)
の過剰購読が最大要因。

## 🐞 不具合

### <a id="bug-no-sw"></a>🔴 Service Worker 不在でインストール後オフライン起動不可

- **場所**: プロジェクト全体（`public/sw*`・`next-pwa`/Serwist いずれも無し）/ `src/app/manifest.ts`（`display:"standalone"`）
- **内容**: インストール可能だが SW/オフラインキャッシュが一切ない。A2HS 後にオフラインで起動すると HTML も `public/data/*` の fetch も失敗し白画面。「DBレス・URL共有」の静的志向アプリなのに、最も価値が出るオフライン動作が成立しない（iOS で特に顕著）。
- **改善方針**: Serwist 等（Next 16 App Router 推奨）で app shell＋`public/data/*` を cache-first プリキャッシュ。

### 🟡 `metadataBase` 未設定 → OG/canonical の絶対URL生成が破綻する

- **場所**: `src/app/layout.tsx:24`（`metadata`）
- **内容**: 現状 OG 画像未指定で即エラーにはならないが、OG/Twitter/canonical を追加した瞬間に相対URLが localhost 基準になり SNS 共有で壊れる。
- **改善方針**: `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!)` を追加（ハードコード回避）。

## ⚠️ 課題

### 🟡 ストア購読の無差別全変更購読で同期 reflow＋書き込み多発

- **場所**: `src/components/StoreSync.tsx:62`
- **内容**: セレクタ無し購読で、色無関係の更新やピッカードラッグ毎に `getComputedStyle`(強制レイアウト)＋`replaceState`＋`localStorage.setItem` が走り INP 悪化。詳細・改善は [03 #concern-oversubscribe](./03-state-persistence.md#concern-oversubscribe)。

### 🟡 マトリクス系・最寄り色名にメモ化が無い（毎レンダー O(n²)/辞書線形走査）

- **場所**: `src/features/cards/cards/CardContrastMatrix.tsx:16` / `CardDeltaMatrix.tsx` / `CardNearestName.tsx:16`（`useMemo` はカード/components で0件）
- **内容**: コントラスト比は n² 回、ΔEマトリクスは CIEDE2000 を n² 回、`nearestName` は辞書全件に `rgbToLab`+`deltaE2000`（しかも辞書側 Lab を毎回再計算 `name.ts:22`）。色数は小さいが、上記過剰購読で無関係更新でも全カード再レンダーされ何度も無駄に走る。
- **改善方針**: 各カードを `useMemo([palette])` 化。`nearestName` は辞書 Lab を `useColorNames` ロード時に事前計算してキャッシュ。`MatrixGrid` セルもメモ。

### 🟡 メタ/SEO がほぼ未整備（OG・Twitter・canonical・robots・sitemap すべて不在）

- **場所**: `src/app/layout.tsx:24`（`sitemap.ts`/`robots.ts`/`opengraph-image` いずれも無し）
- **内容**: SNS 共有でプレビューが貧弱、クロール制御無し。URLハッシュ `#p=` 共有が乱立するため canonical 指定の価値が高い。iOS スプラッシュ画像（`appleWebApp.startupImage`）も未指定。
- **改善方針**: `opengraph-image.tsx`(ImageResponse 動的生成可)、`twitter` card、`robots.ts`、`sitemap.ts`、`alternates.canonical` を追加。

### 🟢 PWA manifest の補完項目欠落

- **場所**: `src/app/manifest.ts:5`
- **内容**: `start_url`/`id`/`display`/`theme_color`/`background_color`/`icons`(maskable) は良好。`scope`(未指定→`"/"`推奨)/`lang`/`dir`/`categories`/`screenshots`(リッチインストールUIで必須級)/`shortcuts`(Verify/Design直行) が未設定。
- **改善方針**: `scope:"/"`、`screenshots`(narrow/wide)、`shortcuts`、`categories:["design","productivity"]` を追加。

### 🟢 SSR HTML が `lang="ja"` 固定（JS無効/クローラには常に ja）

- **場所**: `src/app/layout.tsx:58` ＋ ペイント前スクリプト `:49`
- **内容**: `<html lang="ja">` 固定で JS が上書きする方式。クローラには ja 固定で SEO 実態と不一致。
- **改善方針**: `alternates.languages`(hreflang) を補い言語シグナルを別途付与。

## ✨ 機能追加・改善案

- **🟢 `public/data/*`(合計約6KB) をビルド同梱へ**（`src/lib/assets.ts:93` / `useColorNames.ts:21`）。manifest→各アセットの多段 fetch でウォーターフォール＋最寄り色名カードが初回「loading」を挟む。極小なので `import`/RSC でビルド時取り込みし fetch 廃止（SW 導入時はプリキャッシュ）。
- **🟢 サーバーコンポーネント活用**（`src/app/page.tsx`→`CardList.tsx` 以降ほぼ全 client）。ストアに触れない表示専用部（マストヘッド/凡例/`LAYOUT` 定義）をサーバー側へ。`motion`(3ファイル) は `LazyMotion`/動的 import で初期バンドルから外す。`iconoir-react`(20ファイル) は個別 import 維持を確認しバレル import を避ける。
- **🟢 `next.config.ts` で意図を固める**（実質空）。静的化するなら `output:"export"` 検証、`poweredByHeader:false`、基本セキュリティヘッダ（インライン `themeInit` があるため CSP は nonce 設計要）。
- **🟢 計測の導入**（依存無し）。`@vercel/speed-insights`+`web-vitals` で INP/CLS 計測、Lighthouse CI で回帰検知。

## このトピックの最重要

1. 🔴 [Service Worker 不在でオフライン起動不可](#bug-no-sw)
2. 🟡 StoreSync 無差別購読による reflow＋書き込み多発（`StoreSync.tsx:62`、[03](./03-state-persistence.md#concern-oversubscribe)）
3. 🟡 メタ/SEO 基盤の欠落（`metadataBase`＋OG/Twitter/canonical/robots/sitemap）
