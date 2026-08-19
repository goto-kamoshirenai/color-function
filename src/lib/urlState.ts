/**
 * URL ハッシュによる配色の共有・復元（DBレス, docs/02 §2.3 / docs/10 §3）。
 * 形式: `#p=1F2933,2D6CDF,...`（# 抜き・カンマ連結・大文字HEX）。
 *
 * 対象は「色（HEX 列）と並び順」だけ。以下は意図的に含めない:
 *  - 表示状態（unit / view / selectedId）… 開いた側の見たい観点を尊重する
 *  - 役割指定（fgId / bgId / accentId）… 並び順から決定的に再構成できる
 *    （先頭=FG / 末尾=BG・アクセント。docs/05 の reconcile 規則）
 * これらを含めると共有 URL が長くなり、後方互換の維持コストも増える。
 * 復元時は reconcile と clampUnit が色数に見合う既定へ整える。
 *
 * 複数タブの同期（storage イベント購読）は行わない。後から保存したタブの値が
 * 勝つ（last-write-wins）。編集中のタブへ他タブの値を割り込ませると、
 * 手元の編集が黙って消えるほうが害が大きいため。
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

/**
 * localStorage への保持（一時保存。共有=URLハッシュ / 保存=localStorage）。
 * URL と同じく色（HEX 列）のみ。空配列はキーを消す（次回は既定に戻る）。
 */
export const PALETTE_STORAGE_KEY = "cff-palette";

export function savePaletteToStorage(hexes: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const body = hexes
      .map((h) => h.replace(/^#/, "").toUpperCase())
      .filter((x) => /^[0-9A-F]{6}$/.test(x))
      .join(",");
    if (body) localStorage.setItem(PALETTE_STORAGE_KEY, body);
    else localStorage.removeItem(PALETTE_STORAGE_KEY);
  } catch {
    // localStorage 不可環境は無視
  }
}

/** localStorage から復元（無効・未設定なら null）。 */
export function readPaletteFromStorage(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PALETTE_STORAGE_KEY);
    if (!raw) return null;
    const cols = raw
      .split(",")
      .filter((x) => /^[0-9a-fA-F]{6}$/.test(x))
      .map((x) => "#" + x.toUpperCase());
    return cols.length ? cols : null;
  } catch {
    return null;
  }
}
