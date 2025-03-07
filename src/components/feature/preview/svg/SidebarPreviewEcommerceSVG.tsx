import React from "react";

interface SidebarPreviewEcommerceSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewEcommerceSVG: React.FC<SidebarPreviewEcommerceSVGProps> = ({
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

      {/* ヘッダー */}
      <rect width="500" height="50" fill={mainColorA} />

      {/* メインビジュアル */}
      <rect x="20" y="60" width="460" height="80" rx="5" fill={mainB} />

      {/* 商品グリッド */}
      <rect x="20" y="180" width="140" height="110" rx="5" fill={baseB} />
      <rect x="170" y="180" width="140" height="110" rx="5" fill={baseB} />
      <rect x="320" y="180" width="140" height="110" rx="5" fill={baseB} />

      {/* 商品ラベル */}
      <rect x="30" y="190" width="40" height="20" rx="3" fill={accentB} />
      <rect x="180" y="190" width="40" height="20" rx="3" fill={accentColorA} />

      {/* カートアイコン */}
      <circle cx="450" cy="25" r="15" fill={accentColorA} />
    </svg>
  );
};

export default SidebarPreviewEcommerceSVG;
