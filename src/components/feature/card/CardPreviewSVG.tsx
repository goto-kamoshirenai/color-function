import React, { useState } from "react";
import PanelWrapper from "@/components/elements/PanelWrapper";
import { useTranslation } from "@/contexts/TranslationContext";
import { useMyColorStore } from "@/store/myColorStore";
import PreviewRatioSVG from "../preview/svg/PreviewRatioSVG";
import SidebarPreviewRatioSVG from "../preview/svg/SidebarPreviewRatioSVG";
import PreviewArtSVG from "../preview/svg/PreviewArtSVG";
import SidebarPreviewArtSVG from "../preview/svg/SidebarPreviewArtSVG";
import PreviewWebBlogSVG from "../preview/svg/PreviewWebBlogSVG";
import SidebarPreviewWebBlogSVG from "../preview/svg/SidebarPreviewWebBlogSVG";
import PreviewWebSimpleSVG from "../preview/svg/PreviewWebSimpleSVG";
import SidebarPreviewWebSimpleSVG from "../preview/svg/SidebarPreviewWebSimpleSVG";
import PreviewDashboardSVG from "../preview/svg/PreviewDashboardSVG";
import SidebarPreviewDashboardSVG from "../preview/svg/SidebarPreviewDashboardSVG";
import PreviewMobileSVG from "../preview/svg/PreviewMobileSVG";
import SidebarPreviewMobileSVG from "../preview/svg/SidebarPreviewMobileSVG";
import PreviewEcommerceSVG from "../preview/svg/PreviewEcommerceSVG";
import SidebarPreviewEcommerceSVG from "../preview/svg/SidebarPreviewEcommerceSVG";

// SVGの種類を定義
type SVGType =
  | "preview-ratio"
  | "preview-art"
  | "preview-web-blog"
  | "preview-web-simple"
  | "preview-dashboard"
  | "preview-mobile"
  | "preview-ecommerce";

// SVGコンポーネントの定義
type PreviewSVGComponent = React.FC<{
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
}>;

type SidebarSVGComponent = React.FC<{
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
}>;

// SVGの情報を定義
interface SVGInfo {
  id: SVGType;
  name: string;
  PreviewComponent: PreviewSVGComponent;
  SidebarComponent: SidebarSVGComponent;
}

const CardPreviewSVG: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSVG, setSelectedSVG] = useState<SVGType>("preview-ratio");

  // 色の取得
  const colors = useMyColorStore();
  const {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  } = colors;

  // 共通のprops
  const previewProps = {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
    textColorA,
    textColorB,
  };

  const sidebarProps = {
    mainColorA,
    mainColorB,
    baseColorA,
    baseColorB,
    accentColorA,
    accentColorB,
  };

  // SVGの定義
  const svgDefinitions: SVGInfo[] = [
    {
      id: "preview-ratio",
      name: "レイアウト比率",
      PreviewComponent: PreviewRatioSVG,
      SidebarComponent: SidebarPreviewRatioSVG,
    },
    {
      id: "preview-art",
      name: "アートレイアウト",
      PreviewComponent: PreviewArtSVG,
      SidebarComponent: SidebarPreviewArtSVG,
    },
    {
      id: "preview-web-blog",
      name: "ウェブブログ",
      PreviewComponent: PreviewWebBlogSVG,
      SidebarComponent: SidebarPreviewWebBlogSVG,
    },
    {
      id: "preview-web-simple",
      name: "シンプルウェブ",
      PreviewComponent: PreviewWebSimpleSVG,
      SidebarComponent: SidebarPreviewWebSimpleSVG,
    },
    {
      id: "preview-dashboard",
      name: "ダッシュボード",
      PreviewComponent: PreviewDashboardSVG,
      SidebarComponent: SidebarPreviewDashboardSVG,
    },
    {
      id: "preview-mobile",
      name: "モバイルアプリ",
      PreviewComponent: PreviewMobileSVG,
      SidebarComponent: SidebarPreviewMobileSVG,
    },
    {
      id: "preview-ecommerce",
      name: "ECサイト",
      PreviewComponent: PreviewEcommerceSVG,
      SidebarComponent: SidebarPreviewEcommerceSVG,
    },
  ];

  // SVGリストの生成
  const svgList = svgDefinitions.map(
    ({ id, name, PreviewComponent, SidebarComponent }) => ({
      id,
      name,
      component: <PreviewComponent {...previewProps} />,
      sidebarComponent: <SidebarComponent {...sidebarProps} />,
    })
  );

  // 選択されたSVGを取得
  const getSelectedSVG = () => {
    return svgList.find((svg) => svg.id === selectedSVG);
  };

  return (
    <PanelWrapper
      title={t.sidebar.preview || "プレビュー"}
      helpPanelKey="preview"
    >
      {/* 上部のSVG選択部分 */}
      <div
        className="w-full  overflow-x-auto overflow-y-hidden pb-1 mb-1 border-b"
        style={{
          borderColor: `${textColorA}`,
        }}
      >
        <div className="flex gap-3 min-w-max px-2 h-full items-center">
          {svgList.map((svg) => (
            <div
              key={svg.id}
              className={`cursor-pointer p-2 rounded-md `}
              style={{
                border:
                  selectedSVG === svg.id
                    ? `2px solid ${accentColorA}`
                    : `1px solid ${textColorA}`,
              }}
              onClick={() => setSelectedSVG(svg.id)}
            >
              <div
                className="w-full m-auto"
                style={{
                  height: "5vh",
                  border: `1px solid ${textColorA}`,
                }}
              >
                {svg.sidebarComponent}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* プレビュー部分 */}
      <div
        className="flex overflow-hidden"
        style={{
          height: `calc(100% - 5vh - 4.25rem)`,
        }}
      >
        <div
          className=" aspect-[5/3] mx-auto"
          style={{
            border: `1px solid ${textColorA}`,
          }}
        >
          {getSelectedSVG()?.component}
        </div>
      </div>
    </PanelWrapper>
  );
};

export default CardPreviewSVG;
