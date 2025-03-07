import React from "react";
import { HelpWrapper } from "@/components/elements/HelpWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useHelpPanelStore } from "@/store/helpPanelStore";

const HelpPreview = () => {
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  const { t } = useTranslation();

  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.sidebar.preview}>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">配色プレビュー</h3>
          <p>
            このパネルでは、設定した配色を様々なレイアウトでプレビューすることができます。
          </p>
          <p>
            左側のサイドバーから表示したいプレビューを選択し、右側で実際の配色を確認できます。
          </p>
          <p>
            プレビューは、Main、Base、Accent、Textの各色を使用して表示されます。
          </p>
          <p>
            それぞれの色にはAとBがあり、Bが設定されていない場合はAの色が使用されます。
          </p>
          <p>
            このプレビューを参考に、配色のバランスや視認性を確認することができます。
          </p>
        </div>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpPreview;
