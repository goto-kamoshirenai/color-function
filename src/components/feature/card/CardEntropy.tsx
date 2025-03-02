import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMyColorStore } from "@/store/myColorStore";
import { analyzeColorPalette, type ColorAnalysis } from "@/libs/colorUtils";
import React from "react";
import chroma from "chroma-js";
import ColorChip from "@/components/elements/ColorChip";

const ColorAnalysisDisplay: React.FC<{
  analysis: ColorAnalysis;
}> = ({ analysis }) => {
  const {
    textColorA,
    baseColorA,
    mainColorA,
    mainColorB,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorB,
  } = useMyColorStore();

  const colorEntries = [
    { color: mainColorA, label: "MainA" },
    ...(mainColorB ? [{ color: mainColorB, label: "MainB" }] : []),
    { color: baseColorA, label: "BaseA" },
    ...(baseColorB ? [{ color: baseColorB, label: "BaseB" }] : []),
    { color: accentColorA, label: "AccentA" },
    ...(accentColorB ? [{ color: accentColorB, label: "AccentB" }] : []),
    { color: textColorA, label: "TextA" },
    ...(textColorB ? [{ color: textColorB, label: "TextB" }] : []),
  ];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="rounded-md p-2"
        style={{ border: `1px solid ${textColorA}` }}
      >
        <div className="flex gap-1 mb-4">
          {colorEntries.map((entry, i) => (
            <div key={i} className="flex items-center">
              <ColorChip color={entry.color} label={entry.label} />
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex flex gap-1">
            <div className="font-medium">色相の多様性：</div>
            <div className="font-bold">
              {Math.round(analysis.hueVariety * 100)}%
            </div>
          </div>
          <div className="flex flex gap-1">
            <div className="font-medium">彩度の統一性：</div>
            <div className="font-bold">
              {Math.round(analysis.saturationUnity * 100)}%
            </div>
          </div>
          <div className="flex flex gap-1">
            <div className="font-medium">明度のバランス：</div>
            <div className="font-bold">
              {Math.round(analysis.lightnessBalance * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// グラフコンポーネントの共通スタイル
const ChartWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { textColorA } = useMyColorStore();

  return (
    <div
      className="rounded-md p-2"
      style={{ border: `1px solid ${textColorA}` }}
    >
      <h3 className="font-medium ">{title}</h3>
      {children}
    </div>
  );
};

// 色相分布の円グラフ
const HueDistributionChart: React.FC<{ colors: string[] }> = ({ colors }) => {
  const { textColorA } = useMyColorStore();
  const size = 200;
  const radius = size / 2;
  const center = { x: radius, y: radius };

  // 色相と彩度のデータを準備
  const colorPoints = colors.map((color) => {
    const [h, s, l] = chroma(color).hsl();
    const angle = ((h || 0) * Math.PI) / 180; // hueがnullの場合は0を使用
    const distance = (s * radius) / 1.2; // 彩度を半径の位置として使用（外側ほど彩度が高い）
    return {
      x: Number((center.x + Math.cos(angle) * distance).toFixed(4)),
      y: Number((center.y + Math.sin(angle) * distance).toFixed(4)),
      color,
      hue: h || 0,
      saturation: s,
      lightness: l,
    };
  });

  // 色相環の背景色を生成
  const hueWheelSegments = Array.from({ length: 360 }, (_, i) => {
    const hue = i;
    const angle = (hue * Math.PI) / 180;
    return {
      angle,
      color: `hsl(${hue}, 70%, 50%)`,
      x2: Number((center.x + Math.cos(angle) * radius).toFixed(4)),
      y2: Number((center.y + Math.sin(angle) * radius).toFixed(4)),
    };
  });

  return (
    <ChartWrapper title="色相分布">
      <div className="relative w-full h-full flex justify-center items-center">
        {/* 色相環の背景 */}
        <svg width={size} height={size} className="absolute top-0">
          {/* 色相環の背景セグメント */}
          {hueWheelSegments.map((segment, i) => (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={segment.x2}
              y2={segment.y2}
              stroke={segment.color}
              strokeWidth={1}
              opacity={0.1}
            />
          ))}
          {/* 彩度の同心円 */}
          {[0.25, 0.5, 0.75, 1].map((s) => (
            <circle
              key={s}
              cx={center.x}
              cy={center.y}
              r={radius * s}
              fill="none"
              stroke={textColorA}
              strokeWidth={1}
              opacity={0.2}
            />
          ))}
          {/* 主要な角度の目盛り */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x2 = Number((center.x + Math.cos(angle) * radius).toFixed(4));
            const y2 = Number((center.y + Math.sin(angle) * radius).toFixed(4));
            const textX = Number(
              (center.x + Math.cos(angle) * (radius - 20)).toFixed(4)
            );
            const textY = Number(
              (center.y + Math.sin(angle) * (radius - 20)).toFixed(4)
            );
            return (
              <g key={i}>
                <line
                  x1={center.x}
                  y1={center.y}
                  x2={x2}
                  y2={y2}
                  stroke={textColorA}
                  strokeWidth={1}
                  opacity={0.3}
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  fontSize={10}
                  fill={textColorA}
                >
                  {i * 30}°
                </text>
              </g>
            );
          })}
        </svg>
        {/* 色のプロット */}
        <svg width={size} height={size} className="relative">
          {colorPoints.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                fill={point.color}
                stroke={textColorA}
                strokeWidth={1}
              />
              <title>
                {`色相: ${Math.round(point.hue)}°
彩度: ${Math.round(point.saturation * 100)}%
明度: ${Math.round(point.lightness * 100)}%`}
              </title>
            </g>
          ))}
        </svg>
      </div>
    </ChartWrapper>
  );
};

// 彩度と明度のバランスを表示するグラフ
const SaturationLightnessChart: React.FC<{ colors: string[] }> = ({
  colors,
}) => {
  const { textColorA } = useMyColorStore();
  const size = 200;
  const margin = 40;
  const chartSize = size - margin * 2;

  // 色の彩度と明度のデータを準備
  const colorPoints = colors.map((color) => {
    const [, s, l] = chroma(color).hsl();
    return {
      color,
      saturation: s * 100,
      lightness: l * 100,
    };
  });

  return (
    <ChartWrapper title="彩度・明度分布">
      <div className="relative w-full h-full flex justify-center items-start">
        <svg width={size} height={size}>
          {/* グリッド線 */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = Number(
              (margin + (chartSize * (100 - value)) / 100).toFixed(4)
            );
            const x = Number((margin + (chartSize * value) / 100).toFixed(4));
            return (
              <g key={value}>
                {/* 横線 */}
                <line
                  x1={margin}
                  y1={y}
                  x2={size - margin}
                  y2={y}
                  stroke={textColorA}
                  strokeWidth={1}
                  opacity={0.1}
                />
                {/* 縦線 */}
                <line
                  x1={x}
                  y1={margin}
                  x2={x}
                  y2={size - margin}
                  stroke={textColorA}
                  strokeWidth={1}
                  opacity={0.1}
                />
                {/* Y軸のラベル */}
                <text
                  x={margin}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fontSize={10}
                  fill={textColorA}
                >
                  {value}%
                </text>
                {/* X軸のラベル */}
                <text
                  x={x}
                  y={size - margin + 15}
                  textAnchor="middle"
                  fontSize={10}
                  fill={textColorA}
                >
                  {value}%
                </text>
              </g>
            );
          })}
          {/* 軸ラベル */}
          <text
            x={size / 2}
            y={size - 5}
            textAnchor="middle"
            fontSize={12}
            fill={textColorA}
          >
            彩度
          </text>
          <text
            x={25}
            y={size / 2}
            textAnchor="middle"
            fontSize={12}
            fill={textColorA}
            transform={`rotate(-90, 15, ${size / 2})`}
          >
            明度
          </text>
          {/* 色のプロット */}
          {colorPoints.map((point, i) => (
            <g key={i}>
              <circle
                cx={margin + (chartSize * point.saturation) / 100}
                cy={margin + (chartSize * (100 - point.lightness)) / 100}
                r={6}
                fill={point.color}
                stroke={textColorA}
                strokeWidth={1}
              />
              <title>{`彩度: ${Math.round(
                point.saturation
              )}%, 明度: ${Math.round(point.lightness)}%`}</title>
            </g>
          ))}
        </svg>
      </div>
    </ChartWrapper>
  );
};

const CardEntropy = () => {
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
    getHoverBaseColor,
  } = useMyColorStore();

  const allColors = [
    mainColorA,
    baseColorA,
    accentColorA,
    textColorA,
    mainColorB,
    baseColorB,
    accentColorB,
    textColorB,
  ] as const;

  const colors = allColors.filter(
    (color): color is string => typeof color === "string" && color !== ""
  );
  const analysis = analyzeColorPalette(colors);

  return (
    <PanelWrapper title={t.sidebar.entropy || "配色の情報量分析"}>
      <div
        className="flex flex-col gap-2"
        style={{ backgroundColor: getHoverBaseColor() }}
      >
        <ColorAnalysisDisplay analysis={analysis} />
        <div className="grid grid-cols-2 gap-2">
          <HueDistributionChart colors={colors} />
          <SaturationLightnessChart colors={colors} />
        </div>
      </div>
    </PanelWrapper>
  );
};

export default CardEntropy;
