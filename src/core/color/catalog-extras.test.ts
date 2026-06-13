import { describe, it, expect } from "vitest";
import {
  parseHex,
  toHex,
  rgbToHwb,
  rgbToCmyk,
  rgbToXyz,
  xyzToXy,
  rgbToLab,
  labToLch,
  rgbToOklab,
} from "./convert";
import {
  hspBrightness,
  correlatedColorTemp,
  warmCoolOf,
  grayscaleOf,
} from "./perception";
import { apcaContrast, apcaUsage } from "./apca";
import { mixColors, gradientSteps, isWebSafe, toWebSafe } from "./blend";
import { deltaE94, okLabDistance, deltaComponents } from "./difference";
import {
  confusablePairs,
  cvdConfusablePairs,
  warmCoolBalance,
  rolesCoverage,
  matchScheme,
} from "./analyze";
import {
  nudgeForContrast,
  suggestCvdSafe,
  suggestGapFill,
  invertLightness,
  sortOrder,
  equalizeLightness,
  assignRoles,
  rolesByOrder,
} from "./suggest";
import { contrastRatio, relativeLuminance } from "./contrast";
import { rgbToOklch, oklchToRgb } from "./convert";
import { simulateCvd } from "./cvd";

const hex = (h: string) => parseHex(h)!;

describe("変換の拡張（HWB/CMYK/XYZ/xy/LCH/OKLab）", () => {
  it("HWB: 白は W=100/B=0、黒は W=0/B=100", () => {
    expect(rgbToHwb(hex("#ffffff")).w).toBeCloseTo(100, 5);
    expect(rgbToHwb(hex("#ffffff")).b).toBeCloseTo(0, 5);
    expect(rgbToHwb(hex("#000000")).b).toBeCloseTo(100, 5);
  });

  it("CMYK: 純赤は C0 M100 Y100 K0、黒は K100", () => {
    const red = rgbToCmyk(hex("#ff0000"));
    expect(red.c).toBeCloseTo(0, 5);
    expect(red.m).toBeCloseTo(100, 5);
    expect(red.y).toBeCloseTo(100, 5);
    expect(red.k).toBeCloseTo(0, 5);
    expect(rgbToCmyk(hex("#000000")).k).toBe(100);
  });

  it("XYZ: 白は D65 白色点（Y=1）", () => {
    const w = rgbToXyz(hex("#ffffff"));
    expect(w.y).toBeCloseTo(1, 3);
    const xy = xyzToXy(w);
    expect(xy.x).toBeCloseTo(0.3127, 3);
    expect(xy.y).toBeCloseTo(0.329, 3);
  });

  it("LCH: 赤の色相は約40°、無彩色は h=0", () => {
    expect(labToLch(rgbToLab(hex("#ff0000"))).h).toBeCloseTo(40, 0);
    expect(labToLch(rgbToLab(hex("#808080"))).h).toBe(0);
  });

  it("OKLab: 白は l≈1", () => {
    expect(rgbToOklab(hex("#ffffff")).l).toBeCloseTo(1, 2);
  });
});

describe("知覚指標（HSP/色温度/暖寒/グレースケール）", () => {
  it("HSP は白で1・黒で0", () => {
    expect(hspBrightness(hex("#ffffff"))).toBeCloseTo(1, 5);
    expect(hspBrightness(hex("#000000"))).toBeCloseTo(0, 5);
  });

  it("白の相関色温度は 6500K 前後（D65 近傍）", () => {
    const cct = correlatedColorTemp(hex("#ffffff"));
    expect(cct).toBeGreaterThan(6000);
    expect(cct).toBeLessThan(7000);
  });

  it("暖寒分類: 赤=warm / 青=cool / グレー=neutral", () => {
    expect(warmCoolOf(hex("#e83015"))).toBe("warm");
    expect(warmCoolOf(hex("#2d6cdf"))).toBe("cool");
    expect(warmCoolOf(hex("#888888"))).toBe("neutral");
  });

  it("グレースケール等価は相対輝度を保つ", () => {
    const g = grayscaleOf(hex("#e83015"));
    expect(g.r).toBeCloseTo(g.g, 5);
    expect(relativeLuminance(g)).toBeCloseTo(
      relativeLuminance(hex("#e83015")),
      2,
    );
  });
});

