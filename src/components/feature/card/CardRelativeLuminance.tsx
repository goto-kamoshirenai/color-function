import React from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import { useMyColorStore } from "@/store/myColorStore";
import ColorChip from "@/components/elements/ColorChip";
import {
  calculateRelativeLuminance,
  formatLuminance,
  getLuminanceLevel,
  getLuminanceBackgroundColor,
} from "@/libs/relativeLuminance";

interface LuminanceResultProps {
  color: string;
  label: string;
}

const LuminanceResult: React.FC<LuminanceResultProps> = ({ color, label }) => {
  const luminance = calculateRelativeLuminance(color);
  const formattedLuminance = formatLuminance(luminance);
  const level = getLuminanceLevel(luminance);
  const bgColorClass = getLuminanceBackgroundColor(luminance);
  const { textColorA, baseColorB } = useMyColorStore();
  return (
    <div
      className="flex items-center gap-2 py-2 border-b"
      style={{ borderColor: baseColorB ? baseColorB : textColorA }}
    >
      <div className="flex-shrink-0 w-24">
        <ColorChip color={color} label={label} />
      </div>
      <div className="flex-grow flex items-center gap-1">
        <div className="text-sm w-16">相対輝度:</div>
        <div className="font-bold text-lg w-16">{formattedLuminance}</div>
        <div
          className={`${bgColorClass} px-3 py-1 rounded-full text-sm font-medium `}
          style={{ color: textColorA }}
        >
          {level}
        </div>
      </div>
    </div>
  );
};

const CardRelativeLuminance: React.FC = () => {
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  } = useMyColorStore();

  const colorEntries = [
    { color: mainColorA, label: "MainA" },
    ...(mainColorB ? [{ color: mainColorB, label: "MainB" }] : []),
    { color: baseColorA, label: "BaseA" },
    ...(baseColorB ? [{ color: baseColorB, label: "BaseB" }] : []),
    { color: accentColorA, label: "AccentA" },
    ...(accentColorB ? [{ color: accentColorB, label: "AccentB" }] : []),
    { color: textColorA, label: "TextA" },
    ...(textColorB ? [{ color: textColorB, label: "TextB" }] : []),
  ];

  return (
    <PanelWrapper
      title="相対輝度 (Relative Luminance)"
      helpPanelKey="luminance"
    >
      <p className="text-sm ">
        相対輝度は、WCAG 2.0で定義されている色の明るさの指標です。
        値は0（黒）から1（白）の範囲で表され、コントラスト比の計算に使用されます。
      </p>
      <div className="flex flex-col">
        {colorEntries.map(({ color, label }) => (
          <LuminanceResult key={label} color={color} label={label} />
        ))}
      </div>
    </PanelWrapper>
  );
};

export default CardRelativeLuminance;
