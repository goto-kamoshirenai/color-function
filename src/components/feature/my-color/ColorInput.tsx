import {
  defaultAccentColor,
  defaultBaseColor,
  defaultMainColor,
  defaultTextColor,
} from "@/const/colorConst";
import { useMyColorStore } from "@/store/myColorStore";
import React, { useState, useEffect } from "react";
import { MdContentCopy, MdCheck, MdClear } from "react-icons/md";

interface ColorFieldProps {
  color: string;
  onChange: (color: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const ColorField: React.FC<ColorFieldProps> = ({
  color,
  onChange,
  placeholder,
  onClear,
}) => {
  const { mainColorA, getHoverBaseColor, textColorA, accentColorA } =
    useMyColorStore();
  const [localColor, setLocalColor] = useState(color);
  const [isCopied, setIsCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleColorChange = (value: string) => {
    setLocalColor(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/) || value === "") {
      onChange(value);
    }
  };

  const handleCopy = () => {
    if (localColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      navigator.clipboard.writeText(localColor);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={localColor.match(/^#[0-9A-Fa-f]{6}$/) ? localColor : "#000000"}
        onChange={(e) => handleColorChange(e.target.value)}
        className="w-10 h-10"
        style={{
          backgroundColor: "transparent",
          borderColor: mainColorA,
        }}
      />
      <div className="flex-1 relative">
        <input
          type="text"
          value={localColor}
          onChange={(e) => handleColorChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-3 py-2 border rounded-lg pr-20 focus:outline-none"
          style={{
            backgroundColor: getHoverBaseColor(),
            borderColor: isFocused ? accentColorA : undefined,
            boxShadow: isFocused ? `0 0 0 1px ${accentColorA}` : undefined,
          }}
          placeholder={placeholder}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          {localColor.match(/^#[0-9A-Fa-f]{6}$/) && (
            <button
              onClick={handleCopy}
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColorA }}
            >
              <div className="relative w-5 h-5">
                <MdContentCopy
                  size={20}
                  className="absolute transition-all duration-200"
                  style={{
                    opacity: isCopied ? 0 : 1,
                    transform: isCopied ? "scale(0.5)" : "scale(1)",
                  }}
                />
                <MdCheck
                  size={20}
                  className="absolute transition-all duration-200"
                  style={{
                    opacity: isCopied ? 1 : 0,
                    transform: isCopied ? "scale(1)" : "scale(1.5)",
                  }}
                />
              </div>
            </button>
          )}
          {onClear && (
            <button
              onClick={onClear}
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColorA }}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ColorInputProps {
  label: string;
  colorA: string;
  colorB?: string;
  type: "main" | "base" | "accent" | "text";
  onChangeA: (color: string) => void;
  onChangeB?: (color: string) => void;
}

const ColorInput = ({
  label,
  colorA,
  colorB,
  type,
  onChangeA,
  onChangeB,
}: ColorInputProps) => {
  const { textColorA, textColorB, getHoverTextColor } = useMyColorStore();
  const [showColorB, setShowColorB] = useState(!!colorB);

  const defaultColor =
    type === "main"
      ? defaultMainColor
      : type === "base"
      ? defaultBaseColor
      : type === "accent"
      ? defaultAccentColor
      : defaultTextColor;

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-medium">{label}</h3>
      <div className="flex gap-4">
        <div className="flex-1">
          <ColorField
            color={colorA}
            onChange={onChangeA}
            placeholder={defaultColor}
          />
        </div>

        {!showColorB ? (
          <div className="flex-1 flex items-center">
            <button
              onClick={() => setShowColorB(true)}
              className="flex items-center gap-2 text-sm"
              style={{
                color: textColorB,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = getHoverTextColor();
              }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 border border-current rounded-full"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = getHoverTextColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="relative top-[-1px]"
                  style={{
                    color: textColorB,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = textColorA;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = getHoverTextColor();
                  }}
                >
                  +
                </span>
              </span>
              sub colorを追加
            </button>
          </div>
        ) : (
          <div className="flex-1">
            <ColorField
              color={colorB || ""}
              onChange={(color) => onChangeB?.(color)}
              placeholder="#000000"
              onClear={() => {
                setShowColorB(false);
                onChangeB?.("");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorInput;
