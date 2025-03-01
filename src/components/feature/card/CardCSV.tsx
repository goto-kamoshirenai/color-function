"use client";

import React, { useState, useCallback } from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMyColorStore } from "@/store/myColorStore";
import {
  exportColorSettings,
  parseColorSettings,
  generatePreviewContent,
  ExportFormat,
} from "@/libs/colorExport";

const formatOptions: { value: ExportFormat; label: string }[] = [
  { value: "csv", label: "CSV" },
  { value: "tailwind-js", label: "Tailwind Config (JavaScript)" },
  { value: "tailwind-ts", label: "Tailwind Config (TypeScript)" },
  { value: "css", label: "CSS Variables" },
  { value: "sass", label: "SASS Variables" },
  { value: "json", label: "JSON" },
];

const CardCSV = () => {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");
  const [isDragging, setIsDragging] = useState(false);
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
    setMainColorA,
    setMainColorB,
    setBaseColorA,
    setBaseColorB,
    setAccentColorA,
    setAccentColorB,
    setTextColorA,
    setTextColorB,
    getHoverAccentColor,
    getHoverTextColor,
  } = useMyColorStore();

  const colorSettings = {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  };

  const handleExportCSV = () => {
    exportColorSettings(colorSettings, selectedFormat);
  };

  const processFile = useCallback(
    (file: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const values = parseColorSettings(text);

        setMainColorA(values[0]);
        setMainColorB(values[1]);
        setBaseColorA(values[2]);
        setBaseColorB(values[3]);
        setAccentColorA(values[4]);
        setAccentColorB(values[5]);
        setTextColorA(values[6]);
        setTextColorB(values[7]);
      };
      reader.readAsText(file);
    },
    [
      setMainColorA,
      setMainColorB,
      setBaseColorA,
      setBaseColorB,
      setAccentColorA,
      setAccentColorB,
      setTextColorA,
      setTextColorB,
    ]
  );

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith(".csv")) {
        processFile(file);
      }
    },
    [processFile]
  );

  return (
    <PanelWrapper title={t.sidebar.csv}>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            {t.csv.import}
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
                style={{
                  backgroundColor: accentColorA,
                  color: textColorA,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = getHoverAccentColor();
                  e.currentTarget.style.color = getHoverTextColor();
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = accentColorA;
                  e.currentTarget.style.color = textColorA;
                }}
              >
                ファイルを選択
              </button>
            </div>
            <div
              className={`flex-1 h-[38px] flex items-center justify-center rounded-lg transition-all duration-200 p-2 ${
                isDragging ? "ring-2 ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: baseColorA,
                borderColor: accentColorA,
                borderWidth: "2px",
                borderStyle: "dashed",
                color: textColorA,
                opacity: isDragging ? 1 : 0.7,
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging ? "ドロップ" : "ドラッグ＆ドロップ"}
            </div>
          </div>
        </div>
        <label className="block mb-2 text-sm font-medium">{t.csv.export}</label>
        <div className="flex items-center gap-2">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
            className="px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: baseColorA,
              color: textColorA,
              border: `1px solid ${accentColorA}`,
            }}
          >
            {formatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 text-sm font-medium font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
            style={{
              backgroundColor: accentColorA,
              color: textColorA,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getHoverAccentColor();
              e.currentTarget.style.color = getHoverTextColor();
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = accentColorA;
              e.currentTarget.style.color = textColorA;
            }}
          >
            {t.csv.exportBtn}
          </button>
        </div>
        <div className="mt-4">
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: textColorA }}
          >
            プレビュー
          </h3>
          <div
            className="rounded-md overflow-hidden"
            style={{
              backgroundColor: "#1e1e1e",
              border: "1px solid #333333",
            }}
          >
            <div
              className="px-3 py-1 text-xs"
              style={{
                backgroundColor: "#252526",
                borderBottom: "1px solid #333333",
                color: "#cccccc",
              }}
            >
              {(() => {
                switch (selectedFormat) {
                  case "tailwind-js":
                    return "tailwind.config.js";
                  case "tailwind-ts":
                    return "tailwind.config.ts";
                  case "sass":
                    return "color-settings.scss";
                  default:
                    return `color-settings.${selectedFormat}`;
                }
              })()}
            </div>
            <pre
              className="p-4 text-xs font-mono whitespace-pre-wrap break-all leading-5"
              style={{
                fontFamily: "Consolas, 'Courier New', monospace",
                color: "#d4d4d4",
                backgroundColor: "#1e1e1e",
              }}
            >
              {generatePreviewContent(colorSettings, selectedFormat)}
            </pre>
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
};

export default CardCSV;
