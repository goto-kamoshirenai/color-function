import React from "react";

interface PreviewEcommerceSVGProps {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}

const PreviewEcommerceSVG: React.FC<PreviewEcommerceSVGProps> = ({
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
  // textBは現在使用していないが、将来的に使用する可能性があるため変数定義をコメントアウト
  // const textB = textColorB || textColorA;

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

      {/* ロゴ */}
      <rect x="20" y="15" width="80" height="20" rx="3" fill="white" />

      {/* 検索バー */}
      <rect x="150" y="15" width="200" height="20" rx="10" fill="white" />
      <circle cx="160" cy="25" r="5" fill={textColorA} />

      {/* カートアイコン */}
      <circle cx="450" cy="25" r="15" fill={accentColorA} />
      <path d="M445 20 L455 20 L453 30 L447 30 Z" fill="white" />
      <rect x="448" y="17" width="4" height="5" rx="2" fill="white" />

      {/* メインビジュアル */}
      <rect x="20" y="60" width="460" height="80" rx="5" fill={mainB} />
      <rect x="40" y="80" width="150" height="10" rx="5" fill="white" />
      <rect x="40" y="100" width="100" height="10" rx="5" fill="white" />
      <rect x="40" y="120" width="80" height="10" rx="5" fill={accentColorA} />

      {/* 商品カテゴリー */}
      <rect x="20" y="150" width="100" height="20" rx="3" fill={textColorA} />

      {/* 商品グリッド */}
      <rect x="20" y="180" width="140" height="110" rx="5" fill={baseB} />
      <rect x="170" y="180" width="140" height="110" rx="5" fill={baseB} />
      <rect x="320" y="180" width="140" height="110" rx="5" fill={baseB} />

      {/* 商品画像 */}
      <rect x="30" y="190" width="120" height="70" rx="3" fill="white" />
      <rect x="180" y="190" width="120" height="70" rx="3" fill="white" />
      <rect x="330" y="190" width="120" height="70" rx="3" fill="white" />

      {/* 商品情報 */}
      <rect x="30" y="270" width="80" height="8" rx="4" fill={textColorA} />
      <rect x="30" y="282" width="60" height="8" rx="4" fill={textColorA} />
      <rect
        x="100"
        y="270"
        width="40"
        height="15"
        rx="7.5"
        fill={accentColorA}
      />

      <rect x="180" y="270" width="80" height="8" rx="4" fill={textColorA} />
      <rect x="180" y="282" width="60" height="8" rx="4" fill={textColorA} />
      <rect x="250" y="270" width="40" height="15" rx="7.5" fill={accentB} />

      <rect x="330" y="270" width="80" height="8" rx="4" fill={textColorA} />
      <rect x="330" y="282" width="60" height="8" rx="4" fill={textColorA} />
      <rect
        x="400"
        y="270"
        width="40"
        height="15"
        rx="7.5"
        fill={accentColorA}
      />

      {/* 商品ラベル */}
      <rect x="30" y="190" width="40" height="20" rx="3" fill={accentB} />
      <rect x="180" y="190" width="40" height="20" rx="3" fill={accentColorA} />

      {/* ナビゲーション */}
      <rect x="20" y="50" width="460" height="1" fill={textColorA} />
      <rect x="50" y="50" width="30" height="1" fill={accentColorA} />
      <rect x="100" y="50" width="30" height="1" fill={textColorA} />
      <rect x="150" y="50" width="30" height="1" fill={textColorA} />
      <rect x="200" y="50" width="30" height="1" fill={textColorA} />
    </svg>
  );
};

export default PreviewEcommerceSVG;
