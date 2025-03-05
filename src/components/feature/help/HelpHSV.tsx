import { HelpWrapper } from "@/components/elements/HelpWrapper";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useHelpPanelStore } from "@/store/helpPanelStore";
import Link from "next/link";
import React from "react";

const HelpHSV = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.sidebar.hsv}>
        <p>
          HSV色空間は、色を色相（Hue）、彩度（Saturation）、明度（Value）の3つの要素で表現する方法です。
        </p>
        <p>これらの要素は、色を直感的に理解し、操作するのに役立ちます。</p>

        <div className="mt-4">
          <h3 className="font-bold">色相（Hue）</h3>
          <p>色相は色合いを表し、0°から360°の角度で表現されます。</p>
          <p>例：0°は赤、120°は緑、240°は青を表します。</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">彩度（Saturation）</h3>
          <p>彩度は色の鮮やかさを表し、0%から100%の値で表現されます。</p>
          <p>0%はグレースケール（無彩色）、100%は最も鮮やかな色を表します。</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">明度（Value）</h3>
          <p>明度は色の明るさを表し、0%から100%の値で表現されます。</p>
          <p>0%は黒、100%は最も明るい色を表します。</p>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">HSV分析の活用方法</h3>
          <p>HSV分析は、色の調和や対比を理解するのに役立ちます。</p>
          <p>
            例えば、同じ色相で彩度や明度を変えることで、統一感のあるカラーパレットを作成できます。
          </p>
          <p>
            また、色相環の反対側にある色（補色）を選ぶことで、強い対比効果を生み出すことができます。
          </p>
        </div>

        <Link
          href="https://ja.wikipedia.org/wiki/HSV%E8%89%B2%E7%A9%BA%E9%96%93"
          target="_blank"
          className="mt-4"
        >
          <p className="text-blue-800 underline pl-8">
            HSV色空間について詳しく知る
          </p>
        </Link>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpHSV;