describe("APCA", () => {
  it("既知値: #888 on #fff ≈ 63.06 / #fff on #888 ≈ -68.54", () => {
    expect(apcaContrast(hex("#888888"), hex("#ffffff"))).toBeCloseTo(63.06, 1);
    expect(apcaContrast(hex("#ffffff"), hex("#888888"))).toBeCloseTo(-68.54, 1);
  });

  it("既知値: #000 on #aaa ≈ 58.15 / #aaa on #000 ≈ -56.24", () => {
    expect(apcaContrast(hex("#000000"), hex("#aaaaaa"))).toBeCloseTo(58.15, 1);
    expect(apcaContrast(hex("#aaaaaa"), hex("#000000"))).toBeCloseTo(-56.24, 1);
  });

  it("同一色は 0、用途目安が引ける", () => {
    expect(apcaContrast(hex("#123456"), hex("#123456"))).toBe(0);
    expect(apcaUsage(90)).toBe("body");
    expect(apcaUsage(-65)).toBe("large");
    expect(apcaUsage(50)).toBe("ui");
    expect(apcaUsage(10)).toBe("fail");
  });
});

describe("ブレンド・グラデーション・Webセーフ", () => {
  it("multiply は暗く、screen は明るくなる", () => {
    const a = hex("#808080");
    const m = mixColors(a, a, "multiply");
    const s = mixColors(a, a, "screen");
    expect(m.r).toBeLessThan(128);
    expect(s.r).toBeGreaterThan(128);
  });

  it("グラデーションは端点を含む指定数の列", () => {
    const steps = gradientSteps("#000000", "#ffffff", "rgb", 5);
    expect(steps).toHaveLength(5);
    expect(steps[0]).toBe("#000000".toUpperCase());
    expect(steps[4]).toBe("#FFFFFF");
  });

  it("Webセーフ判定と丸め", () => {
    expect(isWebSafe("#FF6633")).toBe(true);
    expect(isWebSafe("#FF6634")).toBe(false);
    expect(toHex(toWebSafe(hex("#FF6634")))).toBe("#ff6633");
  });
});

describe("色差の拡張（ΔE94/OK距離/成分差）", () => {
  it("同一色は全指標 0", () => {
    const lab = rgbToLab(hex("#2d6cdf"));
    expect(deltaE94(lab, lab)).toBe(0);
    expect(
      okLabDistance(rgbToOklab(hex("#2d6cdf")), rgbToOklab(hex("#2d6cdf"))),
    ).toBe(0);
  });

  it("成分差: 白→黒は ΔL=-100・ΔC≈0", () => {
    const d = deltaComponents(
      rgbToLab(hex("#ffffff")),
      rgbToLab(hex("#000000")),
    );
    expect(d.dL).toBeCloseTo(-100, 0);
    expect(Math.abs(d.dC)).toBeLessThan(1);
  });
});

describe("パレット分析", () => {
  it("confusablePairs は近い色を検出する", () => {
    const pairs = confusablePairs(
      [hex("#ff0000"), hex("#fe0202"), hex("#0000ff")],
      10,
    );
    expect(pairs).toHaveLength(1);
    expect(pairs[0]).toMatchObject({ i: 0, j: 1 });
  });

  it("cvdConfusablePairs: 元色とその P 型シミュレーション結果は紛らわしい", () => {
    const red = hex("#ff0000");
    const confused = simulateCvd(red, "protan", 1);
    const pairs = cvdConfusablePairs([red, confused], "protan", 12);
    expect(pairs).toHaveLength(1);
  });

  it("warmCoolBalance の合計は色数に一致", () => {
    const b = warmCoolBalance([hex("#e83015"), hex("#2d6cdf"), hex("#888888")]);
    expect(b.warm + b.cool + b.neutral).toBe(3);
  });

  it("rolesCoverage: 白背景＋黒テキスト＋鮮やかな赤は主要役割を満たす", () => {
    const checks = rolesCoverage([
      hex("#ffffff"),
      hex("#111111"),
      hex("#e83015"),
    ]);
    const get = (k: string) => checks.find((c) => c.key === k)!;
    expect(get("background").ok).toBe(true);
    expect(get("text").ok).toBe(true);
    expect(get("accent").ok).toBe(true);
  });

  it("matchScheme: 補色ペアは complementary が最良", () => {
    const base = hex("#2d6cdf");
    const o = rgbToOklch(base);
    const comp = oklchToRgb({ l: o.l, c: o.c, h: (o.h + 180) % 360 });
    const rules = [
      { id: "complementary", hueOffsets: [0, 180] },
      { id: "analogous", hueOffsets: [-30, 0, 30] },
    ];
    const m = matchScheme([base, comp], rules);
    expect(m?.ruleId).toBe("complementary");
    expect(m!.score).toBeGreaterThan(80);
  });
});

