"use client";

import { useMyColorStore } from "@/store/myColorStore";
import React from "react";

const PanelWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const { getHoverBaseColor, baseColorB, textColorA } = useMyColorStore();
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
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

export default PanelWrapper;
