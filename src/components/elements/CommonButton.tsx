import React from "react";
import { useMyColorStore } from "@/store/myColorStore";

interface CommonButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => {
  const { mainColorA, mainColorB, baseColorA, accentColorA, textColorA } =
    useMyColorStore();

  return (
    <button
      className={`flex items-center justify-center px-6 py-2 rounded-lg font-bold ${className}`}
      style={{
        backgroundColor: disabled ? "#cccccc" : mainColorA,
        color: baseColorA,
        transition: "all 0.3s ease",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = mainColorB
            ? mainColorB
            : accentColorA;
          e.currentTarget.style.color = mainColorB ? baseColorA : textColorA;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = mainColorA;
          e.currentTarget.style.color = baseColorA;
        }
      }}
    >
      {children}
    </button>
  );
};

export default CommonButton;
