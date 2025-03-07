import React from "react";

interface PreviewDashboardSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewDashboardSVG: React.FC<PreviewDashboardSVGProps> = ({
  mainColorA,
  mainColorB,
  baseColorA,
  baseColorB,
  accentColorA,
  accentColorB,
  textColorA,
  // textColorB,
}) => {
  // Bの色がない場合はAの色を使用
  const mainB = mainColorB || mainColorA;
  const baseB = baseColorB || baseColorA;
  const accentB = accentColorB || accentColorA;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="300" fill={baseColorA} />
      {/* サイドナビゲーション */}
      <rect width="70" height="300" fill={mainColorA} />
      {/* ヘッダー */}
      <rect x="70" width="430" height="50" fill={mainB} />
      {/* メインコンテンツエリア */}
      <rect x="85" y="65" width="190" height="100" rx="4" fill={baseB} />
      <rect x="85" y="175" width="190" height="110" rx="4" fill={baseB} />
      <rect x="290" y="65" width="190" height="220" rx="4" fill={baseB} />

      {/* グラフ要素 */}
      <rect x="100" y="90" width="160" height="60" rx="2" fill={accentColorA} />
      <rect x="100" y="200" width="70" height="70" rx="2" fill={accentB} />
      <rect x="180" y="200" width="70" height="70" rx="2" fill={accentColorA} />

      {/* チャート */}
      <rect x="305" y="90" width="160" height="80" rx="2" fill="white" />
      <path
        d="M305 130 L465 130"
        stroke={textColorA}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path
        d="M305 150 L465 150"
        stroke={textColorA}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path
        d="M305 110 L465 110"
        stroke={textColorA}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path d="M315 170 L315 90" stroke={textColorA} strokeWidth="1" />
      <path d="M355 170 L355 90" stroke={textColorA} strokeWidth="1" />
      <path d="M395 170 L395 90" stroke={textColorA} strokeWidth="1" />
      <path d="M435 170 L435 90" stroke={textColorA} strokeWidth="1" />

      {/* バーチャート */}
      <rect x="315" y="150" width="20" height="20" fill={mainColorA} />
      <rect x="355" y="130" width="20" height="40" fill={mainColorA} />
      <rect x="395" y="110" width="20" height="60" fill={mainColorA} />
      <rect x="435" y="90" width="20" height="80" fill={mainColorA} />

      {/* テキスト表現 */}
      <rect x="15" y="15" width="40" height="6" rx="1" fill="white" />
      <rect x="15" y="30" width="40" height="6" rx="1" fill="white" />
      <rect x="15" y="45" width="40" height="6" rx="1" fill="white" />
      <rect x="15" y="60" width="40" height="6" rx="1" fill="white" />
      <rect x="15" y="75" width="40" height="6" rx="1" fill="white" />

      <rect x="100" y="75" width="80" height="6" rx="1" fill={textColorA} />
      <rect x="305" y="75" width="80" height="6" rx="1" fill={textColorA} />
      <rect x="100" y="185" width="80" height="6" rx="1" fill={textColorA} />

      <rect x="305" y="185" width="160" height="6" rx="1" fill={textColorA} />
      <rect x="305" y="200" width="160" height="6" rx="1" fill={textColorA} />
      <rect x="305" y="215" width="160" height="6" rx="1" fill={textColorA} />
      <rect x="305" y="230" width="120" height="6" rx="1" fill={textColorA} />
      <rect x="305" y="245" width="140" height="6" rx="1" fill={textColorA} />

      {/* アイコン */}
      <circle cx="35" cy="120" r="15" fill={accentColorA} />
      <circle cx="35" cy="160" r="15" fill={accentB} />
      <circle cx="35" cy="200" r="15" fill="white" />
      <circle cx="35" cy="240" r="15" fill={accentColorA} />

      {/* ユーザーアイコン */}
      <circle cx="450" cy="25" r="15" fill="white" />
    </svg>
  );
};

export default PreviewDashboardSVG;
