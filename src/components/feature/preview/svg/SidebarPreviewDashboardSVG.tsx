import React from "react";

interface SidebarPreviewDashboardSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewDashboardSVG: React.FC<SidebarPreviewDashboardSVGProps> = ({
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

      {/* アイコン */}
      <circle cx="35" cy="120" r="15" fill={accentColorA} />
      <circle cx="35" cy="160" r="15" fill={accentB} />
      <circle cx="35" cy="200" r="15" fill="white" />
      <circle cx="35" cy="240" r="15" fill={accentColorA} />
    </svg>
  );
};

export default SidebarPreviewDashboardSVG;
