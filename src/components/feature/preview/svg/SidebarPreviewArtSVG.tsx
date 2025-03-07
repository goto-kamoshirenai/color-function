import React from "react";

interface SidebarPreviewArtSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewArtSVG: React.FC<SidebarPreviewArtSVGProps> = ({
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
      <g clipPath="url(#clip0_105_1186)">
        <rect width="500" height="300" fill="white" />
        <rect x="-2" width="250" height="300" fill={baseColorA} />
        <rect x="248" width="252" height="300" fill={baseB} />
        <rect x="34" y="25" width="243" height="87" fill={mainColorA} />
        <rect x="315" y="131" width="126" height="149" fill={mainB} />
        <circle cx="435.5" cy="56.5" r="39.5" fill={accentColorA} />
        <circle cx="114.5" cy="205.5" r="62.5" fill={accentB} />
      </g>
      <defs>
        <clipPath id="clip0_105_1186">
          <rect width="500" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SidebarPreviewArtSVG;
