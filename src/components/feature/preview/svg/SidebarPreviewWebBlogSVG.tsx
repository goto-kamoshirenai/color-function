import React from "react";

interface SidebarPreviewWebBlogSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewWebBlogSVG: React.FC<SidebarPreviewWebBlogSVGProps> = ({
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
      <g clipPath="url(#clip0_105_943)">
        <rect width="500" height="300" fill="white" />
        <rect x="73" y="26" width="427" height="274" fill={baseColorA} />
        <rect width="500" height="26" fill={mainColorA} />
        <rect x="92" y="36" width="389" height="20" fill={mainColorA} />
        <rect x="92.5" y="56.5" width="388" height="233" stroke={mainColorA} />
        <rect
          x="98.5"
          y="116.5"
          width="300"
          height="78"
          fill={baseB}
          stroke={mainB}
        />
        <rect y="26" width="73" height="274" fill={baseB} />
        <circle cx="485" cy="13" r="7" fill={accentB} />
        <circle cx="467" cy="13" r="7" fill={accentColorA} />
        <circle cx="15" cy="13" r="7" fill={mainB} />
        <rect x="8" y="36" width="59" height="20" fill={accentColorA} />
        <rect x="5" y="285" width="62" height="11" fill={accentB} />
        <rect x="27" y="6" width="80" height="14" fill={mainB} />
      </g>
      <defs>
        <clipPath id="clip0_105_943">
          <rect width="500" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SidebarPreviewWebBlogSVG;
