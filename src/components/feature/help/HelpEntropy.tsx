import { HelpWrapper } from "@/components/elements/HelpWrapper";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useHelpPanelStore } from "@/store/helpPanelStore";
import Link from "next/link";
import React from "react";

const HelpEntropy = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.sidebar.entropy}>
        <p>分布分析は、色彩の分布状態を数値化して評価するための機能です。</p>
        <p>
          この分析では、色相、彩度、明度の分布を視覚的に表示し、配色の特性を客観的に把握することができます。
        </p>

        <div className="mt-4">
          <h3 className="font-bold">色相分布</h3>
          <p>色相環上での色の分布状態を表示します。</p>
          <p>
            色相が均等に分布している場合は多様性が高く、特定の色相に集中している場合は統一感があります。
          </p>
          <p>
            色相分布の数値が高いほど、色相のバリエーションが豊かであることを示します。
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">彩度分布</h3>
          <p>彩度（色の鮮やかさ）の分布状態を表示します。</p>
          <p>
            彩度分布の数値が高いほど、彩度のレベルが統一されていることを示します。
          </p>
          <p>
            彩度が統一されていると視覚的な調和が生まれ、バラバラだと視覚的な緊張感が生まれます。
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">明度分布</h3>
          <p>明度（色の明るさ）の分布状態を表示します。</p>
          <p>
            明度分布の数値が高いほど、明度のバランスが取れていることを示します。
          </p>
          <p>明度のバランスが良いと、視認性や可読性が向上します。</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">分布分析の活用方法</h3>
          <p>分布分析は、以下のような場面で活用できます：</p>
          <ul className="list-disc pl-8 mt-2">
            <li>配色の調和度を客観的に評価する</li>
            <li>
              色彩設計の方向性を決定する（統一感を出すか、多様性を出すか）
            </li>
            <li>既存の配色を分析して、改善点を見つける</li>
            <li>ブランドカラーの一貫性を確認する</li>
          </ul>
        </div>

        <Link
          href="https://en.wikipedia.org/wiki/Color_theory"
          target="_blank"
          className="mt-4"
        >
          <p className="text-blue-800 underline pl-8">
            色彩理論について詳しく知る
          </p>
        </Link>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpEntropy;
