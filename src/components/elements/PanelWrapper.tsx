import React from "react";

const PanelWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="block w-50vw h-50vh bg-mono-300 rounded-lg">{children}</div>
  );
};

export default PanelWrapper;
