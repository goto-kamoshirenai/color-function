"use client";

import { usePanelStore } from "@/store/panelStore";
import MyColorButton from "@/components/feature/my-color/MyColorButton";
import MyColorPanel from "@/components/feature/my-color/MyColorPanel";
import CardContrast from "@/components/feature/card/CardContrast";
import CardHSV from "@/components/feature/card/CardHSV";
import CardCSV from "@/components/feature/card/CardCSV";
import CardEntropy from "@/components/feature/card/CardEntropy";
import ColorExtend from "@/components/feature/card/ColorExtend";
import { useMyColorStore } from "@/store/myColorStore";
import CardCIEDE2000 from "@/components/feature/card/CardCIEDE2000";
import AboutPanel from "@/components/feature/about/AboutPanel";
import ContactPanel from "@/components/feature/contact/ContactPanel";
import HelpExpend from "@/components/feature/help/HelpExpend";
import HelpContrast from "@/components/feature/help/HelpContrast";
import HelpCIEDE2000 from "@/components/feature/help/HelpCIEDE2000";
import HelpHSV from "@/components/feature/help/HelpHSV";
import HelpEntropy from "@/components/feature/help/HelpEntropy";
import { useHelpPanelStore } from "@/store/helpPanelStore";

export default function Home() {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    isShowCardCSVPanel,
    isShowCardEntropyPanel,
    isShowColorExtendPanel,
    isShowCardCIEDE2000Panel,
  } = usePanelStore();
  const { textColorA } = useMyColorStore();
  const { helpPanelKey } = useHelpPanelStore();

  // ヘルプパネルのレンダリング
  const renderHelpPanel = () => {
    switch (helpPanelKey) {
      case "expend":
        return <HelpExpend />;
      case "contrast":
        return <HelpContrast />;
      case "cie2000":
        return <HelpCIEDE2000 />;
      case "hsv":
        return <HelpHSV />;
      case "entropy":
        return <HelpEntropy />;
      default:
        return null;
    }
  };

  return (
    <>
      <main
        className="flex flex-wrap gap-2  p-8 ml-8 "
        style={{ color: textColorA }}
      >
        {isShowColorExtendPanel && <ColorExtend />}
        {isShowCardContrastPanel && <CardContrast />}
        {isShowCardCIEDE2000Panel && <CardCIEDE2000 />}
        {isShowCardEntropyPanel && <CardEntropy />}
        {isShowCardHSVPanel && <CardHSV />}
        {isShowCardCSVPanel && <CardCSV />}
      </main>
      <MyColorButton />
      <MyColorPanel />
      <AboutPanel />
      <ContactPanel />

      {renderHelpPanel()}
    </>
  );
}
