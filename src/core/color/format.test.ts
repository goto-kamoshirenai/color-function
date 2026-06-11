import { describe, it, expect } from "vitest";
import { formatColor, formatColorCss } from "./format";

describe("formatColor", () => {
  it("hex は大文字の HEX をそのまま返す", () => {
    expect(formatColor("#2d6cdf", "hex")).toBe("#2D6CDF");
  });

  it("rgb は 0–255 のカンマ区切り", () => {
    expect(formatColor("#2D6CDF", "rgb")).toBe("45, 108, 223");
  });

  it("hsl は角度と%", () => {
    expect(formatColor("#FF0000", "hsl")).toBe("0°, 100%, 50%");
  });

  it("hsv は角度と%", () => {
    expect(formatColor("#FF0000", "hsv")).toBe("0°, 100%, 100%");
  });

  it("不正な HEX はそのまま返す", () => {
    expect(formatColor("#XYZ", "rgb")).toBe("#XYZ");
  });
});

describe("formatColorCss", () => {
  it("hex は HEX のまま", () => {
    expect(formatColorCss("#2d6cdf", "hex")).toBe("#2D6CDF");
  });

  it("rgb/hsl/hsv は関数表記", () => {
    expect(formatColorCss("#2D6CDF", "rgb")).toBe("rgb(45, 108, 223)");
    expect(formatColorCss("#FF0000", "hsl")).toBe("hsl(0, 100%, 50%)");
    expect(formatColorCss("#FF0000", "hsv")).toBe("hsv(0, 100%, 100%)");
  });
});
