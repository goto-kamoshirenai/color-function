import React from "react";
import { HelpWrapper } from "@/components/elements/HelpWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useHelpPanelStore } from "@/store/helpPanelStore";

const HelpLuminance = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();

  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.sidebar.luminance}>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">相対輝度とは</h3>
          <p>
            相対輝度（Relative Luminance）は、WCAG
            2.0で定義されている色の明るさを表す指標です。
            この値は、人間の目がどのように色の明るさを知覚するかを数値化したものです。
          </p>
          <p>
            相対輝度は0（黒）から1（白）の範囲で表され、コントラスト比の計算に使用されます。
            WCAGのコントラスト比は、2つの色の相対輝度を比較することで算出されます。
          </p>
          <h3 className="text-lg font-bold mt-2">計算方法</h3>
          <p>相対輝度の計算は以下の手順で行われます：</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>RGB値を0-1の範囲に正規化する</li>
            <li>各色成分にガンマ補正を適用する</li>
            <li>
              R、G、Bの値に重み付けをして合計する（R: 0.2126, G: 0.7152, B:
              0.0722）
            </li>
          </ol>
          <p className="mt-2">
            この重み付けは、人間の目が緑色に最も敏感で、青色に最も鈍感であることを反映しています。
          </p>
          <h3 className="text-lg font-bold mt-2">相対輝度の活用</h3>
          <p>相対輝度の値を知ることで、以下のような判断ができます：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>色の明るさの客観的な評価</li>
            <li>テキストと背景のコントラスト比の計算</li>
            <li>アクセシビリティ基準への適合性の確認</li>
          </ul>
          <p className="mt-2">
            WCAG
            2.2では、テキストと背景のコントラスト比が4.5:1以上であることを推奨しています（AA基準）。
            大きなテキストの場合は3:1以上が推奨されます。
          </p>
        </div>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpLuminance;
