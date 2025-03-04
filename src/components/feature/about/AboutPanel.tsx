"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationContext";
import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import ModalWrapper from "@/components/elements/ModalWrapper";

const AboutPanel = () => {
  const { t } = useTranslation();
  const { isAboutPanelOpen, toggleAboutPanel } = usePanelStore();
  const { mainColorA, textColorA, baseColorA } = useMyColorStore();

  return (
    <ModalWrapper
      isOpen={isAboutPanelOpen}
      onClose={toggleAboutPanel}
      backgroundColor={baseColorA}
    >
      <div className="flex flex-col items-center space-y-8 p-8 max-w-2xl mx-auto">
        <Image
          src="/color-function_big-logo.svg"
          alt="Color Follows Function"
          width={200}
          height={200}
          className="mb-8"
        />
        <div className="space-y-4 text-center" style={{ color: textColorA }}>
          <h1 className="text-3xl font-bold mb-4" style={{ color: mainColorA }}>
            {t.about.description1}
          </h1>
          <p className="text-xl mb-4">{t.about.description2}</p>
          <div className="" style={{ marginTop: "6rem" }}>
            <p>{t.about.description3}</p>
            <p>{t.about.description4}</p>
          </div>
          <div className="" style={{ marginTop: "6rem" }}>
            <p>{t.about.description5}</p>
            <p>{t.about.description6}</p>
          </div>
          <div className="" style={{ marginTop: "6rem" }}>
            <p>{t.about.description7}</p>
            <p>{t.about.description8}</p>
            <p>{t.about.description9}</p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AboutPanel;
