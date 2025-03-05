import {
  HelpImage,
  HelpWrapper,
  HelpWrapperItem,
} from "@/components/elements/HelpWrapper";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useHelpPanelStore } from "@/store/helpPanelStore";
import React from "react";

const HelpExpend = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.help.expend.title}>
        <p>{t.help.expend.text1}</p>
        <p>{t.help.expend.text2}</p>
        <HelpWrapperItem step={1}>
          <h3>{t.help.expend.step1}</h3>
          <HelpImage src="/help/expend/step1.png" alt="step1" />
        </HelpWrapperItem>
        <HelpWrapperItem step={2}>
          <p>{t.help.expend.step2}</p>
          <HelpImage src="/help/expend/step2.png" alt="step2" />
        </HelpWrapperItem>
        <HelpWrapperItem step={3}>
          <p>{t.help.expend.step3}</p>
          <HelpImage src="/help/expend/step3.png" alt="step3" />
        </HelpWrapperItem>
        <HelpWrapperItem step={4}>
          <p>{t.help.expend.step4}</p>
          <HelpImage src="/help/expend/step4.png" alt="step4" />
        </HelpWrapperItem>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpExpend;
