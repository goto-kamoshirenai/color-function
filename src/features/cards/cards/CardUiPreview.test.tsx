import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { CardUiPreview } from "./CardUiPreview";
import { resetColorStore, useColorStore } from "@/store/useColorStore";
import { setLocale } from "@/lib/i18n/locale";

describe("CardUiPreview", () => {
  beforeEach(() => {
    resetColorStore(["#FFFFFF", "#111111", "#2D6CDF", "#E4572E"]);
    act(() => useColorStore.getState().setView("design"));
    setLocale("ja");
  });

  afterEach(() => setLocale("ja"));

  it("サンプル文言は日本語 UI で日本語になる", () => {
    render(<CardUiPreview number="01" />);
    expect(screen.getByText("見出しテキスト")).toBeInTheDocument();
    expect(screen.getByText(/本文テキストのサンプル/)).toBeInTheDocument();
  });

  it("英語 UI ではサンプル文言も英語になる（ハードコード禁止）", () => {
    act(() => setLocale("en"));
    render(<CardUiPreview number="01" />);
    expect(screen.getByText("Heading text")).toBeInTheDocument();
    expect(screen.getByText(/Sample body text/)).toBeInTheDocument();
    expect(screen.queryByText("見出しテキスト")).toBeNull();
  });

  it("2色未満では案内を表示", () => {
    resetColorStore(["#FFFFFF"]);
    render(<CardUiPreview number="01" />);
    expect(screen.getByText(/2色以上が必要/)).toBeInTheDocument();
  });
});
