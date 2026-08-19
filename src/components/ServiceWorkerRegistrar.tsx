"use client";

import { useEffect } from "react";

/**
 * Service Worker（public/sw.js）の登録。
 *
 * 本番ビルドでのみ登録する。開発中は HMR とキャッシュが干渉して
 * 「直したのに反映されない」を招くため入れない（Playwright の dev 実行も同様）。
 * オフライン検証は本番ビルド（PW_START=1）で行う。
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 登録失敗（非セキュアコンテキスト等）はオフライン非対応として続行
      });
    };

    // 初期描画・ハイドレーションと帯域を奪い合わないよう load 後に登録する
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