describe("設計支援（ナッジ/CVDセーフ/補完/変換/並べ替え/ロール）", () => {
  it("nudgeForContrast: 低コントラストの fg を AA に届かせる", () => {
    const r = nudgeForContrast(hex("#777777"), hex("#888888"), 4.5);
    expect(r).not.toBeNull();
    expect(r!.reached).toBe(true);
    expect(contrastRatio(r!.rgb, hex("#888888"))).toBeGreaterThanOrEqual(4.5);
  });

  it("nudgeForContrast: 既に満たすなら null", () => {
    expect(nudgeForContrast(hex("#000000"), hex("#ffffff"), 4.5)).toBeNull();
  });

  it("suggestCvdSafe: 紛らわしい相手から離れる方向に調整", () => {
    const r = suggestCvdSafe(hex("#7a9a01"), [hex("#d34d00")], 12);
    expect(r.minDelta).toBeGreaterThanOrEqual(12);
  });

  it("suggestGapFill: 赤と青のパレットでは隙間（緑側など）を提案", () => {
    const fill = suggestGapFill([hex("#e83015"), hex("#2d6cdf")]);
    expect(fill).not.toBeNull();
  });

  it("invertLightness: 明色は暗く、暗色は明るく", () => {
    expect(rgbToOklch(invertLightness(hex("#eeeeee"))).l).toBeLessThan(0.5);
    expect(rgbToOklch(invertLightness(hex("#111111"))).l).toBeGreaterThan(0.5);
  });

  it("sortOrder: lightness は明→暗", () => {
    const rgbs = [hex("#000000"), hex("#ffffff"), hex("#808080")];
    expect(sortOrder(rgbs, "lightness")).toEqual([1, 2, 0]);
  });

  it("equalizeLightness: 端の明度を保ち中間を均等化", () => {
    const rgbs = [hex("#101010"), hex("#e0e0e0"), hex("#181818")];
    const out = equalizeLightness(rgbs);
    expect(out).toHaveLength(3);
    const ls = out.map((c) => rgbToOklch(c).l).sort((a, b) => a - b);
    expect(ls[1] - ls[0]).toBeCloseTo(ls[2] - ls[1], 1);
  });

  it("assignRoles: 背景・テキスト・プライマリが割当たる", () => {
    const roles = assignRoles([
      hex("#ffffff"),
      hex("#111111"),
      hex("#e83015"),
      hex("#2d6cdf"),
    ]);
    const byRole = Object.fromEntries(roles.map((r) => [r.role, r.index]));
    expect(byRole.background).toBe(0);
    expect(byRole.text).toBe(1);
    expect(byRole.primary).toBeGreaterThanOrEqual(2);
  });

  it("rolesByOrder: 並び順だけで位置=ロールを決定する（FG/BG非依存）", () => {
    const roles = rolesByOrder(5);
    const byRole = Object.fromEntries(roles.map((r) => [r.role, r.index]));
    expect(byRole.background).toBe(0);
    expect(byRole.text).toBe(1);
    expect(byRole.primary).toBe(2);
    expect(byRole.accent).toBe(3);
    expect(byRole.neutral).toBe(4);
  });

  it("rolesByOrder: 色数が少ないと末尾ロールから順に欠ける", () => {
    const two = Object.fromEntries(
      rolesByOrder(2).map((r) => [r.role, r.index]),
    );
    expect(two.background).toBe(0);
    expect(two.text).toBe(1);
    expect(two.primary).toBeUndefined();
    expect(rolesByOrder(0)).toEqual([]);
  });

  it("rolesByOrder: 色数が 5 を超えても 5 ロールまで（余剰は無視）", () => {
    expect(rolesByOrder(8)).toHaveLength(5);
  });
});
