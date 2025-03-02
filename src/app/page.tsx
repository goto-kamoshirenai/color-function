"use client";

import CardContrast from "@/components/feature/card/CardContrast";
import CardHSV from "@/components/feature/card/CardHSV";
import CardCSV from "@/components/feature/card/CardCSV";
import CardEntropy from "@/components/feature/card/CardEntropy";
import MyColorButton from "@/components/feature/my-color/MyColorButton";
import MyColorPanel from "@/components/feature/my-color/MyColorPanel";
import { usePanelStore } from "@/store/panelStore";

export default function Home() {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    isShowCardCSVPanel,
    isShowCardEntropyPanel,
  } = usePanelStore();

  return (
    <>
      <main className="flex flex-wrap gap-2  p-8 ml-8">
        {isShowCardEntropyPanel && <CardEntropy />}
        {isShowCardHSVPanel && <CardHSV />}
        {isShowCardContrastPanel && <CardContrast />}
        {isShowCardCSVPanel && <CardCSV />}
      </main>
      <MyColorButton />
      <MyColorPanel />
    </>
  );
}
