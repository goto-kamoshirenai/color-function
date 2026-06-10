import { describe, it, expect } from "vitest";
import { simulateCvd } from "./cvd";
import { parseHex, toHex } from "./convert";

const hex = (h: string) => parseHex(h)!;

describe("simulateCvd", () => {
  it("severity 0 は原色（単位行列）", () => {
    const red = hex("#e4572e");
    const out = simulateCvd(red, "protan", 0);
    expect(out.r).toBeCloseTo(red.r, 0);
    expect(out.g).toBeCloseTo(red.g, 0);
    expect(out.b).toBeCloseTo(red.b, 0);
  });

  it("出力は 0–255 に収まる", () => {
    for (const t of ["protan", "deutan", "tritan"] as const) {
      const out = simulateCvd(hex("#2d6cdf"), t, 1);
      for (const v of [out.r, out.g, out.b]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(255);
      }
    }
  });

  it("severity 1 は原色から変化する（P型の赤）", () => {
    const red = hex("#ff0000");
    expect(toHex(simulateCvd(red, "protan", 1))).not.toBe(toHex(red));
  });

  it("決定的（同入力→同出力）", () => {
    const a = simulateCvd(hex("#1b998b"), "deutan", 0.6);
    const b = simulateCvd(hex("#1b998b"), "deutan", 0.6);
    expect(toHex(a)).toBe(toHex(b));
  });
});
