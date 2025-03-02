import React from "react";
import { useMyColorStore } from "@/store/myColorStore";

interface CommonButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  const { mainColorA, mainColorB, baseColorA, accentColorA, textColorA } =
    useMyColorStore();

  return (
    <button
      className={`flex items-center justify-center px-6 py-2 rounded-lg font-bold ${className}`}
      style={{
        backgroundColor: mainColorA,
        color: baseColorA,
        transition: "all 0.3s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = mainColorB
          ? mainColorB
          : accentColorA;
        e.currentTarget.style.color = mainColorB ? baseColorA : textColorA;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = mainColorA;
        e.currentTarget.style.color = baseColorA;
      }}
    >
      {children}
    </button>
  );
};

export default CommonButton;
