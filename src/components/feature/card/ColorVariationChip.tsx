import React from "react";

type ColorVariationChipProps = {
  color: string;
  isCenter: boolean;
  isSelected: boolean;
  mainColor: string;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  menuContent?: React.ReactNode;
};

const ColorVariationChip: React.FC<ColorVariationChipProps> = ({
  color,
  isCenter,
  isSelected,
  mainColor,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  menuContent,
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center">
        {isCenter && (
          <div className="w-[2px] h-8" style={{ backgroundColor: mainColor }} />
        )}
        <div className="relative" onClick={onSelect}>
          <div
            className="w-8 h-8 rounded-md cursor-pointer"
            style={{
              backgroundColor: color,
              border: isSelected
                ? `2px solid ${mainColor}`
                : `1px solid transparent`,
              marginLeft: isCenter ? "8px" : "0",
              marginRight: isCenter ? "8px" : "0",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          {menuContent}
        </div>
        {isCenter && (
          <div className="w-[2px] h-8" style={{ backgroundColor: mainColor }} />
        )}
      </div>
    </div>
  );
};

export default ColorVariationChip;
