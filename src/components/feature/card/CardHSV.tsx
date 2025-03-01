"use client";

import { useMyColorStore } from "@/store/myColorStore";
import { hexToHsv } from "@/libs/colorUtils";
import React from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import HueWheel from "@/components/elements/HueWheel";
import ValueMeter from "@/components/elements/ValueMeter";
import { useTranslation } from "@/contexts/TranslationContext";

interface ColorSet {
  colorA: string;
  colorB?: string;
  label: string;
}

const CardHSV = () => {
  const { t } = useTranslation();
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
    getHoverBaseColor,
  } = useMyColorStore();

  // 色セットの定義
  const colorSets: ColorSet[] = [
    { colorA: mainColorA, colorB: mainColorB, label: "Main Color" },
    { colorA: baseColorA, colorB: baseColorB, label: "Base Color" },
    { colorA: accentColorA, colorB: accentColorB, label: "Accent Color" },
    { colorA: textColorA, colorB: textColorB, label: "Text Color" },
  ];

  // HSV値の表示コンポーネント
  const HSVDisplay = ({ color }: { color: string }) => {
    const hsv = hexToHsv(color);
    if (!hsv) return null;

    return (
      <div
        className="flex items-end gap-3 rounded-md p-2"
        style={{
          border: `1px solid ${textColorA}`,
        }}
      >
        <HueWheel hue={hsv.h} color={color} />
        <ValueMeter value={hsv.s} label={`S:${hsv.s}`} />
        <ValueMeter value={hsv.v} label={`V:${hsv.v}`} />
      </div>
    );
  };

  const renderColorHSV = ({ colorA, colorB, label }: ColorSet) => {
    const hsvA = hexToHsv(colorA);
    if (!hsvA) return null;

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{label}</h3>
        </div>
        <div className="flex gap-2">
          <HSVDisplay color={colorA} />
          {colorB && <HSVDisplay color={colorB} />}
        </div>
      </div>
    );
  };

  return (
    <PanelWrapper title={t.sidebar.hsv}>
      <div
        className="flex flex-row flex-wrap gap-2"
        style={{ backgroundColor: getHoverBaseColor() }}
      >
        {colorSets.map((colorSet, index) => (
          <div key={index}>{renderColorHSV(colorSet)}</div>
        ))}
      </div>
    </PanelWrapper>
  );
};

export default CardHSV;
