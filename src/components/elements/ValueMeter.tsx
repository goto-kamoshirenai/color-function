import { useMyColorStore } from "@/store/myColorStore";

interface ValueMeterProps {
  value: number; // 0-100の値
  label: string; // "S" or "V"
  height?: number;
}

const ValueMeter = ({ value, label, height = 100 }: ValueMeterProps) => {
  const { accentColorA } = useMyColorStore();
  const width = 24;
  // 上下のマージンを考慮して位置を計算
  const markerPosition = height - (height * value) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ height, width }}>
        {/* メーターの背景 */}
        <div className="absolute inset-0 rounded-md bg-gray-100" />

        {/* 目盛り線（1%ごと） */}
        {Array.from({ length: 101 }).map((_, i) => (
          <div
            key={i}
            className={`absolute left-0 ${
              i % 10 === 0
                ? "w-3 h-[1px] bg-gray-400"
                : "w-1.5 h-[1px] bg-gray-200"
            }`}
            style={{
              top: `${i}%`,
              transform: "translateY(-50%)",
            }}
          />
        ))}

        {/* 現在値を示すマーカー */}
        <div
          className="absolute left-0 right-0 transition-all duration-200"
          style={{
            top: markerPosition,
            transform: "translateY(-50%)",
          }}
        >
          <div
            className="h-[2px] w-full shadow-sm"
            style={{ backgroundColor: accentColorA }}
          />
          {/* マーカーの値 */}
          {/* <div className="absolute right-[-30px] top-[-8px] text-xs font-mono min-w-[32px]">
            {value}%
          </div> */}
        </div>
      </div>
      <span className="mt-2 text-xs font-medium">{label}</span>
    </div>
  );
};

export default ValueMeter;
