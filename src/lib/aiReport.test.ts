import { describe, it, expect } from "vitest";
import { buildAiReport } from "./aiReport";
import {
  translate,
  type MessageKey,
  type MessageParams,
} from "./i18n/messages";

const t = (key: MessageKey, params?: MessageParams) =>
  translate("ja", key, params);
const siteUrl = "https://example.test";

describe("AI に渡す配色レポート", () => {
  it("色が無ければ空", () => {
    expect(
      buildAiReport({ hexes: [], fgHex: null, bgHex: null, siteUrl, t }),
    ).toBe("");
  });

  it("ペアの判定を画面と同じ数値で書く", () => {
    const md = buildAiReport({
      hexes: ["#777777", "#FFFFFF"],
      fgHex: "#777777",
      bgHex: "#FFFFFF",
      siteUrl,
      t,
    });
    expect(md).toContain("#777777, #FFFFFF");
    expect(md).toContain("4.48:1");
    // 4.48:1 は通常テキスト AA に届かず、大字のみ AA
    expect(md).toContain("大字のみ AA");
    expect(md).toContain("Lc");
    // 参照先（実装・学習）を必ず添える
    expect(md).toContain(`${siteUrl}/code`);
    expect(md).toContain(`${siteUrl}/learn`);
  });

  it("パレット全体の危険なペアを列挙する", () => {
    const md = buildAiReport({
      hexes: ["#3366CC", "#3568CE", "#FFFFFF"],
      fgHex: "#3366CC",
      bgHex: "#FFFFFF",
      siteUrl,
      t,
    });
    // 01 と 02 は似すぎている（冗長性・グレースケールの両方で挙がる）
    expect(md).toContain("01 × 02");
  });

  it("単色ではペア・パレットの節を出さない", () => {
    const md = buildAiReport({
      hexes: ["#3366CC"],
      fgHex: null,
      bgHex: null,
      siteUrl,
      t,
    });
    expect(md).toContain("#3366CC");
    expect(md).not.toContain("ペア（");
    expect(md).not.toContain(t("ai.paletteSection"));
  });
});
