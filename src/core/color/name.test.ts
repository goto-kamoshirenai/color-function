import { describe, it, expect } from "vitest";
import { nearestName, type ColorNameEntry } from "./name";
import { parseHex } from "./convert";

const dict: ColorNameEntry[] = [
  { name: "黒", hex: "#000000" },
  { name: "白", hex: "#FFFFFF" },
  { name: "赤", hex: "#E4572E" },
  { name: "青", hex: "#2D6CDF" },
];

describe("nearestName", () => {
  it("近い色の名前を返す", () => {
    const result = nearestName(parseHex("#fe0a00")!, dict);
    expect(result?.entry.name).toBe("赤");
  });

  it("完全一致は ΔE ≈ 0", () => {
    const result = nearestName(parseHex("#2D6CDF")!, dict);
    expect(result?.entry.name).toBe("青");
    expect(result?.deltaE).toBeCloseTo(0, 4);
  });

  it("空辞書は null", () => {
    expect(nearestName(parseHex("#123456")!, [])).toBeNull();
  });

  it("不正 HEX のみの辞書は null（不正エントリは無視する）", () => {
    const broken: ColorNameEntry[] = [
      { name: "壊れ1", hex: "zzz" },
      { name: "壊れ2", hex: "#12" },
      { name: "壊れ3", hex: "" },
    ];
    expect(nearestName(parseHex("#123456")!, broken)).toBeNull();
  });

  it("不正エントリが混じっても有効な最寄りを返す", () => {
    const mixed: ColorNameEntry[] = [
      { name: "壊れ", hex: "#gggggg" },
      { name: "青", hex: "#2D6CDF" },
    ];
    expect(nearestName(parseHex("#2D6CDF")!, mixed)?.entry.name).toBe("青");
  });
});
