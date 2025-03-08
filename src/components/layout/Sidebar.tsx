"use client";

import React, { useState } from "react";
import { usePanelStore } from "@/store/panelStore";
import {
  MdBrightness6,
  MdEqualizer,
  MdTextSnippet,
  MdFitbit,
  MdPalette,
  MdOutlineFilterBAndW,
  MdPreview,
  MdLightbulb,
} from "react-icons/md";
import { IconType } from "react-icons";
import { useMyColorStore } from "@/store/myColorStore";
import { useTranslation } from "@/contexts/TranslationContext";

interface SidebarButtonProps {
  isActive: boolean;
  onClick: () => void;
  Icon: IconType;
  label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  isActive,
  onClick,
  Icon,
  label,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { baseColorA } = useMyColorStore();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center rounded-full overflow-hidden transition-all duration-300 ease-in-out h-9 group mb-1"
      style={{
        color: isActive ? baseColorA : "black",
        backgroundColor: isActive ? "black" : baseColorA,
        width: isHovered ? "auto" : "36px",
        paddingRight: isHovered ? "1rem" : "0",
        flexShrink: 0,
      }}
    >
      <div className="w-9 h-9 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <span
        className="relative whitespace-nowrap transition-opacity duration-200 ease-in-out text-sm"
        style={{
          opacity: isHovered ? 1 : 0,
          transitionDelay: isHovered ? "150ms" : "0ms",
        }}
      >
        {label}
        {!isActive && (
          <div
            className="absolute -bottom-[2px] left-0 w-full h-[1px] transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "currentColor",
              transform: isHovered ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              opacity: isHovered ? 0.7 : 0,
              transitionDelay: isHovered ? "200ms" : "0ms",
            }}
          />
        )}
      </span>
    </button>
  );
};

const Sidebar = () => {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    isShowCardCSVPanel,
    isShowCardEntropyPanel,
    isShowColorExtendPanel,
    isShowCardCIEDE2000Panel,
    isShowCardPreviewSVGPanel,
    isShowCardRelativeLuminancePanel,
    toggleCardContrastPanel,
    toggleCardHSVPanel,
    toggleCardCSVPanel,
    toggleCardEntropyPanel,
    toggleColorExtendPanel,
    toggleCardCIEDE2000Panel,
    toggleCardPreviewSVGPanel,
    toggleCardRelativeLuminancePanel,
  } = usePanelStore();
  const { t } = useTranslation();

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col p-3 z-40"
      style={{
        height: "50vh",
        maxHeight: "50vh",
        overflowY: "auto",
        overflowX: "hidden",
        direction: "rtl",
        paddingLeft: "12px",
        paddingRight: "6px",
      }}
    >
      <div
        className="flex flex-col gap-3 justify-center"
        style={{ direction: "ltr" }}
      >
        <SidebarButton
          isActive={isShowColorExtendPanel}
          onClick={toggleColorExtendPanel}
          Icon={MdPalette}
          label={t.sidebar.colorExtend}
        />
        <SidebarButton
          isActive={isShowCardPreviewSVGPanel}
          onClick={toggleCardPreviewSVGPanel}
          Icon={MdPreview}
          label={t.sidebar.preview}
        />
        <SidebarButton
          isActive={isShowCardContrastPanel}
          onClick={toggleCardContrastPanel}
          Icon={MdBrightness6}
          label={t.sidebar.contrast}
        />
        <SidebarButton
          isActive={isShowCardRelativeLuminancePanel}
          onClick={toggleCardRelativeLuminancePanel}
          Icon={MdLightbulb}
          label={t.sidebar.luminance}
        />
        <SidebarButton
          isActive={isShowCardCIEDE2000Panel}
          onClick={toggleCardCIEDE2000Panel}
          Icon={MdOutlineFilterBAndW}
          label={t.sidebar.ciede2000}
        />
        <SidebarButton
          isActive={isShowCardEntropyPanel}
          onClick={toggleCardEntropyPanel}
          Icon={MdFitbit}
          label={t.sidebar.entropy}
        />
        <SidebarButton
          isActive={isShowCardHSVPanel}
          onClick={toggleCardHSVPanel}
          Icon={MdEqualizer}
          label={t.sidebar.hsv}
        />
        <SidebarButton
          isActive={isShowCardCSVPanel}
          onClick={toggleCardCSVPanel}
          Icon={MdTextSnippet}
          label={t.sidebar.csv}
        />
      </div>
    </div>
  );
};

export default Sidebar;
