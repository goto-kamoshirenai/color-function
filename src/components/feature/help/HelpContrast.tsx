import { HelpWrapper } from "@/components/elements/HelpWrapper";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useHelpPanelStore } from "@/store/helpPanelStore";
import Link from "next/link";
import React from "react";

const HelpContrast = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.help.contrast.title}>
        <p>{t.help.contrast.text1}</p>
        <p>{t.help.contrast.text2}</p>
        <Link
          href="https://waic.jp/translations/WCAG22/#contrast-enhanced"
          target="_blank"
          className="mt-4"
        >
          <p className="text-blue-800 underline pl-8">{t.help.contrast.link}</p>
        </Link>
        <p className="mt-4">{t.help.contrast.text3}</p>
        <p>{t.help.contrast.text4}</p>
        <p className="mt-4">{t.help.contrast.text5}</p>
        <p>{t.help.contrast.text6}</p>
        <p>{t.help.contrast.text7}</p>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpContrast;
