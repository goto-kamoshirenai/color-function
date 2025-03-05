import { HelpWrapper } from "@/components/elements/HelpWrapper";
import ModalWrapper from "@/components/elements/ModalWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useHelpPanelStore } from "@/store/helpPanelStore";
import Link from "next/link";
import React from "react";

const HelpCIEDE2000 = () => {
  const { t } = useTranslation();
  const { isHelpPanelOpen, closeHelpPanel } = useHelpPanelStore();
  return (
    <ModalWrapper isOpen={isHelpPanelOpen} onClose={closeHelpPanel}>
      <HelpWrapper title={t.help.ciede2000.title}>
        <p>{t.help.ciede2000.text1}</p>
        <p>{t.help.ciede2000.text2}</p>
        <Link
          href="https://en.wikipedia.org/wiki/Color_difference#CIEDE2000"
          target="_blank"
          className="mt-4"
        >
          <p className="text-blue-800 underline pl-8">
            {t.help.ciede2000.link}
          </p>
        </Link>
        <p className="mt-4">{t.help.ciede2000.text3}</p>
        <p>{t.help.ciede2000.text4}</p>
        <p className="mt-4">{t.help.ciede2000.text5}</p>
        <p>{t.help.ciede2000.text6}</p>
        <p>{t.help.ciede2000.text7}</p>
      </HelpWrapper>
    </ModalWrapper>
  );
};

export default HelpCIEDE2000;
