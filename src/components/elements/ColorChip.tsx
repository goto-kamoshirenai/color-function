import { useMyColorStore } from "@/store/myColorStore";
import React from "react";

interface ColorChipProps {
  color: string;
  label: string;
  size?: "sm" | "md";
  styleType?: "equal" | "even" | "none";
}

const ColorChip: React.FC<ColorChipProps> = ({
  color,
  label,
  size = "sm",
  styleType = "none",
}) => {
  const { baseColorA, baseColorB, textColorA } = useMyColorStore();

  return (
    <div className="flex items-center gap-1">
      <div
        className={`rounded-full ${size === "sm" ? "w-4 h-4" : "w-6 h-6"}`}
        style={{
          backgroundColor: color,
          border:
            color === baseColorA || color === baseColorB
              ? baseColorB
                ? `1px solid ${baseColorA}`
                : `1px solid ${textColorA}`
              : "none",
        }}
      />
      <p
        className={`block ${size === "sm" ? "text-sm" : "text-base"}`}
        style={{
          width: styleType === "equal" ? "3rem" : "none",
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default ColorChip;
