import React from "react";

interface PreviewMobileSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewMobileSVG: React.FC<PreviewMobileSVGProps> = ({
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
  // textBは現在使用していないが、将来的に使用する可能性があるため変数定義をコメントアウト
  // const textB = textColorB || textColorA;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="500" height="300" fill={baseColorA} />

      {/* スマートフォンフレーム */}
      <rect x="150" y="10" width="200" height="280" rx="20" fill="black" />
      <rect x="160" y="20" width="180" height="260" rx="10" fill={baseB} />

      {/* ステータスバー */}
      <rect x="160" y="20" width="180" height="25" rx="5" fill={mainColorA} />
      <circle cx="175" cy="32.5" r="5" fill="white" />
      <rect x="185" y="30" width="20" height="5" rx="2.5" fill="white" />
      <circle cx="325" cy="32.5" r="5" fill="white" />

      {/* ナビゲーションバー */}
      <rect x="160" y="255" width="180" height="25" rx="5" fill={mainColorA} />
      <circle cx="190" cy="267.5" r="7.5" fill="white" />
      <circle cx="250" cy="267.5" r="7.5" fill="white" />
      <circle cx="310" cy="267.5" r="7.5" fill="white" />

      {/* コンテンツエリア */}
      <rect x="170" y="55" width="160" height="80" rx="5" fill={mainB} />
      <rect
        x="170"
        y="145"
        width="75"
        height="100"
        rx="5"
        fill={accentColorA}
      />
      <rect x="255" y="145" width="75" height="45" rx="5" fill={accentB} />
      <rect x="255" y="200" width="75" height="45" rx="5" fill={accentColorA} />

      {/* テキスト表現 */}
      <rect x="180" y="65" width="100" height="6" rx="3" fill={textColorA} />
      <rect x="180" y="80" width="140" height="4" rx="2" fill={textColorA} />
      <rect x="180" y="90" width="140" height="4" rx="2" fill={textColorA} />
      <rect x="180" y="100" width="140" height="4" rx="2" fill={textColorA} />
      <rect x="180" y="110" width="100" height="4" rx="2" fill={textColorA} />

      <rect x="180" y="155" width="55" height="5" rx="2.5" fill="white" />
      <rect x="180" y="165" width="55" height="3" rx="1.5" fill="white" />
      <rect x="180" y="175" width="55" height="3" rx="1.5" fill="white" />

      <rect x="265" y="155" width="55" height="5" rx="2.5" fill="white" />
      <rect x="265" y="165" width="55" height="3" rx="1.5" fill="white" />

      <rect x="265" y="210" width="55" height="5" rx="2.5" fill="white" />
      <rect x="265" y="220" width="55" height="3" rx="1.5" fill="white" />

      {/* 別のスマートフォン（小さめ） */}
      <rect x="50" y="60" width="80" height="180" rx="15" fill="black" />
      <rect x="55" y="70" width="70" height="160" rx="8" fill={baseB} />

      {/* ステータスバー（小） */}
      <rect x="55" y="70" width="70" height="15" rx="3" fill={mainColorA} />

      {/* コンテンツエリア（小） */}
      <rect x="60" y="90" width="60" height="40" rx="3" fill={mainB} />
      <rect x="60" y="140" width="25" height="80" rx="3" fill={accentColorA} />
      <rect x="95" y="140" width="25" height="35" rx="3" fill={accentB} />
      <rect x="95" y="185" width="25" height="35" rx="3" fill={accentColorA} />

      {/* 別のスマートフォン（タブレット風） */}
      <rect x="370" y="60" width="100" height="180" rx="10" fill="black" />
      <rect x="375" y="65" width="90" height="170" rx="5" fill={baseB} />

      {/* ステータスバー（タブレット） */}
      <rect x="375" y="65" width="90" height="15" rx="3" fill={mainColorA} />

      {/* コンテンツエリア（タブレット） */}
      <rect x="380" y="85" width="80" height="30" rx="3" fill={mainB} />
      <rect
        x="380"
        y="120"
        width="35"
        height="105"
        rx="3"
        fill={accentColorA}
      />
      <rect x="425" y="120" width="35" height="50" rx="3" fill={accentB} />
      <rect x="425" y="175" width="35" height="50" rx="3" fill={accentColorA} />
    </svg>
  );
};

export default PreviewMobileSVG;
