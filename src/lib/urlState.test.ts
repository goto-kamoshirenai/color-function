import { describe, it, expect } from "vitest";
import { encodePalette, decodePalette } from "./urlState";

describe("encodePalette / decodePalette", () => {
  it("#p= にカンマ連結・大文字HEX（# 抜き, docs/10 §3）", () => {
    expect(encodePalette(["#1f2933", "#2d6cdf"])).toBe("#p=1F2933,2D6CDF");
  });

  it("往復で元の色（大文字 # 付き）に戻る", () => {
    const hexes = ["#1F2933", "#2D6CDF", "#E4572E"];
    expect(decodePalette(encodePalette(hexes))).toEqual(hexes);
  });

  it("6桁HEX以外は除外する", () => {
    expect(decodePalette("#p=1F2933,zzz,2D6CDF")).toEqual([
      "#1F2933",
      "#2D6CDF",
    ]);
  });

  it("p= が無ければ null", () => {
    expect(decodePalette("#foo=bar")).toBeNull();
    expect(decodePalette("")).toBeNull();
  });

  it("有効な色が無ければ null", () => {
    expect(decodePalette("#p=zzz")).toBeNull();
  });
});
