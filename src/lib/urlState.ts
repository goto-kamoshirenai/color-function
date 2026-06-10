/**
 * URL ハッシュによる配色の共有・復元（DBレス, docs/02 §2.3 / docs/10 §3）。
 * 形式: `#p=1F2933,2D6CDF,...`（# 抜き・カンマ連結・大文字HEX）。
 */

export function encodePalette(hexes: string[]): string {
  const body = hexes.map((h) => h.replace(/^#/, "").toUpperCase()).join(",");
  return "#p=" + body;
}

export function decodePalette(hash: string): string[] | null {
  const m = decodeURIComponent(hash.replace(/^#/, "")).match(
    /(?:^|&)p=([^&]*)/,
  );
  if (!m) return null;
  const cols = m[1]
    .split(",")
    .filter((x) => /^[0-9a-fA-F]{6}$/.test(x))
    .map((x) => "#" + x.toUpperCase());
  return cols.length ? cols : null;
}

/** 現在のパレットを location.hash へ反映（履歴を汚さない replaceState）。 */
export function syncPaletteToHash(hexes: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.history.replaceState(null, "", encodePalette(hexes));
  } catch {
    // 反映不可環境は無視
  }
}

/** 起動時に location.hash から復元（無ければ null）。 */
export function readPaletteFromHash(): string[] | null {
  if (typeof window === "undefined") return null;
  return decodePalette(window.location.hash || "");
}
