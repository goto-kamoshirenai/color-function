"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { usePanelStore } from "@/store/panelStore";
import {
  MdBrightness6,
  MdEqualizer,
  MdTextSnippet,
  MdFitbit,
  MdPalette,
  MdOutlineFilterBAndW,
  MdPreview,
  MdLightbulb,
  MdStyle,
} from "react-icons/md";
import { IconType } from "react-icons";
import { useMyColorStore } from "@/store/myColorStore";
import { useTranslation } from "@/contexts/TranslationContext";

interface SidebarButtonProps {
  isActive: boolean;
  onClick: () => void;
  Icon: IconType;
  label: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  isActive,
  onClick,
  Icon,
  label,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { baseColorA } = useMyColorStore();

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center rounded-full overflow-hidden transition-all duration-300 ease-in-out h-9 group mb-1"
      style={{
        color: isActive ? baseColorA : "black",
        backgroundColor: isActive ? "black" : baseColorA,
        width: isHovered ? "auto" : "36px",
        paddingRight: isHovered ? "1rem" : "0",
        flexShrink: 0,
      }}
    >
      <div className="w-9 h-9 flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <span
        className="relative whitespace-nowrap transition-opacity duration-200 ease-in-out text-sm"
        style={{
          opacity: isHovered ? 1 : 0,
          transitionDelay: isHovered ? "150ms" : "0ms",
        }}
      >
        {label}
        {!isActive && (
          <div
            className="absolute -bottom-[2px] left-0 w-full h-[1px] transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "currentColor",
              transform: isHovered ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              opacity: isHovered ? 0.7 : 0,
              transitionDelay: isHovered ? "200ms" : "0ms",
            }}
          />
        )}
      </span>
    </button>
  );
};

const Sidebar = () => {
  const {
    isShowCardContrastPanel,
    isShowCardHSVPanel,
    isShowCardCSVPanel,
    isShowCardEntropyPanel,
    isShowColorExtendPanel,
    isShowCardCIEDE2000Panel,
    isShowCardPreviewSVGPanel,
    isShowCardRelativeLuminancePanel,
    isShowCardTemplatePanel,
    toggleCardContrastPanel,
    toggleCardHSVPanel,
    toggleCardCSVPanel,
    toggleCardEntropyPanel,
    toggleColorExtendPanel,
    toggleCardCIEDE2000Panel,
    toggleCardPreviewSVGPanel,
    toggleCardRelativeLuminancePanel,
    toggleCardTemplatePanel,
  } = usePanelStore();
  const { t } = useTranslation();
  const { baseColorA } = useMyColorStore();

  // スクロールが必要かどうかを検出するための参照
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);

  // スクロール状態をチェックする関数
  const checkIfScrollable = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const contentHeight = contentRef.current.scrollHeight;
      const newIsScrollable = contentHeight > containerHeight;

      if (newIsScrollable !== isScrollable) {
        setIsScrollable(newIsScrollable);
      }
    }
  }, [isScrollable]);

  // レイアウト計算後すぐにチェック（初期レンダリング時）
  useLayoutEffect(() => {
    checkIfScrollable();
  }, [checkIfScrollable]);

  // コンポーネントがマウントされた後とウィンドウサイズが変更されたときにスクロール状態を確認
  useEffect(() => {
    // マウント直後のチェック
    checkIfScrollable();

    // 画像やフォントの読み込みが完了した後に再チェック
    window.addEventListener("load", checkIfScrollable);

    // 少し遅延させて再チェック（レンダリングが完全に終わった後）
    const initialCheckTimeout = setTimeout(() => {
      checkIfScrollable();
      setIsInitialCheckDone(true);
    }, 300);

    // ウィンドウサイズ変更時にチェック
    window.addEventListener("resize", checkIfScrollable);

    // スクロール時にもチェック
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfScrollable);
    }

    // MutationObserverを使用してコンテンツの変更を監視
    const observer = new MutationObserver(checkIfScrollable);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(initialCheckTimeout);
      window.removeEventListener("load", checkIfScrollable);
      window.removeEventListener("resize", checkIfScrollable);
      if (container) {
        container.removeEventListener("scroll", checkIfScrollable);
      }
      observer.disconnect();
    };
  }, [checkIfScrollable]);

  // 初期チェック完了後に再度チェック（念のため）
  useEffect(() => {
    if (isInitialCheckDone) {
      checkIfScrollable();
    }
  }, [isInitialCheckDone, checkIfScrollable]);

  return (
    <div
      ref={containerRef}
      className={`fixed left-0 top-1/2 -translate-y-1/2 flex flex-col z-40 ${
        isScrollable ? "scrollable-container" : ""
      }`}
      style={{
        height: "50vh",
        maxHeight: "50vh",
        overflowY: "auto",
        overflowX: "hidden",
        direction: "rtl",
        paddingLeft: isScrollable ? "6px" : "16px",
        transition: "padding-left 0.3s ease-in-out",
        // スクロールバーのスタイルはグローバルCSSで定義されているため、ここでは制御しない
      }}
    >
      {/* スクロール可能な場合に表示するインジケーター */}
      {isScrollable && (
        <div
          className="absolute left-1 top-0 bottom-0 w-1 z-50"
          style={{
            backgroundColor: baseColorA,
            opacity: 0.5,
            borderRadius: "3px",
          }}
        />
      )}
      <div
        ref={contentRef}
        className="flex flex-col gap-3 justify-center"
        style={{ direction: "ltr" }}
      >
        <SidebarButton
          isActive={isShowCardTemplatePanel}
          onClick={toggleCardTemplatePanel}
          Icon={MdStyle}
          label={t.sidebar.template}
        />
        <SidebarButton
          isActive={isShowColorExtendPanel}
          onClick={toggleColorExtendPanel}
          Icon={MdPalette}
          label={t.sidebar.colorExtend}
        />
        <SidebarButton
          isActive={isShowCardPreviewSVGPanel}
          onClick={toggleCardPreviewSVGPanel}
          Icon={MdPreview}
          label={t.sidebar.preview}
        />
        <SidebarButton
          isActive={isShowCardContrastPanel}
          onClick={toggleCardContrastPanel}
          Icon={MdBrightness6}
          label={t.sidebar.contrast}
        />
        <SidebarButton
          isActive={isShowCardRelativeLuminancePanel}
          onClick={toggleCardRelativeLuminancePanel}
          Icon={MdLightbulb}
          label={t.sidebar.luminance}
        />
        <SidebarButton
          isActive={isShowCardCIEDE2000Panel}
          onClick={toggleCardCIEDE2000Panel}
          Icon={MdOutlineFilterBAndW}
          label={t.sidebar.ciede2000}
        />
        <SidebarButton
          isActive={isShowCardEntropyPanel}
          onClick={toggleCardEntropyPanel}
          Icon={MdFitbit}
          label={t.sidebar.entropy}
        />
        <SidebarButton
          isActive={isShowCardHSVPanel}
          onClick={toggleCardHSVPanel}
          Icon={MdEqualizer}
          label={t.sidebar.hsv}
        />
        <SidebarButton
          isActive={isShowCardCSVPanel}
          onClick={toggleCardCSVPanel}
          Icon={MdTextSnippet}
          label={t.sidebar.csv}
        />
      </div>
    </div>
  );
};

export default Sidebar;
