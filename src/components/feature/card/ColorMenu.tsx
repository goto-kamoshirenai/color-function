import { useMyColorStore } from "@/store/myColorStore";
import React, { useEffect, useRef } from "react";

type ColorMenuProps = {
  options: string[];
  onSelect: (option: string) => void;
  onClose: () => void;
};

const ColorMenu: React.FC<ColorMenuProps> = ({
  options,
  onSelect,
  onClose,
}) => {
  const { baseColorA, textColorA } = useMyColorStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute z-10 mt-1 py-1  rounded-md shadow-lg "
      style={{
        width: "10rem",
        backgroundColor: baseColorA,
        border: `1px solid ${textColorA}`,
      }}
    >
      {options.map((option) => (
        <button
          key={option}
          className="block w-full px-4 py-1 text-left text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(option);
          }}
        >
          <p
            style={{
              borderRadius: "0.25rem",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              border: "1px solid transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = `1px solid ${textColorA}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = `1px solid transparent`;
            }}
          >
            {option}に設定
          </p>
        </button>
      ))}
    </div>
  );
};

export default ColorMenu;
