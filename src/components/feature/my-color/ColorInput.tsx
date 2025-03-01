import { useMyColorStore } from "@/store/myColorStore";
import React, { useState, useEffect } from "react";

interface ColorInputProps {
  label: string;
  colorA: string;
  colorB?: string;
  onChangeA: (color: string) => void;
  onChangeB?: (color: string) => void;
}

const ColorInput = ({
  label,
  colorA,
  colorB,
  onChangeA,
  onChangeB,
}: ColorInputProps) => {
  const { textColorA, textColorB } = useMyColorStore();
  const [showColorB, setShowColorB] = useState(!!colorB);
  const [localColorA, setLocalColorA] = useState(colorA);
  const [localColorB, setLocalColorB] = useState(colorB || "");

  useEffect(() => {
    setLocalColorA(colorA);
  }, [colorA]);

  useEffect(() => {
    setLocalColorB(colorB || "");
  }, [colorB]);

  const handleColorAChange = (value: string) => {
    setLocalColorA(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/) || value === "") {
      onChangeA(value);
    }
  };

  const handleColorBChange = (value: string) => {
    setLocalColorB(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/) || value === "") {
      onChangeB?.(value);
    }
  };

  return (
    <div className="space-y-1">
      <h3 className="text-lg font-medium">{label}</h3>
      <div className="flex gap-4 ">
        <div className="flex-1 space-y-2">
          <label
            className="block text-sm  line-height-1"
            style={{ color: textColorB }}
          >
            main color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={
                localColorA.match(/^#[0-9A-Fa-f]{6}$/) ? localColorA : "#000000"
              }
              onChange={(e) => handleColorAChange(e.target.value)}
              className="w-10 h-10"
              style={{
                backgroundColor: "transparent",
                borderColor: "transparent",
              }}
            />
            <input
              type="text"
              value={localColorA}
              onChange={(e) => handleColorAChange(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="#000000"
            />
          </div>
        </div>

        {!showColorB ? (
          <div className="flex-1 flex items-end pb-2">
            <button
              onClick={() => setShowColorB(true)}
              className="flex items-center gap-2 text-sm "
              style={{
                color: textColorB,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = textColorB ?? textColorA;
              }}
            >
              <span
                className="inline-flex items-center justify-center w-6 h-6 border border-current rounded-full"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    textColorB ?? textColorA;
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
                    e.currentTarget.style.color = textColorB ?? textColorA;
                  }}
                >
                  +
                </span>
              </span>
              sub colorを追加
            </button>
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="text-sm "
                style={{
                  color: textColorB,
                }}
              >
                sub color
              </label>
              <button
                onClick={() => {
                  setShowColorB(false);
                  onChangeB?.("");
                }}
                className="text-sm "
                style={{
                  color: textColorB,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = textColorA;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = textColorB ?? textColorA;
                }}
              >
                設定しない
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={
                  localColorB.match(/^#[0-9A-Fa-f]{6}$/)
                    ? localColorB
                    : "#000000"
                }
                onChange={(e) => handleColorBChange(e.target.value)}
                className="w-10 h-10"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
              />
              <input
                type="text"
                value={localColorB}
                onChange={(e) => handleColorBChange(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorInput;
