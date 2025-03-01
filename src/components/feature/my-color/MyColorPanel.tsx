"use client";

import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ColorInput from "./ColorInput";
import { MdCached } from "react-icons/md";
import { useTranslation } from "@/contexts/TranslationContext";
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

  return (
    <AnimatePresence>
      {isMyColorPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMyColorPanel}
            className="fixed inset-0 bg-black/50  !pointer-events-auto"
            style={{ pointerEvents: "auto", zIndex: 51 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 m-auto w-[80vw] h-[80vh] bg-white rounded-xl shadow-elevation-3 p-6 z-[1000] overflow-y-auto"
            style={{
              backgroundColor: baseColorA,
            }}
          >
            <div className="space-y-2" style={{ color: textColorA }}>
              <div className="flex justify-between items-center">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: mainColorA }}
                >
                  {t.sidebar.myColor}
                </h2>
                <button onClick={resetMyColorStore}>
                  <MdCached
                    className="w-6 h-6"
                    style={{ color: mainColorA }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = getHoverMainColor();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = mainColorA;
                    }}
                  />
                </button>
              </div>
              <div className="space-y-1">
                <ColorInput
                  label="Main"
                  colorA={mainColorA}
                  colorB={mainColorB}
                  type="main"
                  onChangeA={setMainColorA}
                  onChangeB={setMainColorB}
                />
                <ColorInput
                  label="Base"
                  colorA={baseColorA}
                  colorB={baseColorB}
                  type="base"
                  onChangeA={setBaseColorA}
                  onChangeB={setBaseColorB}
                />
                <ColorInput
                  label="Accent"
                  colorA={accentColorA}
                  colorB={accentColorB}
                  type="accent"
                  onChangeA={setAccentColorA}
                  onChangeB={setAccentColorB}
                />
                <ColorInput
                  label="Text"
                  colorA={textColorA}
                  colorB={textColorB}
                  type="text"
                  onChangeA={setTextColorA}
                  onChangeB={setTextColorB}
                />
                <div className="flex justify-center ">
                  <button
                    className="mt-8 px-6 py-2 rounded-lg font-bold"
                    style={{
                      backgroundColor: mainColorA,
                      color: baseColorA,
                    }}
                    onClick={toggleMyColorPanel}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentColorA;
                      e.currentTarget.style.color = textColorA;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = mainColorA;
                      e.currentTarget.style.color = baseColorA;
                    }}
                  >
                    Go
                  </button>
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
