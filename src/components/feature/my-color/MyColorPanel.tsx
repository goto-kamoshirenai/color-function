"use client";

import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ColorInput from "./ColorInput";

const MyColorPanel = () => {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 m-auto w-[80vw] h-[80vh] bg-white rounded-xl shadow-elevation-3 p-6 z-50"
          >
            <div className="space-y-2" style={{ color: textColorA }}>
              <h2 className="text-2xl font-bold">My Color</h2>
              <div className="space-y-1">
                <ColorInput
                  label="Main"
                  colorA={mainColorA}
                  colorB={mainColorB}
                  onChangeA={setMainColorA}
                  onChangeB={setMainColorB}
                />
                <ColorInput
                  label="Base"
                  colorA={baseColorA}
                  colorB={baseColorB}
                  onChangeA={setBaseColorA}
                  onChangeB={setBaseColorB}
                />
                <ColorInput
                  label="Accent"
                  colorA={accentColorA}
                  colorB={accentColorB}
                  onChangeA={setAccentColorA}
                  onChangeB={setAccentColorB}
                />
                <ColorInput
                  label="Text"
                  colorA={textColorA}
                  colorB={textColorB}
                  onChangeA={setTextColorA}
                  onChangeB={setTextColorB}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MyColorPanel;
