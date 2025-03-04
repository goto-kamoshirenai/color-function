import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMyColorStore } from "@/store/myColorStore";
import React from "react";
import chroma from "chroma-js";
import ColorChip from "@/components/elements/ColorChip";

interface ColorOption {
  color: string;
  label: string;
}

const getDeltaE = (hex1: string, hex2: string): number => {
  const color1 = chroma(hex1);
  const color2 = chroma(hex2);
  return chroma.deltaE(color1, color2);
};

const getLevelColor = (deltaE: number) => {
  if (deltaE >= 5.0) {
    return "w-20 text-center font-bold bg-sky-600 text-white px-1 py-1 rounded-full";
  } else if (deltaE >= 2.0) {
    return "w-20 text-center font-bold bg-lime-600 text-white px-1 py-1 rounded-full";
  } else {
    return "w-20 text-center font-bold bg-pink-600 text-white px-1 py-1 rounded-full";
  }
};

const getLevel = (deltaE: number): string => {
  if (deltaE >= 5.0) {
    return "明確な差";
  } else if (deltaE >= 2.0) {
    return "認識可能";
  } else {
    return "差が小さい";
  }
};

const CardCIEDE2000 = () => {
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

  // 有効な色のリストを作成
  const colorOptions: ColorOption[] = [
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
    <PanelWrapper title={t.sidebar.ciede2000}>
      <p className="text-sm opacity-50">{t.description.ciede2000}</p>

      {/* 色差マトリックス */}
      <div className="overflow-x-auto">
        <table
          className="w-full mt-2"
          style={{
            border: baseColorB
              ? `1px solid ${textColorA}`
              : `1px solid ${baseColorB}`,
          }}
        >
          <thead>
            <tr>
              <th
                className="p-1 "
                style={{
                  border: baseColorB
                    ? `1px solid ${textColorA}`
                    : `1px solid ${baseColorB}`,
                }}
              ></th>
              {colorOptions.map((opt) => (
                <th
                  key={opt.label}
                  className="p-1 min-w-[100px]"
                  style={{
                    border: baseColorB
                      ? `1px solid ${textColorA}`
                      : `1px solid ${baseColorB}`,
                  }}
                >
                  <div className="flex items-center gap-1 justify-center ">
                    <ColorChip color={opt.color} label={opt.label} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colorOptions.map((rowOpt) => (
              <tr key={rowOpt.label}>
                <th
                  className="p-1 "
                  style={{
                    border: baseColorB
                      ? `1px solid ${textColorA}`
                      : `1px solid ${baseColorB}`,
                  }}
                >
                  <div className="flex items-center gap-1">
                    <ColorChip color={rowOpt.color} label={rowOpt.label} />
                  </div>
                </th>
                {colorOptions.map((colOpt) => {
                  if (rowOpt.label === colOpt.label) {
                    return (
                      <td
                        key={colOpt.label}
                        className="p-1  text-center"
                        style={{
                          border: baseColorB
                            ? `1px solid ${textColorA}`
                            : `1px solid ${baseColorB}`,
                        }}
                      >
                        -
                      </td>
                    );
                  }
                  const deltaE = getDeltaE(rowOpt.color, colOpt.color);
                  const level = getLevel(deltaE);
                  return (
                    <td
                      key={colOpt.label}
                      className="p-1 "
                      style={{
                        border: baseColorB
                          ? `1px solid ${textColorA}`
                          : `1px solid ${baseColorB}`,
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className="font-bold"
                          style={{
                            fontSize: "0.8rem",
                          }}
                        >
                          {deltaE.toFixed(2)}
                        </span>
                        <span
                          className={getLevelColor(deltaE)}
                          style={{ fontSize: "0.7rem" }}
                        >
                          {level}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelWrapper>
  );
};

export default CardCIEDE2000;
