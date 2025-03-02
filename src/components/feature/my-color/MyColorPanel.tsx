"use client";

import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import ColorInput from "./ColorInput";
import { MdCached } from "react-icons/md";
import { useTranslation } from "@/contexts/TranslationContext";
import CommonButton from "@/components/elements/CommonButton";

const MyColorPanel = () => {
  const { t } = useTranslation();
  const { isMyColorPanelOpen, toggleMyColorPanel } = usePanelStore();
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
    resetMyColorStore,
    getHoverMainColor,
  } = useMyColorStore();

  // 一時的な色の状態を管理
  const [tempColors, setTempColors] = useState({
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  });

  // パネルが開かれた時に現在のストアの値で一時的な状態を初期化
  useEffect(() => {
    if (isMyColorPanelOpen) {
      setTempColors({
        mainColorA,
        mainColorB,
        baseColorA,
        baseColorB,
        accentColorA,
        accentColorB,
        textColorA,
        textColorB,
      });
    }
  }, [isMyColorPanelOpen]);

  // 一時的な色を更新する関数
  const updateTempColor = (key: string, value: string) => {
    setTempColors((prev) => ({ ...prev, [key]: value }));
  };

  // ストアの値を更新する関数
  const applyColors = () => {
    setMainColorA(tempColors.mainColorA);
    if (tempColors.mainColorB) setMainColorB(tempColors.mainColorB);
    setBaseColorA(tempColors.baseColorA);
    if (tempColors.baseColorB) setBaseColorB(tempColors.baseColorB);
    setAccentColorA(tempColors.accentColorA);
    if (tempColors.accentColorB) setAccentColorB(tempColors.accentColorB);
    setTextColorA(tempColors.textColorA);
    if (tempColors.textColorB) setTextColorB(tempColors.textColorB);
    toggleMyColorPanel();
  };

  // リセット処理
  const handleReset = () => {
    resetMyColorStore();
    setTempColors({
      mainColorA: mainColorA,
      mainColorB: "",
      baseColorA: baseColorA,
      baseColorB: "",
      accentColorA: accentColorA,
      accentColorB: "",
      textColorA: textColorA,
      textColorB: "",
    });
  };

  // パネルを閉じる処理
  const handleClose = () => {
    applyColors();
  };

  return (
    <AnimatePresence>
      {isMyColorPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 !pointer-events-auto"
            style={{ pointerEvents: "auto", zIndex: 51 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 m-auto w-[80vw] h-[80vh] bg-white rounded-xl shadow-elevation-3 p-6 z-[1000] overflow-y-auto"
            style={{
              backgroundColor: tempColors.baseColorA,
            }}
          >
            <div className="space-y-2" style={{ color: tempColors.textColorA }}>
              <div className="flex justify-between items-center">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: tempColors.mainColorA }}
                >
                  {t.sidebar.myColor}
                </h2>
                <button onClick={handleReset}>
                  <MdCached
                    className="w-6 h-6"
                    style={{ color: tempColors.mainColorA }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = getHoverMainColor();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = tempColors.mainColorA;
                    }}
                  />
                </button>
              </div>
              <div className="space-y-1">
                <ColorInput
                  label="Main"
                  colorA={tempColors.mainColorA}
                  colorB={tempColors.mainColorB}
                  type="main"
                  onChangeA={(color) => updateTempColor("mainColorA", color)}
                  onChangeB={(color) => updateTempColor("mainColorB", color)}
                />
                <ColorInput
                  label="Base"
                  colorA={tempColors.baseColorA}
                  colorB={tempColors.baseColorB}
                  type="base"
                  onChangeA={(color) => updateTempColor("baseColorA", color)}
                  onChangeB={(color) => updateTempColor("baseColorB", color)}
                />
                <ColorInput
                  label="Accent"
                  colorA={tempColors.accentColorA}
                  colorB={tempColors.accentColorB}
                  type="accent"
                  onChangeA={(color) => updateTempColor("accentColorA", color)}
                  onChangeB={(color) => updateTempColor("accentColorB", color)}
                />
                <ColorInput
                  label="Text"
                  colorA={tempColors.textColorA}
                  colorB={tempColors.textColorB}
                  type="text"
                  onChangeA={(color) => updateTempColor("textColorA", color)}
                  onChangeB={(color) => updateTempColor("textColorB", color)}
                />
                <div className="flex justify-center">
                  <CommonButton onClick={applyColors} className="mt-8">
                    Go
                  </CommonButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyColorPanel;
