"use client";

import CardContrast from "@/components/feature/card/CardContrast";
import CardHSV from "@/components/feature/card/CardHSV";
import MyColorButton from "@/components/feature/my-color/MyColorButton";
import MyColorPanel from "@/components/feature/my-color/MyColorPanel";
import { usePanelStore } from "@/store/panelStore";

export default function Home() {
  const { isShowCardContrastPanel, isShowCardHSVPanel } = usePanelStore();

  return (
    <>
      <main className="flex flex-wrap gap-2  p-8 ml-8">
        {isShowCardContrastPanel && <CardContrast />}
        {isShowCardHSVPanel && <CardHSV />}
      </main>
      <MyColorButton />
      <MyColorPanel />
    </>
  );
}
