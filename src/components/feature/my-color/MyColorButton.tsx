"use client";

import { useMyColorStore } from "@/store/myColorStore";
import SlashIcon from "@/components/elements/SlashIcon";
import React, { useEffect, useState } from "react";
import { usePanelStore } from "@/store/panelStore";
import {
  defaultAccentColor,
  defaultBaseColor,
  defaultMainColor,
  defaultTextColor,
} from "@/const/colorConst";

const MyColorButton = () => {
  const { toggleMyColorPanel } = usePanelStore();
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    textColorA,
    getHoverMainColor,
    getHoverAccentColor,
    getHoverTextColor,
  } = useMyColorStore();
  const [isDefaultColor, setIsDefaultColor] = useState(false);

  useEffect(() => {
    setIsDefaultColor(
      mainColorA === defaultMainColor &&
        baseColorA === defaultBaseColor &&
        accentColorA === defaultAccentColor &&
        textColorA === defaultTextColor
    );
  }, [mainColorA, baseColorA, accentColorA, textColorA]);

  return (
    <div className="fixed bottom-0 right-0 w-screen flex justify-end items-center p-4">
      <div className="flex items-center gap-2 sm:gap-4 flex-row-reverse">
        <div
          className="flex items-center p-2 rounded-lg transition-colors duration-300 z-20"
          style={{
            border: `1px solid ${mainColorA}`,
            backgroundColor: baseColorA,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `1px solid ${mainColorB}`;
            e.currentTarget.style.backgroundColor = baseColorB
              ? baseColorB
              : baseColorA;
            e.currentTarget.style.boxShadow = baseColorB
              ? "none"
              : "0 0 6px 0 rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = `1px solid ${mainColorA}`;
            e.currentTarget.style.backgroundColor = baseColorA;
            e.currentTarget.style.boxShadow = "none";
          }}
          onClick={toggleMyColorPanel}
        >
          <div className="relative">
            <SlashIcon
              color={accentColorA}
              hoverColor={getHoverAccentColor()}
              className="w-4"
            />
          </div>
          <div
            className="w-4 h-4 rounded-full"
            style={{
              backgroundColor: mainColorA,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getHoverMainColor();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = mainColorA;
            }}
          />
          <p
            style={{
              color: textColorA,
              marginLeft: "0.2rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = getHoverTextColor();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = textColorA;
            }}
          >
            Aa
          </p>
        </div>

        {isDefaultColor && (
          <div className="animate-fade-in-up z-10 max-w-[180px] xs:max-w-[200px] sm:max-w-[250px]">
            <div className="relative bg-black text-white p-3  rounded-xl shadow-lg border border-gray-600">
              <p className="text-white text-xs xs:text-sm font-medium">
                ここをクリックして配色を設定
              </p>
              <div className="absolute w-3 sm:w-4 h-3 sm:h-4 bg-black rotate-45 top-1/2 -right-1.5 sm:-right-2 transform -translate-y-1/2 border-t border-r border-gray-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyColorButton;
