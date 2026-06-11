import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferencesButton } from "./ReferencesButton";
import { REFERENCES } from "@/lib/references";

describe("ReferencesButton（参考資料）", () => {
  it("資料がある指標ではボタンが出て、外部リンク一覧を開ける", async () => {
    const user = userEvent.setup();
    render(<ReferencesButton helpKey="contrast" />);

    await user.click(
      screen.getByRole("button", { name: /WCAG コントラスト比 の参考資料/ }),
    );

    const links = (await screen.findAllByRole("link")).filter(
      (l) => l.getAttribute("target") === "_blank",
    );
    expect(links).toHaveLength(REFERENCES.contrast.length);
    for (const link of links) {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
    // /learn への内部リンクも持つ
    expect(
      screen.getByRole("link", { name: "すべての資料を見る" }),
    ).toBeInTheDocument();
  });

  it("資料がない指標では何も描画しない", () => {
    const { container } = render(<ReferencesButton helpKey="usage" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("全リンクが https/http の妥当な URL", () => {
    for (const refs of Object.values(REFERENCES)) {
      for (const r of refs) {
        expect(() => new URL(r.url)).not.toThrow();
        expect(r.url).toMatch(/^https?:\/\//);
      }
    }
  });
});
