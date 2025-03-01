import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import React from "react";

const CardContrast = () => {
  const { t } = useTranslation();
  return (
    <PanelWrapper title={t.sidebar.contrast}>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Card Contrast</h1>
      </div>
    </PanelWrapper>
  );
};

export default CardContrast;
