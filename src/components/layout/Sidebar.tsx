"use client";

import React, { useState } from "react";
import { usePanelStore } from "@/store/panelStore";
import { MdBrightness6, MdEqualizer, MdTextSnippet } from "react-icons/md";
import { IconType } from "react-icons";
import { useMyColorStore } from "@/store/myColorStore";
import { useTranslation } from "@/contexts/TranslationContext";

interface SidebarButtonProps {
  baseColorA: string;
  isActive: boolean;
  onClick: () => void;
  Icon: IconType;
  label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  baseColorA,
  isActive,
  onClick,
  Icon,
  label,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center rounded-full overflow-hidden transition-all duration-300 ease-in-out h-9 group"
      style={{
        color: isActive ? baseColorA : "black",
        backgroundColor: isActive ? "black" : baseColorA,
        width: isHovered ? "auto" : "36px",
        paddingRight: isHovered ? "1rem" : "0",
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
    toggleCardContrastPanel,
    toggleCardHSVPanel,
    toggleCardCSVPanel,
  } = usePanelStore();
  const { baseColorA } = useMyColorStore();
  const { t } = useTranslation();

  return (
    <div className="fixed left-0 h-screen flex flex-col gap-3 p-3 z-40 justify-center">
      <SidebarButton
        baseColorA={baseColorA}
        isActive={isShowCardContrastPanel}
        onClick={toggleCardContrastPanel}
        Icon={MdBrightness6}
        label={t.sidebar.contrast}
      />
      <SidebarButton
        baseColorA={baseColorA}
        isActive={isShowCardHSVPanel}
        onClick={toggleCardHSVPanel}
        Icon={MdEqualizer}
        label={t.sidebar.hsv}
      />
      <SidebarButton
        baseColorA={baseColorA}
        isActive={isShowCardCSVPanel}
        onClick={toggleCardCSVPanel}
        Icon={MdTextSnippet}
        label={t.sidebar.csv}
      />
    </div>
  );
};

export default Sidebar;
