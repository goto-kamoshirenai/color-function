import React from "react";
import ColorVariationChip from "./ColorVariationChip";
import { useMyColorStore } from "@/store/myColorStore";

type ColorVariationRowProps = {
  title: string;
  colors: Array<{ color: string; offset: number; isComplementary?: boolean }>;
  activeIndex: number | null;
  mainColor: string;
  menuOpenColor: string | null;
  onColorSelect: (index: number) => void;
  renderMenu: (color: string) => React.ReactNode;
};

const ColorVariationRow: React.FC<ColorVariationRowProps> = ({
  title,
  colors,
  activeIndex,
  mainColor,
  menuOpenColor,
  onColorSelect,
  renderMenu,
}) => {
  const { textColorA } = useMyColorStore();
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{title}</p>
      <div className="flex gap-2">
        {colors.map((item, index) => (
          <div key={index} className="relative">
            <ColorVariationChip
              color={item.color}
              isCenter={item.offset === 0}
              isSelected={menuOpenColor === item.color}
              mainColor={mainColor}
              onSelect={() => onColorSelect(index)}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              menuContent={
                activeIndex === index ? renderMenu(item.color) : null
              }
            />
            {item.isComplementary && (
              <div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 px-1 py-0.5  text-[10px] rounded-full whitespace-nowrap "
                style={{
                  color: textColorA,
                  cursor: "pointer",
                }}
                onClick={() => {
                  onColorSelect(index);
                }}
              >
                補色
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorVariationRow;
