import { ImageResponse } from "next/og";
import { MARK_PATHS } from "@/components/BrandMark";

/**
 * OG / Twitter カード画像（Next のファイル規約で動的生成）。
 * ブランドマーク＋ワードマークのモノクロ意匠に、アクセントの1本線だけを差す
 * （アプリの意匠と同じ「無彩色ベース＋差し色1点」）。
 */
export const alt = "Color Follows Function — 色彩定量解析";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#16161a",
        color: "#f4f4f2",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="120" height="120" viewBox="0 0 300 300" fill="#f4f4f2">
          {MARK_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#9a9aa2" }}>
            COLOR FOLLOWS FUNCTION
          </div>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#f97316" }}>
            COLOR QUANTIFIED
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ width: 160, height: 6, background: "#f97316" }} />
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.2 }}>
          配色を「感覚」でなく「数値」で
        </div>
        <div style={{ fontSize: 28, color: "#9a9aa2" }}>
          コントラスト比 / 色差 ΔE / 色覚シミュレーション
        </div>
      </div>
    </div>,
    size,
  );
}
