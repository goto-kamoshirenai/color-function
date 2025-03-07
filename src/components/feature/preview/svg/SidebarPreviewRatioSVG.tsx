import React from "react";

interface SidebarPreviewRatioSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewRatioSVG: React.FC<SidebarPreviewRatioSVGProps> = ({
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
      <rect x="149" width="350" height="151" fill={baseColorA} />
      <rect x="149" y="151" width="350" height="149" fill={baseB} />
      <rect x="24" width="125" height="151" fill={mainColorA} />
      <rect x="24" y="151" width="125" height="149" fill={mainB} />
      <rect width="24" height="151" fill={accentColorA} />
      <rect y="151" width="24" height="149" fill={accentB} />
    </svg>
  );
};

export default SidebarPreviewRatioSVG;
