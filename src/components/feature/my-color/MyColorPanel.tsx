"use client";

import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import React, { useState, useEffect } from "react";
import ColorInput from "./ColorInput";
import { MdCached } from "react-icons/md";
import { useTranslation } from "@/contexts/TranslationContext";
import CommonButton from "@/components/elements/CommonButton";
import ModalWrapper from "@/components/elements/ModalWrapper";

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

  // showColorBの状態を管理
  const [showColorB, setShowColorB] = useState({
    main: !!mainColorB,
    base: !!baseColorB,
    accent: !!accentColorB,
    text: !!textColorB,
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
      setShowColorB({
        main: !!mainColorB,
        base: !!baseColorB,
        accent: !!accentColorB,
        text: !!textColorB,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyColorPanelOpen]);

  // 一時的な色を更新する関数
  const updateTempColor = (key: string, value: string) => {
    setTempColors((prev) => ({ ...prev, [key]: value }));
    // リアルタイムでストアも更新
    switch (key) {
      case "mainColorA":
        setMainColorA(value);
        break;
      case "mainColorB":
        setMainColorB(value);
        if (value === "") {
          setShowColorB((prev) => ({ ...prev, main: false }));
        }
        break;
      case "baseColorA":
        setBaseColorA(value);
        break;
      case "baseColorB":
        setBaseColorB(value);
        if (value === "") {
          setShowColorB((prev) => ({ ...prev, base: false }));
        }
        break;
      case "accentColorA":
        setAccentColorA(value);
        break;
      case "accentColorB":
        setAccentColorB(value);
        if (value === "") {
          setShowColorB((prev) => ({ ...prev, accent: false }));
        }
        break;
      case "textColorA":
        setTextColorA(value);
        break;
      case "textColorB":
        setTextColorB(value);
        if (value === "") {
          setShowColorB((prev) => ({ ...prev, text: false }));
        }
        break;
    }
  };

  // ストアの値を更新する関数
  const applyColors = () => {
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
    setShowColorB({
      main: false,
      base: false,
      accent: false,
      text: false,
    });
  };

  // パネルを閉じる処理
  const handleClose = () => {
    applyColors();
  };

  return (
    <ModalWrapper
      isOpen={isMyColorPanelOpen}
      onClose={handleClose}
      backgroundColor={tempColors.baseColorA}
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
            showColorB={showColorB.main}
            onShowColorBChange={(show) =>
              setShowColorB((prev) => ({ ...prev, main: show }))
            }
          />
          <ColorInput
            label="Base"
            colorA={tempColors.baseColorA}
            colorB={tempColors.baseColorB}
            type="base"
            onChangeA={(color) => updateTempColor("baseColorA", color)}
            onChangeB={(color) => updateTempColor("baseColorB", color)}
            showColorB={showColorB.base}
            onShowColorBChange={(show) =>
              setShowColorB((prev) => ({ ...prev, base: show }))
            }
          />
          <ColorInput
            label="Accent"
            colorA={tempColors.accentColorA}
            colorB={tempColors.accentColorB}
            type="accent"
            onChangeA={(color) => updateTempColor("accentColorA", color)}
            onChangeB={(color) => updateTempColor("accentColorB", color)}
            showColorB={showColorB.accent}
            onShowColorBChange={(show) =>
              setShowColorB((prev) => ({ ...prev, accent: show }))
            }
          />
          <ColorInput
            label="Text"
            colorA={tempColors.textColorA}
            colorB={tempColors.textColorB}
            type="text"
            onChangeA={(color) => updateTempColor("textColorA", color)}
            onChangeB={(color) => updateTempColor("textColorB", color)}
            showColorB={showColorB.text}
            onShowColorBChange={(show) =>
              setShowColorB((prev) => ({ ...prev, text: show }))
            }
          />
          <div className="flex justify-center">
            <CommonButton onClick={applyColors} className="mt-8">
              Go
            </CommonButton>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default MyColorPanel;
