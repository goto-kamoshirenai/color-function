"use client";

import React, { useState } from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import { useMyColorStore } from "@/store/myColorStore";
import { colorTemplate } from "@/const/colorConst";
import PreviewRatioSVG from "../preview/svg/PreviewRatioSVG";
import ColorChip from "@/components/elements/ColorChip";

import { MdContentCopy, MdCheck } from "react-icons/md";

// 色のタイプを定義
type ColorType = "main" | "base" | "accent" | "text";

// 色の情報を表示するコンポーネント
interface ColorSectionProps {
  type: ColorType;
  colorA: string;
  colorB?: string;
}

const CardTemplate: React.FC = () => {
  // 色の設定を取得・更新するためのストア関数
  const {
    setMainColorA,
    setMainColorB,
    setBaseColorA,
    setBaseColorB,
    setAccentColorA,
    setAccentColorB,
    setTextColorA,
    setTextColorB,
  } = useMyColorStore();

  // コピーされた色を追跡するためのステート
  const [copiedColors, setCopiedColors] = useState<Record<string, boolean>>({});

  // テンプレートを適用する関数
  const applyTemplate = (template: (typeof colorTemplate)[0]) => {
    // mainColorAは必須なので常に設定
    setMainColorA(template.mainA);

    // 他の色はundefinedの場合は空文字列を設定してクリア
    if (template.mainB === undefined) {
      setMainColorB("");
    } else {
      setMainColorB(template.mainB);
    }

    // baseColorAは必須なので常に設定
    setBaseColorA(template.baseA);

    if (template.baseB === undefined) {
      setBaseColorB("");
    } else {
      setBaseColorB(template.baseB);
    }

    // accentColorAは必須なので常に設定
    setAccentColorA(template.accentA);

    if (template.accentB === undefined) {
      setAccentColorB("");
    } else {
      setAccentColorB(template.accentB);
    }

    // textColorAは必須なので常に設定
    setTextColorA(template.textA);

    if (template.textB === undefined) {
      setTextColorB("");
    } else {
      setTextColorB(template.textB);
    }
  };

  const handleCopy = (color: string) => {
    if (color) {
      navigator.clipboard.writeText(color);
      setCopiedColors((prev) => ({ ...prev, [color]: true }));
      setTimeout(() => {
        setCopiedColors((prev) => ({ ...prev, [color]: false }));
      }, 1000);
    }
  };

  // コピーボタンコンポーネント
  const CopyButton: React.FC<{ color: string }> = ({ color }) => {
    const isCopied = copiedColors[color];

    return (
      <button
        onClick={() => handleCopy(color)}
        className="hover:opacity-70 transition-opacity"
      >
        <div className="relative w-4 h-4">
          <MdContentCopy
            size={14}
            className="absolute transition-all duration-200"
            style={{
              opacity: isCopied ? 0 : 1,
              transform: isCopied ? "scale(0.5)" : "scale(1)",
            }}
          />
          <MdCheck
            size={14}
            className="absolute transition-all duration-200"
            style={{
              opacity: isCopied ? 1 : 0,
              transform: isCopied ? "scale(1)" : "scale(1.5)",
            }}
          />
        </div>
      </button>
    );
  };

  // 色の情報を表示するコンポーネント
  const ColorSection: React.FC<ColorSectionProps> = ({
    type,
    colorA,
    colorB,
  }) => {
    // 色のタイプに応じたラベルを設定
    const getLabel = () => {
      switch (type) {
        case "main":
          return "メイン";
        case "base":
          return "ベース";
        case "accent":
          return "アクセント";
        case "text":
          return "テキスト";
      }
    };

    return (
      <div className="w-28">
        <h4 className="text-xs font-bold">{getLabel()}</h4>
        <div className="flex items-center gap-1">
          <div style={{ width: "5.25rem" }}>
            <ColorChip color={colorA} label={colorA} size="sm" />
          </div>
          <CopyButton color={colorA} />
        </div>
        {colorB && (
          <div className="flex items-center gap-1">
            <div style={{ width: "5.25rem" }}>
              <ColorChip color={colorB} label={colorB} size="sm" />
            </div>
            <CopyButton color={colorB} />
          </div>
        )}
      </div>
    );
  };

  return (
    <PanelWrapper title="配色テンプレート">
      <div className="flex flex-col gap-4 p-4 max-h-[calc(100vh-10rem)]">
        {colorTemplate.map((template) => (
          <div
            key={template.id}
            className="border rounded-md p-3 flex flex-col sm:flex-row transition-all duration-200 hover:shadow-md"
            style={{ borderColor: template.textA }}
          >
            {/* プレビュー */}
            <div className="sm:w-1/2 sm:mr-4 mb-3 sm:mb-0">
              <div
                className="aspect-[5/3] border overflow-hidden"
                style={{ borderColor: template.textA }}
              >
                <PreviewRatioSVG
                  mainColorA={template.mainA}
                  mainColorB={template.mainB}
                  baseColorA={template.baseA}
                  baseColorB={template.baseB}
                  accentColorA={template.accentA}
                  accentColorB={template.accentB}
                  textColorA={template.textA}
                  textColorB={template.textB}
                />
              </div>
            </div>

            {/* 詳細と適用ボタン */}
            <div className="flex-1 flex flex-col overflow-y-auto max-h-[200px] sm:max-h-none">
              {/* 詳細パネル */}
              <div className="p-1 rounded-md text-sm">
                <div className="flex flex-wrap gap-1">
                  <ColorSection
                    type="main"
                    colorA={template.mainA}
                    colorB={template.mainB}
                  />
                  <ColorSection
                    type="base"
                    colorA={template.baseA}
                    colorB={template.baseB}
                  />
                  <ColorSection
                    type="accent"
                    colorA={template.accentA}
                    colorB={template.accentB}
                  />
                  <ColorSection
                    type="text"
                    colorA={template.textA}
                    colorB={template.textB}
                  />
                </div>
              </div>

              <button
                className="mt-auto py-1 px-2 rounded-md text-white transition-all duration-200 hover:opacity-80 flex items-center justify-center"
                style={{
                  backgroundColor: template.mainA,
                  boxShadow: `0 2px 4px rgba(0, 0, 0, 0.1)`,
                }}
                onClick={() => applyTemplate(template)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                適用
              </button>
            </div>
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
};

export default CardTemplate;
