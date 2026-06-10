/**
 * ワークスペース（メイン領域）。docs/03・docs/10 のカードスクロール領域。
 * S0 は骨格のみ。カードは S3 以降で CardDef レジストリから描画する。
 */
export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <p className="text-text-3 font-mono text-xs tracking-widest">
        CFF · WORKSPACE
      </p>
      <h1 className="text-text mt-2 text-2xl font-semibold tracking-tight">
        Color Follows Function
      </h1>
      <p className="text-text-2 mt-2 max-w-prose text-sm">
        配色を「感覚」でなく「数値」で扱う検証・設計支援ツール。基盤（S0）構築済み。
        分析カードは順次このメイン領域に追加されます。
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="border-border bg-surface rounded-lg border p-4">
          <p className="text-text-3 font-mono text-xs">SURFACE</p>
          <p className="text-text-2 mt-1 text-sm">トークン適用の確認用カード</p>
        </div>
        <div className="border-border bg-surface-2 rounded-lg border p-4">
          <p className="text-text-3 font-mono text-xs">SURFACE-2</p>
          <p className="text-text-2 mt-1 text-sm">
            アクセント:{" "}
            <span className="text-accent font-mono">var(--accent)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
