import {
  parseHex,
  contrastRatio,
  judgeWcag,
  apcaContrast,
  apcaUsage,
  rgbToLab,
  deltaE2000,
  grayscaleOf,
  confusablePairs,
  cvdConfusablePairs,
  type RGB,
  type CvdType,
} from "@/core/color";
import type { MessageKey, MessageParams } from "@/lib/i18n/messages";

/**
 * いまの配色の診断結果を Markdown 1枚にまとめる（「AI に渡す」）。
 *
 * この画面を読ませる代わりに、結果と根拠をテキストで渡せるようにする
 * — バイブコーディングの現場では、診断を目で追うより、そのまま
 * エディタの AI に貼って直させるほうが速い。文言は呼び出し側の t に委ね、
 * 表示と同じ言い回し・同じ数値を使う。
 */
export type Translate = (key: MessageKey, params?: MessageParams) => string;

const VERDICT_KEY = {
  AAA: "card.contrast.verdictAAA",
  AA: "card.contrast.verdictAA",
  "AA-large": "card.contrast.verdictAALarge",
  fail: "card.contrast.verdictFail",
} as const satisfies Record<string, MessageKey>;

const USAGE_KEY = {
  body: "card.apca.body",
  large: "card.apca.large",
  ui: "card.apca.ui",
  fail: "card.apca.fail",
} as const satisfies Record<string, MessageKey>;

const CVD_KEY = {
  protan: "card.cvd.protan",
  deutan: "card.cvd.deutan",
  tritan: "card.cvd.tritan",
} as const satisfies Record<CvdType, MessageKey>;

const CVD_TYPES: CvdType[] = ["protan", "deutan", "tritan"];

/** 「01 × 03」の形（カードの表記に合わせる）。 */
const pairLabel = (i: number, j: number) =>
  `${String(i + 1).padStart(2, "0")} × ${String(j + 1).padStart(2, "0")}`;

export type AiReportInput = {
  hexes: string[];
  /** ペアの前景・背景（2色未満のときは null） */
  fgHex: string | null;
  bgHex: string | null;
  /** 参照先（/code・/learn）の絶対 URL の基点 */
  siteUrl: string;
  t: Translate;
};

/** 配色レポート（Markdown）。色が無いときは空文字。 */
export function buildAiReport(input: AiReportInput): string {
  const { hexes, fgHex, bgHex, siteUrl, t } = input;
  if (hexes.length === 0) return "";

  const rgb = (hex: string): RGB => parseHex(hex) ?? { r: 0, g: 0, b: 0 };
  const rgbs = hexes.map(rgb);
  const lines: string[] = [`# ${t("ai.reportTitle")}`, ""];

  lines.push(`${t("ai.palette")}: ${hexes.join(", ")}`, "");

  if (fgHex && bgHex) {
    const fg = rgb(fgHex);
    const bg = rgb(bgHex);
    const ratio = contrastRatio(fg, bg);
    const lc = apcaContrast(fg, bg);
    const de = deltaE2000(rgbToLab(fg), rgbToLab(bg));
    lines.push(
      `## ${t("ai.pairSection", { fg: fgHex, bg: bgHex })}`,
      `- ${t("card.contrast.title")}: ${ratio.toFixed(2)}:1 — ${t(
        VERDICT_KEY[judgeWcag(ratio).verdict],
      )}`,
      `- ${t("card.apca.title")}: Lc ${lc.toFixed(1)} — ${t(
        USAGE_KEY[apcaUsage(lc)],
      )}`,
      `- ${t("card.deltae.title")}: ${de.toFixed(2)}`,
      "",
    );
  }

  if (hexes.length >= 2) {
    const similar = confusablePairs(rgbs, 10).map(({ i, j }) =>
      pairLabel(i, j),
    );

    const grayLabs = rgbs.map((c) => rgbToLab(grayscaleOf(c)));
    const grayCollisions: string[] = [];
    for (let i = 0; i < grayLabs.length; i++)
      for (let j = i + 1; j < grayLabs.length; j++)
        if (deltaE2000(grayLabs[i], grayLabs[j]) < 10)
          grayCollisions.push(pairLabel(i, j));

    const cvd = CVD_TYPES.flatMap((type) =>
      cvdConfusablePairs(rgbs, type, 10).map(
        ({ i, j }) => `${t(CVD_KEY[type])} ${pairLabel(i, j)}`,
      ),
    );

    const list = (items: string[]) =>
      items.length > 0 ? items.join(", ") : t("ai.none");

    lines.push(
      `## ${t("ai.paletteSection")}`,
      `- ${t("card.redundancy.title")}: ${list(similar)}`,
      `- ${t("card.grayscale.title")}: ${list(grayCollisions)}`,
      `- ${t("card.cvdmatrix.title")}: ${list(cvd)}`,
      "",
    );
  }

  lines.push(
    `## ${t("ai.refSection")}`,
    `- ${t("code.pageTitle")}: ${siteUrl}/code`,
    `- ${t("learn.title")}: ${siteUrl}/learn`,
    "",
  );

  return lines.join("\n");
}
