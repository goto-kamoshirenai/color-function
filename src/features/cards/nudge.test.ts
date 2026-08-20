import { describe, it, expect } from "vitest";
import { activeNudge, nudgeConditions, type NudgeInput } from "./nudge";
import { NUDGE, NUDGE_KEYS } from "./nudgeSlot";
import { bookById } from "@/lib/references";
import { HARMONY_RULES } from "@/lib/assets";

const input = (over: Partial<NudgeInput>): NudgeInput => ({
  unit: "pair",
  view: "verify",
  hexes: [],
  fgHex: null,
  bgHex: null,
  rules: [],
  ...over,
});

describe("結果連動の書籍導線（1画面1件）", () => {
  it("送り先の書籍がすべて実在する", () => {
    for (const key of NUDGE_KEYS) {
      expect(bookById(NUDGE[key].bookId), key).toBeDefined();
    }
  });

  it("基準を満たしていれば何も出さない", () => {
    const pair = input({
      hexes: ["#000000", "#FFFFFF"],
      fgHex: "#000000",
      bgHex: "#FFFFFF",
    });
    expect(nudgeConditions(pair).contrast).toBe(false);
    expect(activeNudge(pair)).toBeNull();
  });

  it("通常テキストの AA を割ると、その指標の導線を選ぶ", () => {
    // 4.48:1 — AA（4.5:1）にわずかに届かない組み合わせ
    const pair = input({
      hexes: ["#777777", "#FFFFFF"],
      fgHex: "#777777",
      bgHex: "#FFFFFF",
    });
    expect(activeNudge(pair)).toBe("contrast");
  });

  it("複数の指標が同時に成立しても、選ばれるのは1件だけ", () => {
    // 見分けのつかない2色: グレースケール耐性・冗長性・色覚識別性がすべて成立する
    const palette = input({
      unit: "palette",
      hexes: ["#3366CC", "#3568CE", "#FFFFFF"],
      fgHex: "#3366CC",
      bgHex: "#FFFFFF",
      rules: HARMONY_RULES,
    });
    const cond = nudgeConditions(palette);
    expect(
      NUDGE_KEYS.filter((key) => cond[key]).length,
      "前提: 複数の条件が成立している",
    ).toBeGreaterThan(1);

    // 選ばれるのは LAYOUT で先に現れるカード（palette|verify では grayscale）
    expect(activeNudge(palette)).toBe("grayscale");
  });

  it("そのモードで描かれないカードの指標は選ばない", () => {
    // 設計ビューには導線を持つカードが1枚もない
    expect(
      activeNudge(
        input({
          unit: "palette",
          view: "design",
          hexes: ["#3366CC", "#3568CE"],
          fgHex: "#3366CC",
          bgHex: "#3568CE",
          rules: HARMONY_RULES,
        }),
      ),
    ).toBeNull();

    // ペア検証にはグレースケール耐性カードが無いので、条件が成立していても出ない
    const pair = input({
      hexes: ["#3366CC", "#3568CE"],
      fgHex: "#3366CC",
      bgHex: "#3568CE",
    });
    expect(nudgeConditions(pair).grayscale).toBe(true);
    expect(activeNudge(pair)).not.toBe("grayscale");
  });

  it("色が1色以下ならパレット系の条件は成立しない", () => {
    const cond = nudgeConditions(
      input({ unit: "palette", hexes: ["#123456"] }),
    );
    for (const key of NUDGE_KEYS) expect(cond[key], key).toBe(false);
  });
});
