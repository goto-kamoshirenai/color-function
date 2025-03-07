import React from "react";

interface PreviewWebSimpleSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewWebSimpleSVG: React.FC<PreviewWebSimpleSVGProps> = ({
  mainColorA,
  mainColorB,
  baseColorA,
  // baseColorB,
  accentColorA,
  accentColorB,
  textColorA,
  // textColorB,
}) => {
  // Bの色がない場合はAの色を使用
  const mainB = mainColorB || mainColorA;
  // baseB は現在使用していないが、将来的に使用する可能性があるため残しておく
  // const baseB = baseColorB || baseColorA;
  const accentB = accentColorB || accentColorA;
  // textB は現在使用していないが、将来的に使用する可能性があるため残しておく
  // const textB = textColorB || textColorA;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_104_433)">
        <rect width="500" height="300" fill="white" />
        <rect width="500" height="300" fill={baseColorA} />
        <rect
          width="480"
          height="1"
          transform="matrix(1 0 0 -1 12 28)"
          fill={mainColorA}
        />
        <rect x="98" y="235" width="10" height="14" fill={textColorA} />
        <rect x="111" y="235" width="10" height="14" fill={textColorA} />
        <rect x="124" y="235" width="10" height="14" fill={textColorA} />
        <rect x="137" y="235" width="10" height="14" fill={textColorA} />
        <rect x="152" y="235" width="10" height="14" fill={textColorA} />
        <rect x="260" y="235" width="10" height="14" fill={textColorA} />
        <rect x="327" y="235" width="10" height="14" fill={textColorA} />
        <rect x="394" y="235" width="10" height="14" fill={textColorA} />
        <rect x="165" y="235" width="10" height="14" fill={textColorA} />
        <rect x="273" y="235" width="10" height="14" fill={textColorA} />
        <rect x="340" y="235" width="10" height="14" fill={textColorA} />
        <rect x="407" y="235" width="10" height="14" fill={textColorA} />
        <rect x="180" y="235" width="10" height="14" fill={textColorA} />
        <rect x="286" y="235" width="10" height="14" fill={textColorA} />
        <rect x="353" y="235" width="10" height="14" fill={textColorA} />
        <rect x="420" y="235" width="10" height="14" fill={textColorA} />
        <rect x="193" y="235" width="10" height="14" fill={textColorA} />
        <rect x="299" y="235" width="10" height="14" fill={textColorA} />
        <rect x="366" y="235" width="10" height="14" fill={textColorA} />
        <rect x="433" y="235" width="10" height="14" fill={textColorA} />
        <rect x="206" y="235" width="10" height="14" fill={textColorA} />
        <rect x="312" y="235" width="10" height="14" fill={textColorA} />
        <rect x="379" y="235" width="10" height="14" fill={textColorA} />
        <rect x="446" y="235" width="10" height="14" fill={textColorA} />
        <rect x="219" y="235" width="10" height="14" fill={textColorA} />
        <rect x="232" y="235" width="10" height="14" fill={textColorA} />
        <rect x="245" y="235" width="10" height="14" fill={textColorA} />
        <rect x="98" y="253" width="10" height="14" fill={textColorA} />
        <rect x="111" y="253" width="10" height="14" fill={textColorA} />
        <rect x="124" y="253" width="10" height="14" fill={textColorA} />
        <rect x="137" y="253" width="10" height="14" fill={textColorA} />
        <rect x="152" y="253" width="10" height="14" fill={textColorA} />
        <rect x="260" y="253" width="10" height="14" fill={textColorA} />
        <rect x="165" y="253" width="10" height="14" fill={textColorA} />
        <rect x="273" y="253" width="10" height="14" fill={textColorA} />
        <rect x="180" y="253" width="10" height="14" fill={textColorA} />
        <rect x="286" y="253" width="10" height="14" fill={textColorA} />
        <rect x="193" y="253" width="10" height="14" fill={textColorA} />
        <rect x="206" y="253" width="10" height="14" fill={textColorA} />
        <rect x="219" y="253" width="10" height="14" fill={textColorA} />
        <rect x="232" y="253" width="10" height="14" fill={textColorA} />
        <rect x="245" y="253" width="10" height="14" fill={textColorA} />
        <rect x="102" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="115" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="128" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="141" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="156" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="169" y="156" width="10" height="14" fill={accentColorA} />
        <rect x="184" y="156" width="10" height="14" fill={accentColorA} />
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
        <rect x="12" y="64" width="9" height="13" fill={textColorA} />
        <rect x="12" y="88" width="9" height="13" fill={textColorA} />
        <rect x="12" y="112" width="9" height="13" fill={textColorA} />
        <rect x="12" y="136" width="9" height="13" fill={textColorA} />
      </g>
      <defs>
        <clipPath id="clip0_104_433">
          <rect width="500" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PreviewWebSimpleSVG;
