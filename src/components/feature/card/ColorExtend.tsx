import React, { useState, useEffect } from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import { useMyColorStore } from "@/store/myColorStore";
import ColorChip from "@/components/elements/ColorChip";
import { MdExpandMore } from "react-icons/md";
import tinycolor from "tinycolor2";
import { useTranslation } from "@/contexts/TranslationContext";
import ColorVariationRow from "./ColorVariationRow";
import ColorMenu from "./ColorMenu";
import CommonButton from "@/components/elements/CommonButton";

const ColorExtend = () => {
  const { t } = useTranslation();
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

  const [selectedColor, setSelectedColor] = useState({
    label: "MainA",
    color: mainColorA,
  });
  const [extendedColors, setExtendedColors] = useState<
    Array<{ color: string; offset: number }>
  >([]);
  const [saturationColors, setSaturationColors] = useState<
    Array<{ color: string; offset: number }>
  >([]);
  const [activeValueMenu, setActiveValueMenu] = useState<number | null>(null);
  const [activeSaturationMenu, setActiveSaturationMenu] = useState<
    number | null
  >(null);
  const [menuOpenColor, setMenuOpenColor] = useState<string | null>(null);
  const [hueColors, setHueColors] = useState<
    Array<{ color: string; offset: number; isComplementary?: boolean }>
  >([]);
  const [activeHueMenu, setActiveHueMenu] = useState<number | null>(null);

  const colorSetters = {
    MainA: setMainColorA,
    MainB: setMainColorB,
    BaseA: setBaseColorA,
    BaseB: setBaseColorB,
    AccentA: setAccentColorA,
    AccentB: setAccentColorB,
    TextA: setTextColorA,
    TextB: setTextColorB,
  };

  const handleColorUpdate = (
    color: string,
    target: keyof typeof colorSetters
  ) => {
    const setter = colorSetters[target];
    if (setter) {
      setter(color);
      setActiveValueMenu(null);
      setActiveSaturationMenu(null);
      setMenuOpenColor(null);
    }
  };

  const generateExtendedColors = (baseColor: string) => {
    const color = tinycolor(baseColor);
    const hsv = color.toHsv();
    const baseValue = hsv.v;
    const colors: Array<{ color: string; offset: number }> = [];
    const step = 0.1; // 10%ステップ

    // 基準色が0%の場合
    if (baseValue === 0) {
      colors.push({ color: baseColor, offset: 0 });
      let currentValue = step;
      while (currentValue <= 1) {
        colors.push({
          color: tinycolor({
            h: hsv.h,
            s: hsv.s,
            v: currentValue,
          }).toHexString(),
          offset: Math.round(currentValue * 100),
        });
        currentValue += step;
      }
      setExtendedColors(colors);
      return;
    }

    // 基準色が100%の場合
    if (baseValue === 1) {
      let currentValue = 0;
      while (currentValue < 1) {
        colors.push({
          color: tinycolor({
            h: hsv.h,
            s: hsv.s,
            v: currentValue,
          }).toHexString(),
          offset: Math.round(currentValue * 100) - 100,
        });
        currentValue += step;
      }
      colors.push({ color: baseColor, offset: 0 });
      setExtendedColors(colors);
      return;
    }

    // 通常のケース（0%と100%の間）
    // 下方向の色を生成
    let currentValue = baseValue - step;
    while (currentValue > step) {
      const offset = Math.round((currentValue - baseValue) * 100);
      colors.unshift({
        color: tinycolor({ h: hsv.h, s: hsv.s, v: currentValue }).toHexString(),
        offset: offset,
      });
      currentValue -= step;
    }
    // 0%の色を追加
    colors.unshift({
      color: tinycolor({ h: hsv.h, s: hsv.s, v: 0 }).toHexString(),
      offset: -Math.round(baseValue * 100),
    });

    // 基準色を追加
    colors.push({
      color: baseColor,
      offset: 0,
    });

    // 上方向の色を生成
    currentValue = baseValue + step;
    while (currentValue < 1 - step) {
      const offset = Math.round((currentValue - baseValue) * 100);
      colors.push({
        color: tinycolor({ h: hsv.h, s: hsv.s, v: currentValue }).toHexString(),
        offset: offset,
      });
      currentValue += step;
    }
    // 100%の色を追加
    colors.push({
      color: tinycolor({ h: hsv.h, s: hsv.s, v: 1 }).toHexString(),
      offset: Math.round((1 - baseValue) * 100),
    });

    setExtendedColors(colors);
  };

  const generateSaturationVariations = (baseColor: string) => {
    const color = tinycolor(baseColor);
    const hsv = color.toHsv();
    const baseSaturation = hsv.s;

    // 彩度が0%または100%の場合は無彩色として扱い、バリエーションを生成しない
    if (baseSaturation === 0 || baseSaturation === 1) {
      setSaturationColors([]);
      return;
    }

    const colors: Array<{ color: string; offset: number }> = [];
    const step = 0.1; // 10%ステップ

    // 通常のケース（0%と100%の間）
    // 上方向の彩度を生成
    let currentSaturation = baseSaturation + step;
    while (currentSaturation < 1 - step) {
      const offset = Math.round((currentSaturation - baseSaturation) * 100);
      colors.unshift({
        color: tinycolor({
          h: hsv.h,
          s: currentSaturation,
          v: hsv.v,
        }).toHexString(),
        offset: offset,
      });
      currentSaturation += step;
    }
    // 100%の彩度を追加
    colors.unshift({
      color: tinycolor({ h: hsv.h, s: 1, v: hsv.v }).toHexString(),
      offset: Math.round((1 - baseSaturation) * 100),
    });

    // 基準彩度を追加
    colors.push({
      color: baseColor,
      offset: 0,
    });

    // 下方向の彩度を生成
    currentSaturation = baseSaturation - step;
    while (currentSaturation > step) {
      const offset = Math.round((currentSaturation - baseSaturation) * 100);
      colors.push({
        color: tinycolor({
          h: hsv.h,
          s: currentSaturation,
          v: Math.min(1, hsv.v + (1 - currentSaturation) * 0.5),
        }).toHexString(),
        offset: offset,
      });
      currentSaturation -= step;
    }
    // 0%の彩度を追加
    colors.push({
      color: tinycolor({
        h: hsv.h,
        s: 0,
        v: Math.min(1, hsv.v + 0.5),
      }).toHexString(),
      offset: -Math.round(baseSaturation * 100),
    });

    setSaturationColors(colors);
  };

  const generateHueVariations = (baseColor: string) => {
    const color = tinycolor(baseColor);
    const hsv = color.toHsv();

    // 無彩色（彩度が0%）の場合は色相のバリエーションを生成しない
    if (hsv.s === 0) {
      setHueColors([]);
      return;
    }

    // 12の基本色相を定義（0度から30度ずつ）
    const baseHues = Array.from({ length: 12 }, (_, i) => i * 30);

    // 基準色の色相を360度系に正規化
    const normalizedHue = ((hsv.h % 360) + 360) % 360;

    // 最も近い基本色相を見つける
    const closestBaseHue = baseHues.reduce((prev, curr) => {
      const prevDiff = Math.min(
        Math.abs(normalizedHue - prev),
        360 - Math.abs(normalizedHue - prev)
      );
      const currDiff = Math.min(
        Math.abs(normalizedHue - curr),
        360 - Math.abs(normalizedHue - curr)
      );
      return prevDiff < currDiff ? prev : curr;
    });

    // 基準色と最も近い基本色相との差分を計算
    const hueOffset = normalizedHue - closestBaseHue;

    // 12色相に差分を適用してバリエーションを生成
    const colors: Array<{
      color: string;
      offset: number;
      isComplementary?: boolean;
    }> = baseHues.map((baseHue) => {
      // 基本色相に差分を適用
      const adjustedHue = (((baseHue + hueOffset) % 360) + 360) % 360;
      // 基準色からの相対的な角度を計算（-180から+180の範囲）
      const relativeAngle = ((adjustedHue - normalizedHue + 540) % 360) - 180;

      return {
        color: tinycolor({ h: adjustedHue, s: hsv.s, v: hsv.v }).toHexString(),
        offset: relativeAngle,
        // 補色の判定（相対角度が約180度のもの）
        isComplementary: Math.abs(Math.abs(relativeAngle) - 180) < 15,
      };
    });

    // 相対角度でソート（左から右へ）
    colors.sort((a, b) => a.offset - b.offset);

    setHueColors(colors);
  };

  const generateAllVariations = (baseColor: string) => {
    generateExtendedColors(baseColor);
    generateSaturationVariations(baseColor);
    generateHueVariations(baseColor);
  };

  const handleColorSelect = (label: string, color: string) => {
    setSelectedColor({ label, color });
    setActiveValueMenu(null);
    setActiveSaturationMenu(null);
    setMenuOpenColor(null);
  };

  const colorOptions = [
    { color: mainColorA, label: "MainA" },
    ...(mainColorB ? [{ color: mainColorB, label: "MainB" }] : []),
    { color: baseColorA, label: "BaseA" },
    ...(baseColorB ? [{ color: baseColorB, label: "BaseB" }] : []),
    { color: accentColorA, label: "AccentA" },
    ...(accentColorB ? [{ color: accentColorB, label: "AccentB" }] : []),
    { color: textColorA, label: "TextA" },
    ...(textColorB ? [{ color: textColorB, label: "TextB" }] : []),
  ];

  const renderColorMenu = (color: string) => (
    <ColorMenu
      options={Object.keys(colorSetters)}
      onSelect={(option) =>
        handleColorUpdate(color, option as keyof typeof colorSetters)
      }
      onClose={() => {
        setActiveValueMenu(null);
        setActiveSaturationMenu(null);
        setActiveHueMenu(null);
        setMenuOpenColor(null);
      }}
    />
  );

  // 色の変更を監視するuseEffect
  useEffect(() => {
    if (selectedColor) {
      const newColor = colorOptions.find(
        (opt) => opt.label === selectedColor.label
      )?.color;
      if (newColor && newColor !== selectedColor.color) {
        setSelectedColor((prev) => ({ ...prev, color: newColor }));
        generateAllVariations(newColor);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  ]);

  return (
    <PanelWrapper title={t.sidebar.colorExtend} helpPanelKey="expend">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          {!(
            extendedColors.length > 0 ||
            saturationColors.length > 0 ||
            hueColors.length > 0
          ) && (
            <p className="text-sm opacity-50">
              基準となる色を選択してボタンを押すと色が展開されます
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <div
                key={option.label}
                onClick={() => handleColorSelect(option.label, option.color)}
                className={`relative cursor-pointer p-2 rounded-md`}
                style={{
                  transition: "all 0.3s ease",
                  border:
                    selectedColor.label === option.label
                      ? `2px solid ${mainColorA}`
                      : `1px solid ${textColorA}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border =
                    selectedColor.label === option.label
                      ? `2px solid ${mainColorA}`
                      : `1px solid ${mainColorA}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border =
                    selectedColor.label === option.label
                      ? `2px solid ${mainColorA}`
                      : `1px solid ${textColorA}`;
                }}
              >
                <ColorChip
                  color={option.color}
                  label={option.label}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <CommonButton
            onClick={() =>
              selectedColor && generateAllVariations(selectedColor.color)
            }
            className={`flex-col items-center justify-center ${
              !selectedColor.label ? "hidden" : ""
            }`}
          >
            <p>パレットを展開</p>
            <MdExpandMore size={20} />
          </CommonButton>
        </div>

        {(extendedColors.length > 0 ||
          saturationColors.length > 0 ||
          hueColors.length > 0) && (
          <div className="flex flex-col gap-2">
            {hueColors.length > 0 && (
              <ColorVariationRow
                title="色相バリエーション"
                colors={hueColors}
                activeIndex={activeHueMenu}
                mainColor={mainColorA}
                menuOpenColor={menuOpenColor}
                onColorSelect={(index) => {
                  setActiveHueMenu(activeHueMenu === index ? null : index);
                  setActiveValueMenu(null);
                  setActiveSaturationMenu(null);
                  setMenuOpenColor(hueColors[index].color);
                }}
                renderMenu={renderColorMenu}
              />
            )}

            {saturationColors.length > 0 && (
              <ColorVariationRow
                title="彩度バリエーション"
                colors={saturationColors}
                activeIndex={activeSaturationMenu}
                mainColor={mainColorA}
                menuOpenColor={menuOpenColor}
                onColorSelect={(index) => {
                  setActiveSaturationMenu(
                    activeSaturationMenu === index ? null : index
                  );
                  setActiveHueMenu(null);
                  setActiveValueMenu(null);
                  setMenuOpenColor(saturationColors[index].color);
                }}
                renderMenu={renderColorMenu}
              />
            )}

            {extendedColors.length > 0 && (
              <ColorVariationRow
                title="明度バリエーション"
                colors={extendedColors}
                activeIndex={activeValueMenu}
                mainColor={mainColorA}
                menuOpenColor={menuOpenColor}
                onColorSelect={(index) => {
                  setActiveValueMenu(activeValueMenu === index ? null : index);
                  setActiveHueMenu(null);
                  setActiveSaturationMenu(null);
                  setMenuOpenColor(extendedColors[index].color);
                }}
                renderMenu={renderColorMenu}
              />
            )}
          </div>
        )}
      </div>
    </PanelWrapper>
  );
};

export default ColorExtend;
