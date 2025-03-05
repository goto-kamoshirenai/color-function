"use client";

import { useMyColorStore } from "@/store/myColorStore";
import { MdHelpOutline } from "react-icons/md";
import React from "react";
import { HelpPanelKey } from "@/types/common";
import { useHelpPanelStore } from "@/store/helpPanelStore";

const PanelWrapper = ({
  children,
  title,
  helpPanelKey,
}: {
  children: React.ReactNode;
  title: string;
  helpPanelKey?: HelpPanelKey;
}) => {
  const { getHoverBaseColor, baseColorB, textColorA } = useMyColorStore();
  const { openHelpPanel } = useHelpPanelStore();
  return (
    <div
      className="block rounded-lg overflow-y-auto p-2"
      style={{
        width: "calc(50vw - 4rem)",
        height: "calc(50vh - 2rem)",
        backgroundColor: getHoverBaseColor(),
        border: baseColorB ? `none` : `1px solid ${textColorA}`,
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {helpPanelKey && (
          <MdHelpOutline
            className="w-6 h-6"
            onClick={() => openHelpPanel(helpPanelKey)}
          />
        )}
      </div>
      {children}
    </div>
  );
};

export default PanelWrapper;
