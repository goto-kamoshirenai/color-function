import {
  parseHex,
  relativeLuminance,
  contrastRatio,
  apcaContrast,
  rgbToLab,
  deltaE2000,
  type RGB,
} from "@/core/color";

/**
 * 指標を自分のコードで出すための最小スニペット（カードの `</>`）。
 *
 * 画面に出ている値をそのまま埋めた、貼れば動く形にする
 * — 「この数字はどう計算するのか」に一次情報（ライブラリのドキュメント）と
 * 実コードの両方で答えるのがこのアプリの立ち位置。
 * 期待値のコメントは本ツールの計算結果（= 同じ標準式）から生成する。
 */
export type SnippetContext = {
  /** 基準色（選択中の色。無ければ先頭） */
  primary: string;
  /** ペアの前景・背景（2色未満のときは primary で埋める） */
  fg: string;
  bg: string;
  /** パレット全色（並び順） */
  hexes: string[];
};

export type CodeSnippet = {
  /** 使うライブラリ（references.json の libraries.id） */
  libId: string;
  lang: "ts" | "css";
  code: string;
};

const rgb = (hex: string): RGB => parseHex(hex) ?? { r: 0, g: 0, b: 0 };
const lab = (hex: string) => rgbToLab(rgb(hex));

/** パレットを JS の配列リテラルに（長い行にならないよう1行1色）。 */
function arrayLiteral(hexes: string[]): string {
  return `[\n${hexes.map((h) => `  "${h}",`).join("\n")}\n]`;
}

const SNIPPETS: Record<string, (ctx: SnippetContext) => CodeSnippet> = {
  luminance: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { wcagLuminance } from "culori";

const y = wcagLuminance("${primary}"); // → ${relativeLuminance(rgb(primary)).toFixed(4)}`,
  }),

  contrast: ({ fg, bg }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { wcagContrast } from "culori";

const ratio = wcagContrast("${fg}", "${bg}"); // → ${contrastRatio(rgb(fg), rgb(bg)).toFixed(2)}
const passesAA = ratio >= 4.5; // 通常テキスト`,
  }),

  apca: ({ fg, bg }) => ({
    libId: "apca-w3",
    lang: "ts",
    code: `import { APCAcontrast, sRGBtoY, colorParsley } from "apca-w3";

// 第1引数が文字色、第2引数が背景色（順序が意味を持つ）
const lc = APCAcontrast(
  sRGBtoY(colorParsley("${fg}")),
  sRGBtoY(colorParsley("${bg}")),
); // → ${apcaContrast(rgb(fg), rgb(bg)).toFixed(1)}`,
  }),

  deltae: ({ fg, bg }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { differenceCiede2000 } from "culori";

const deltaE = differenceCiede2000();
deltaE("${fg}", "${bg}"); // → ${deltaE2000(lab(fg), lab(bg)).toFixed(2)}`,
  }),

  cvd: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { filterDeficiencyDeuter, formatHex } from "culori";

const simulate = filterDeficiencyDeuter(1); // 0〜1 で重症度
formatHex(simulate("${primary}")); // D型（2型）での見え`,
  }),

  cvdmatrix: ({ hexes }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { filterDeficiencyDeuter, differenceCiede2000 } from "culori";

const palette = ${arrayLiteral(hexes)};
const simulate = filterDeficiencyDeuter(1);
const deltaE = differenceCiede2000();

// シミュレーション後の色差が 10 未満なら見分けにくい組み合わせ
const confusable = palette.flatMap((a, i) =>
  palette.slice(i + 1).map((b) => ({ a, b, de: deltaE(simulate(a), simulate(b)) })),
).filter(({ de }) => de < 10);`,
  }),

  grayscale: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { filterGrayscale, formatHex } from "culori";

const desaturate = filterGrayscale(1);
formatHex(desaturate("${primary}")); // 脱色したときの明度だけの見え`,
  }),

  spaces: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { converter, formatCss } from "culori";

const toOklch = converter("oklch");
formatCss(toOklch("${primary}")); // → "oklch(… … …)"`,
  }),

  gamut: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { inGamut, clampChroma, formatCss } from "culori";

inGamut("rgb")("${primary}"); // sRGB に収まるか
formatCss(clampChroma("${primary}", "oklch")); // 収まらない色を明度・色相を保って収める`,
  }),

  tone: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { converter, formatHex } from "culori";

const base = converter("oklch")("${primary}");
// 明度だけを差し替えてトーンを展開する（色相・彩度は据え置き）
const ramp = [0.95, 0.85, 0.7, 0.55, 0.4, 0.25].map((l) =>
  formatHex({ ...base, l }),
);`,
  }),

  gradient: ({ hexes, fg, bg }) => {
    const [from, to] = hexes.length >= 2 ? [hexes[0], hexes[1]] : [fg, bg];
    return {
      libId: "culori",
      lang: "ts",
      code: `import { interpolate, formatHex } from "culori";

// 補間空間で結果が変わる（"oklab" は明度が素直に、"rgb" は中間が濁りやすい）
const scale = interpolate(["${from}", "${to}"], "oklab");
const steps = [0, 0.25, 0.5, 0.75, 1].map((t) => formatHex(scale(t)));`,
    };
  },

  mix: ({ hexes, fg, bg }) => {
    const [from, to] = hexes.length >= 2 ? [hexes[0], hexes[1]] : [fg, bg];
    return {
      libId: "css-native",
      lang: "css",
      code: `/* 混色はブラウザだけで出せる（ライブラリを足す前に確認する） */
.button {
  background: color-mix(in oklab, ${from} 50%, ${to});
}`,
    };
  },

  harmony: ({ primary }) => ({
    libId: "culori",
    lang: "ts",
    code: `import { converter, formatHex } from "culori";

const base = converter("oklch")("${primary}");
// 色相を等間隔に回して三色配色（OKLCH なので明度・彩度は保たれる）
const triad = [0, 120, 240].map((deg) =>
  formatHex({ ...base, h: ((base.h ?? 0) + deg) % 360 }),
);`,
  }),
};

/** その指標のスニペット（無い指標は null）。 */
export function snippetFor(
  helpKey: string,
  ctx: SnippetContext,
): CodeSnippet | null {
  const build = SNIPPETS[helpKey];
  return build ? build(ctx) : null;
}

/** スニペットを持つ指標（テストと /code の一覧で使う）。 */
export const SNIPPET_KEYS: string[] = Object.keys(SNIPPETS);
