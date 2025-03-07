import React from "react";

interface SidebarPreviewMobileSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewMobileSVG: React.FC<SidebarPreviewMobileSVGProps> = ({
  mainColorA,
  mainColorB,
  baseColorA,
  baseColorB,
  accentColorA,
  accentColorB,
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

      {/* スマートフォンフレーム */}
      <rect x="150" y="10" width="200" height="280" rx="20" fill="black" />
      <rect x="160" y="20" width="180" height="260" rx="10" fill={baseB} />

      {/* ステータスバー */}
      <rect x="160" y="20" width="180" height="25" rx="5" fill={mainColorA} />

      {/* ナビゲーションバー */}
      <rect x="160" y="255" width="180" height="25" rx="5" fill={mainColorA} />

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

      {/* 別のスマートフォン（小さめ） */}
      <rect x="50" y="60" width="80" height="180" rx="15" fill="black" />
      <rect x="55" y="70" width="70" height="160" rx="8" fill={baseB} />

      {/* 別のスマートフォン（タブレット風） */}
      <rect x="370" y="60" width="100" height="180" rx="10" fill="black" />
      <rect x="375" y="65" width="90" height="170" rx="5" fill={baseB} />
    </svg>
  );
};

export default SidebarPreviewMobileSVG;
