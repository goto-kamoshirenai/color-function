import React from "react";
import { usePanelStore } from "@/store/panelStore";
import { MdBrightness6, MdColorLens } from "react-icons/md";
import { IconType } from "react-icons";

interface SidebarButtonProps {
  isActive: boolean;
  onClick: () => void;
  Icon: IconType;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  isActive,
  onClick,
  Icon,
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors ${
      isActive ? "text-mono-400" : "text-mono-950"
    }`}
    style={{
      backgroundColor: isActive ? "black" : "#a3a3a3",
    }}
  >
    <Icon size={24} />
  </button>
);

const Sidebar = () => {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    toggleCardContrastPanel,
    toggleCardHSVPanel,
  } = usePanelStore();

  return (
    <div className="fixed left-0 h-screen flex flex-col gap-4 p-4 z-40  justify-center">
      <SidebarButton
        isActive={isShowCardContrastPanel}
        onClick={toggleCardContrastPanel}
        Icon={MdBrightness6}
      />
      <SidebarButton
        isActive={isShowCardHSVPanel}
        onClick={toggleCardHSVPanel}
        Icon={MdColorLens}
      />
    </div>
  );
};

export default Sidebar;
