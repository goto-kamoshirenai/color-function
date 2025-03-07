import React from "react";

interface PreviewRatioSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewRatioSVG: React.FC<PreviewRatioSVGProps> = ({
  mainColorA,
  mainColorB,
  baseColorA,
  baseColorB,
  accentColorA,
  accentColorB,
  textColorA,
  textColorB,
}) => {
  // Bの色がない場合はAの色を使用
  const mainB = mainColorB || mainColorA;
  const baseB = baseColorB || baseColorA;
  const accentB = accentColorB || accentColorA;
  const textB = textColorB || textColorA;

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
      <rect x="119" y="10" width="10" height="14" fill={textColorA} />
      <rect x="132" y="10" width="10" height="14" fill={textColorA} />
      <rect x="145" y="10" width="10" height="14" fill={textColorA} />
      <rect x="158" y="10" width="10" height="14" fill={textColorA} />
      <rect x="173" y="10" width="10" height="14" fill={textColorA} />
      <rect x="281" y="10" width="10" height="14" fill={textColorA} />
      <rect x="186" y="10" width="10" height="14" fill={textColorA} />
      <rect x="294" y="10" width="10" height="14" fill={textColorA} />
      <rect x="201" y="10" width="10" height="14" fill={textColorA} />
      <rect x="307" y="10" width="10" height="14" fill={textColorA} />
      <rect x="214" y="10" width="10" height="14" fill={textColorA} />
      <rect x="227" y="10" width="10" height="14" fill={textColorA} />
      <rect x="240" y="10" width="10" height="14" fill={textColorA} />
      <rect x="253" y="10" width="10" height="14" fill={textColorA} />
      <rect x="266" y="10" width="10" height="14" fill={textColorA} />
      <rect x="119" y="162" width="10" height="14" fill={textB} />
      <rect x="132" y="162" width="10" height="14" fill={textB} />
      <rect x="145" y="162" width="10" height="14" fill={textB} />
      <rect x="158" y="162" width="10" height="14" fill={textB} />
      <rect x="173" y="162" width="10" height="14" fill={textB} />
      <rect x="281" y="162" width="10" height="14" fill={textB} />
      <rect x="186" y="162" width="10" height="14" fill={textB} />
      <rect x="294" y="162" width="10" height="14" fill={textB} />
      <rect x="201" y="162" width="10" height="14" fill={textB} />
      <rect x="307" y="162" width="10" height="14" fill={textB} />
      <rect x="214" y="162" width="10" height="14" fill={textB} />
      <rect x="227" y="162" width="10" height="14" fill={textB} />
      <rect x="240" y="162" width="10" height="14" fill={textB} />
      <rect x="253" y="162" width="10" height="14" fill={textB} />
      <rect x="266" y="162" width="10" height="14" fill={textB} />
      <rect width="24" height="151" fill={accentColorA} />
      <rect y="151" width="24" height="149" fill={accentB} />
      <rect x="16" y="10" width="10" height="14" fill="white" />
      <rect x="29" y="10" width="10" height="14" fill="white" />
      <rect x="42" y="10" width="10" height="14" fill="white" />
      <rect x="16" y="162" width="10" height="14" fill="white" />
      <rect x="29" y="162" width="10" height="14" fill="white" />
      <rect x="42" y="162" width="10" height="14" fill="white" />
      <circle cx="488" cy="52" r="7" fill={accentColorA} />
      <circle cx="488" cy="287" r="7" fill={accentB} />
    </svg>
  );
};

export default PreviewRatioSVG;
