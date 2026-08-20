import { guideShotSize } from "@/lib/guideShots";

/**
 * 使い方ページの画面写真。ライト／ダークの2枚を持ち、CSS で出し分ける
 * （テーマは data-theme 切替なので、picture の prefers-color-scheme では合わない）。
 *
 * 画像は Playwright が実画面から撮る（scripts/generate-guide-shots.mjs）。
 * width/height は生成時の実寸で、読み込み前から場所を確保してガタつきを防ぐ。
 *
 * next/image ではなく素の img を使う: 出力は静的な PNG 2枚で最適化の余地が薄く、
 * `/guide/` を Service Worker の cache-first に入れてオフラインでも出せる方を採る
 * （/_next/image 経由だとオフライン時に画像だけ欠ける）。
 */
export function GuideShot({ id, alt }: { id: string; alt: string }) {
  const size = guideShotSize(id);
  if (!size) return null;

  const common =
    "border-border rounded-control h-auto w-full max-w-full border";
  return (
    <figure className="border-border bg-surface-2 rounded-control mt-4 border p-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- 上記の理由で意図的 */}
      <img
        src={`/guide/${id}-light.png`}
        alt={alt}
        width={size.width}
        height={size.height}
        loading="lazy"
        decoding="async"
        className={`${common} dark:hidden`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- 上記の理由で意図的 */}
      <img
        src={`/guide/${id}-dark.png`}
        alt={alt}
        width={size.width}
        height={size.height}
        loading="lazy"
        decoding="async"
        className={`${common} hidden dark:block`}
      />
    </figure>
  );
}
