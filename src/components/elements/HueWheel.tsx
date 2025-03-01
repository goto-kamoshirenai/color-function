import React from "react";
import Wheel from "@uiw/react-color-wheel";

interface HueWheelProps {
  hue: number;
  size?: number;
  color: string;
}

const HueWheel = ({ hue, size = 60, color }: HueWheelProps) => {
  // 色相のみを変更し、彩度と明度は固定値を使用
  const hsva = { h: hue, s: 100, v: 100, a: 1 };
  const innerRadius = size * 0.35; // 内側の白い円のサイズ

  return (
    <div className="relative inline-flex flex-col items-center ml-2">
      <div style={{ width: size, height: size }} className="relative">
        <Wheel
          color={hsva}
          width={size}
          height={size}
          style={{ pointerEvents: "none" }}
        />
        {/* 中心を実際の色で塗りつぶす */}
        <svg
          className="absolute inset-0"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle cx={size / 2} cy={size / 2} r={innerRadius} fill={color} />
        </svg>
      </div>
      <span className="mt-1 text-xs font-mono">H:{Math.round(hue)}°</span>
    </div>
  );
};

export default HueWheel;
