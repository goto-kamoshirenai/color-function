import React from "react";

interface SidebarPreviewWebSimpleSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}

const SidebarPreviewWebSimpleSVG: React.FC<SidebarPreviewWebSimpleSVGProps> = ({
  mainColorA,
  mainColorB,
  baseColorA,
  // baseColorB,
  accentColorA,
  accentColorB,
}) => {
  // Bの色がない場合はAの色を使用
  const mainB = mainColorB || mainColorA;
  // baseB は現在使用していないが、将来的に使用する可能性があるため変数定義をコメントアウト
  // const baseB = baseColorB || baseColorA;
  const accentB = accentColorB || accentColorA;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_105_1233)">
        <rect width="500" height="300" fill="white" />
        <rect width="500" height="300" fill={baseColorA} />
        <rect
          width="480"
          height="1"
          transform="matrix(1 0 0 -1 12 28)"
          fill={mainColorA}
        />
        <circle cx="485" cy="16" r="7" fill={accentColorA} />
        <circle cx="20" cy="286" r="7" fill={accentB} />
        <circle cx="37" cy="286" r="7" fill={accentB} />
        <circle cx="20" cy="14" r="7" fill={mainB} />
        <circle cx="16.5" cy="46.5" r="10.5" fill={mainB} />
        <circle cx="148" cy="100" r="50" fill={mainB} />
        <circle cx="262" cy="100" r="50" fill={mainColorA} />
        <circle cx="376" cy="100" r="50" fill={mainColorA} />
        <rect x="32" y="7" width="80" height="14" fill={mainB} />
        <rect x="12" y="40" width="9" height="13" fill="white" />
        <rect x="12" y="64" width="9" height="13" fill="black" />
        <rect x="12" y="88" width="9" height="13" fill="black" />
        <rect x="12" y="112" width="9" height="13" fill="black" />
        <rect x="12" y="136" width="9" height="13" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_105_1233">
          <rect width="500" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SidebarPreviewWebSimpleSVG;
