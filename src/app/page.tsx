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

export default function Home() {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    isShowCardCSVPanel,
    isShowCardEntropyPanel,
    isShowColorExtendPanel,
  } = usePanelStore();
  const { textColorA } = useMyColorStore();

  return (
    <>
      <main
        className="flex flex-wrap gap-2  p-8 ml-8 "
        style={{ color: textColorA }}
      >
        {isShowColorExtendPanel && <ColorExtend />}
        {isShowCardContrastPanel && <CardContrast />}
        {isShowCardEntropyPanel && <CardEntropy />}
        {isShowCardHSVPanel && <CardHSV />}
        {isShowCardCSVPanel && <CardCSV />}
      </main>
      <MyColorButton />
      <MyColorPanel />
    </>
  );
}
