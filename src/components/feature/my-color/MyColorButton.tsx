"use client";

import { useMyColorStore } from "@/store/myColorStore";
import SlashIcon from "@/components/elements/SlashIcon";
import React from "react";
import { usePanelStore } from "@/store/panelStore";

const MyColorButton = () => {
  const { toggleMyColorPanel } = usePanelStore();
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    accentColorA,
    textColorA,
    getHoverMainColor,
    getHoverBaseColor,
    getHoverAccentColor,
    getHoverTextColor,
  } = useMyColorStore();

  return (
    <div className="fixed bottom-0 right-0 w-screen flex justify-end items-center p-4">
      <div
        className="flex items-center p-2 rounded-lg transition-colors duration-300"
        style={{
          border: `1px solid ${mainColorA}`,
          backgroundColor: baseColorA,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = `1px solid ${mainColorB}`;
          e.currentTarget.style.backgroundColor = getHoverBaseColor();
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = `1px solid ${mainColorA}`;
          e.currentTarget.style.backgroundColor = baseColorA;
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
    </div>
  );
};

export default MyColorButton;
