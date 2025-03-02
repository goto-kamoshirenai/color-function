import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMyColorStore } from "@/store/myColorStore";
import {
  ContrastLevel,
  formatContrastRatio,
  getContrastRatio,
  getWCAGLevel,
} from "@/libs/wcag";
import React from "react";
import ColorChip from "@/components/elements/ColorChip";

interface ContrastResultProps {
  textColorA: string;
  textColorB?: string;
  colorA: string;
  colorB?: string;
  label: string;
}

interface ContrastPair {
  textColor: string;
  bgColor: string;
  textLabel: string;
  bgLabel: string;
}

const ContrastResult: React.FC<ContrastResultProps> = ({
  textColorA,
  textColorB,
  colorA,
  colorB,
  label,
}) => {
  const getLevelColor = (level: ContrastLevel) => {
    switch (level) {
      case "AAA(適合)":
        return "w-24 text-center font-bold bg-sky-600 text-white px-2 py-1 rounded-full";
      case "AA(適合)":
        return "w-24 text-center font-bold bg-lime-600 text-white px-2 py-1 rounded-full";
      case "不適合":
        return "w-24 text-center font-bold bg-pink-600 text-white px-2 py-1 rounded-full";
    }
  };

  // 有効な色の組み合わせを生成
  const getValidPairs = (): ContrastPair[] => {
    const pairs: ContrastPair[] = [
      {
        textColor: textColorA,
        bgColor: colorA,
        textLabel: "TextA",
        bgLabel: `${label}A`,
      },
    ];

    if (colorB) {
      pairs.push({
        textColor: textColorA,
        bgColor: colorB,
        textLabel: "TextA",
        bgLabel: `${label}B`,
      });
    }
    if (textColorB) {
      pairs.push({
        textColor: textColorB,
        bgColor: colorA,
        textLabel: "TextB",
        bgLabel: `${label}A`,
      });
      if (colorB) {
        pairs.push({
          textColor: textColorB,
          bgColor: colorB,
          textLabel: "TextB",
          bgLabel: `${label}B`,
        });
      }
    }

    return pairs;
  };

  const pairs = getValidPairs();

  return (
    <div className="flex flex-col ">
      <div className="font-medium text-lg">{label}</div>
      <div className="flex flex-col gap-1">
        {pairs.map((pair, index) => {
          const ratio = getContrastRatio(pair.textColor, pair.bgColor);
          const level = getWCAGLevel(ratio);
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <ColorChip color={pair.textColor} label={pair.textLabel} />
              <span>/</span>
              <ColorChip
                color={pair.bgColor}
                label={pair.bgLabel}
                styleType="equal"
              />
              <span>:</span>
              <span>コントラスト比</span>
              <span className="font-bold min-w-[60px] text-right">
                {formatContrastRatio(ratio)}
              </span>
              <span>→</span>
              <span className={getLevelColor(level)}>{level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CardContrast = () => {
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
  } = useMyColorStore();

  return (
    <PanelWrapper title={t.sidebar.contrast}>
      <p className="text-sm text-gray-500">
        [AAA]:7.0以上 [AA]:4.5以上 [不適合]:3.0未満
      </p>
      <div className="flex flex-col">
        <ContrastResult
          textColorA={textColorA}
          textColorB={textColorB}
          colorA={mainColorA}
          colorB={mainColorB}
          label="Main"
        />
        <ContrastResult
          textColorA={textColorA}
          textColorB={textColorB}
          colorA={baseColorA}
          colorB={baseColorB}
          label="Base"
        />
        <ContrastResult
          textColorA={textColorA}
          textColorB={textColorB}
          colorA={accentColorA}
          colorB={accentColorB}
          label="Accent"
        />
      </div>
    </PanelWrapper>
  );
};

export default CardContrast;
