/*
 * Service Worker（オフライン起動のための最小構成）。
 *
 * 方針:
 *  - インストール時に「アプリシェル（各ルートの HTML）＋静的データ資産」を
 *    プリキャッシュする。DBレス・静的志向のアプリなので、これだけで
 *    ホーム画面から起動して計算・検証が完結する。
 *  - ビルドごとにハッシュが変わる /_next/static/* は列挙できないため、
 *    走査した順にキャッシュへ入れる cache-first（内容不変なので安全）。
 *    初回訪問中はまだ SW が制御していないチャンクがあるため、完全な
 *    オフライン起動は「2 回目の読み込み以降」に成立する。
 *  - ナビゲーションは network-first（更新を取りに行き、失敗時にキャッシュ）。
 *    HTML をキャッシュ優先にすると新デプロイが届かなくなる。
 *  - 配色は URL ハッシュ／localStorage に持つのでサーバー通信は不要。
 *
 * キャッシュ名に VERSION を含め、activate で旧世代を破棄する。
 */

const VERSION = "v2";
const SHELL_CACHE = `cff-shell-${VERSION}`;
const ASSET_CACHE = `cff-assets-${VERSION}`;

/** インストール時に確実に取っておくもの（ルート HTML と静的データ）。 */
const PRECACHE_URLS = [
  "/",
  "/learn",
  "/library",
  "/code",
  "/manifest.webmanifest",
  "/data/manifest.json",
  "/data/harmony/rules.json",
  "/data/names/css.json",
  "/data/names/wa.json",
  "/logo/color-function_logo.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

/** cache-first で扱う（内容が変わらない or 変わってもよい）パス。 */
const CACHE_FIRST_PREFIXES = [
  "/_next/static/",
  "/data/",
  "/icons/",
  "/logo/",
  "/help/",
  "/locales/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // 1 つ失敗しても全体を落とさない（配信構成の差異に耐える）
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              k.startsWith("cff-") && k !== SHELL_CACHE && k !== ASSET_CACHE,
          )
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

/** ナビゲーション: network-first（失敗時はキャッシュ、無ければトップ）。 */
async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ??
      (await cache.match("/")) ??
      Response.error()
    );
  }
}

/** 静的資産: cache-first（無ければ取得してキャッシュ）。 */
async function handleAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }
  if (CACHE_FIRST_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(handleAsset(request));
  }
});
