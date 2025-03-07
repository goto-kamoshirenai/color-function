import React from "react";

interface PreviewWebBlogSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewWebBlogSVG: React.FC<PreviewWebBlogSVGProps> = ({
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
  // textBは使用していないが、将来的に使用する可能性があるため残しておく
  // const textB = textColorB || textColorA;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_104_2)">
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
        <rect x="98" y="39" width="10" height="14" fill={accentColorA} />
        <rect x="111" y="39" width="10" height="14" fill="white" />
        <rect x="124" y="39" width="10" height="14" fill="white" />
        <rect x="137" y="39" width="10" height="14" fill="white" />
        <rect x="152" y="39" width="10" height="14" fill="white" />
        <rect x="260" y="39" width="10" height="14" fill="white" />
        <rect x="165" y="39" width="10" height="14" fill="white" />
        <rect x="273" y="39" width="10" height="14" fill="white" />
        <rect x="178" y="39" width="10" height="14" fill="white" />
        <rect x="286" y="39" width="10" height="14" fill="white" />
        <rect x="191" y="39" width="10" height="14" fill="white" />
        <rect x="299" y="39" width="10" height="14" fill="white" />
        <rect x="204" y="39" width="10" height="14" fill="white" />
        <rect x="312" y="39" width="10" height="14" fill="white" />
        <rect x="219" y="39" width="10" height="14" fill="white" />
        <rect x="232" y="39" width="10" height="14" fill="white" />
        <rect x="245" y="39" width="10" height="14" fill="white" />
        <rect x="98" y="60" width="10" height="14" fill={textColorA} />
        <rect x="111" y="60" width="10" height="14" fill={textColorA} />
        <rect x="124" y="60" width="10" height="14" fill={textColorA} />
        <rect x="137" y="60" width="10" height="14" fill={textColorA} />
        <rect x="152" y="60" width="10" height="14" fill={textColorA} />
        <rect x="260" y="60" width="10" height="14" fill={textColorA} />
        <rect x="327" y="60" width="10" height="14" fill={textColorA} />
        <rect x="394" y="60" width="10" height="14" fill={textColorA} />
        <rect x="165" y="60" width="10" height="14" fill={textColorA} />
        <rect x="273" y="60" width="10" height="14" fill={textColorA} />
        <rect x="340" y="60" width="10" height="14" fill={textColorA} />
        <rect x="407" y="60" width="10" height="14" fill={textColorA} />
        <rect x="180" y="60" width="10" height="14" fill={textColorA} />
        <rect x="286" y="60" width="10" height="14" fill={textColorA} />
        <rect x="353" y="60" width="10" height="14" fill={textColorA} />
        <rect x="420" y="60" width="10" height="14" fill={textColorA} />
        <rect x="193" y="60" width="10" height="14" fill={textColorA} />
        <rect x="299" y="60" width="10" height="14" fill={textColorA} />
        <rect x="366" y="60" width="10" height="14" fill={textColorA} />
        <rect x="433" y="60" width="10" height="14" fill={textColorA} />
        <rect x="206" y="60" width="10" height="14" fill={textColorA} />
        <rect x="312" y="60" width="10" height="14" fill={textColorA} />
        <rect x="379" y="60" width="10" height="14" fill={textColorA} />
        <rect x="446" y="60" width="10" height="14" fill={textColorA} />
        <rect x="219" y="60" width="10" height="14" fill={textColorA} />
        <rect x="232" y="60" width="10" height="14" fill={textColorA} />
        <rect x="245" y="60" width="10" height="14" fill={textColorA} />
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
        <rect x="98" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="111" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="124" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="137" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="152" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="260" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="165" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="273" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="180" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="286" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="193" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="206" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="219" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="232" y="214" width="10" height="14" fill={accentColorA} />
        <rect x="245" y="214" width="10" height="14" fill={accentColorA} />
        <rect y="26" width="73" height="274" fill={baseB} />
        <circle cx="485" cy="13" r="7" fill={accentB} />
        <circle cx="467" cy="13" r="7" fill={accentColorA} />
        <circle cx="15" cy="13" r="7" fill={mainB} />
        <circle cx="471" cy="46" r="7" fill={mainB} />
        <rect x="8" y="36" width="59" height="20" fill={accentColorA} />
        <rect x="13" y="60" width="10" height="14" fill={textColorA} />
        <rect x="26" y="60" width="10" height="14" fill={textColorA} />
        <rect x="39" y="60" width="10" height="14" fill={textColorA} />
        <rect x="52" y="60" width="10" height="14" fill={textColorA} />
        <rect x="13" y="81" width="10" height="14" fill={textColorA} />
        <rect x="26" y="81" width="10" height="14" fill={textColorA} />
        <rect x="39" y="81" width="10" height="14" fill={textColorA} />
        <rect x="52" y="81" width="10" height="14" fill={textColorA} />
        <rect x="13" y="102" width="10" height="14" fill={textColorA} />
        <rect x="26" y="102" width="10" height="14" fill={textColorA} />
        <rect x="39" y="102" width="10" height="14" fill={textColorA} />
        <rect x="52" y="102" width="10" height="14" fill={textColorA} />
        <rect x="13" y="123" width="10" height="14" fill={textColorA} />
        <rect x="26" y="123" width="10" height="14" fill={textColorA} />
        <rect x="39" y="123" width="10" height="14" fill={textColorA} />
        <rect x="52" y="123" width="10" height="14" fill={textColorA} />
        <rect x="13" y="144" width="10" height="14" fill={textColorA} />
        <rect x="26" y="144" width="10" height="14" fill={textColorA} />
        <rect x="39" y="144" width="10" height="14" fill={textColorA} />
        <rect x="52" y="144" width="10" height="14" fill={textColorA} />
        <rect x="13" y="39" width="10" height="14" fill="white" />
        <rect x="26" y="39" width="10" height="14" fill="white" />
        <rect x="39" y="39" width="10" height="14" fill="white" />
        <rect x="52" y="39" width="10" height="14" fill="white" />
        <rect x="5" y="285" width="62" height="11" fill={accentB} />
        <rect x="27" y="6" width="80" height="14" fill={mainB} />
      </g>
      <defs>
        <clipPath id="clip0_104_2">
          <rect width="500" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PreviewWebBlogSVG;
