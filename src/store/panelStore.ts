import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PanelState {
  // パネルの表示状態
  isMyColorPanelOpen: boolean;
  isAboutPanelOpen: boolean;
  isContactPanelOpen: boolean;
  isNavigationOpen: boolean;

  isShowCardContrastPanel: boolean;
  isShowCardHSVPanel: boolean;
  isShowCardCSVPanel: boolean;
  isShowCardEntropyPanel: boolean;
  isShowColorExtendPanel: boolean;
  isShowCardCIEDE2000Panel: boolean;
  isShowCardPreviewSVGPanel: boolean;
  isShowCardRelativeLuminancePanel: boolean;
  isShowCardTemplatePanel: boolean;

  // アクション
  toggleMyColorPanel: () => void;
  toggleAboutPanel: () => void;
  toggleContactPanel: () => void;
  toggleNavigation: () => void;

  toggleCardContrastPanel: () => void;
  toggleCardHSVPanel: () => void;
  toggleCardCSVPanel: () => void;
  toggleCardEntropyPanel: () => void;
  toggleColorExtendPanel: () => void;
  toggleCardCIEDE2000Panel: () => void;
  toggleCardPreviewSVGPanel: () => void;
  toggleCardRelativeLuminancePanel: () => void;
  toggleCardTemplatePanel: () => void;
  // 全てのパネルを閉じる
  closeAllPanels: () => void;
}

export const usePanelStore = create<PanelState>()(
  devtools((set) => ({
    isMyColorPanelOpen: false,
    isAboutPanelOpen: false,
    isContactPanelOpen: false,
    isNavigationOpen: false,

    isShowCardContrastPanel: true,
    isShowCardHSVPanel: false,
    isShowCardCSVPanel: false,
    isShowCardEntropyPanel: false,
    isShowColorExtendPanel: true,
    isShowCardCIEDE2000Panel: false,
    isShowCardPreviewSVGPanel: true,
    isShowCardRelativeLuminancePanel: false,
    isShowCardTemplatePanel: true,

    toggleMyColorPanel: () =>
      set((state) => ({
        isMyColorPanelOpen: !state.isMyColorPanelOpen,
        isNavigationOpen: false,
      })),

    toggleAboutPanel: () =>
      set((state) => ({
        isAboutPanelOpen: !state.isAboutPanelOpen,
        isNavigationOpen: false,
      })),

    toggleContactPanel: () =>
      set((state) => ({
        isContactPanelOpen: !state.isContactPanelOpen,
        isNavigationOpen: false,
      })),

    toggleNavigation: () =>
      set((state) => ({
        isNavigationOpen: !state.isNavigationOpen,
        isColorPickerOpen: false,
        isHistoryPanelOpen: false,
        isSettingsPanelOpen: false,
      })),

    toggleCardContrastPanel: () =>
      set((state) => ({
        isShowCardContrastPanel: !state.isShowCardContrastPanel,
      })),

    toggleCardHSVPanel: () =>
      set((state) => ({
        isShowCardHSVPanel: !state.isShowCardHSVPanel,
      })),

    toggleCardCSVPanel: () =>
      set((state) => ({
        isShowCardCSVPanel: !state.isShowCardCSVPanel,
      })),

    toggleCardEntropyPanel: () =>
      set((state) => ({
        isShowCardEntropyPanel: !state.isShowCardEntropyPanel,
      })),

    toggleColorExtendPanel: () =>
      set((state) => ({
        isShowColorExtendPanel: !state.isShowColorExtendPanel,
      })),

    toggleCardCIEDE2000Panel: () =>
      set((state) => ({
        isShowCardCIEDE2000Panel: !state.isShowCardCIEDE2000Panel,
      })),

    toggleCardPreviewSVGPanel: () =>
      set((state) => ({
        isShowCardPreviewSVGPanel: !state.isShowCardPreviewSVGPanel,
      })),

    toggleCardRelativeLuminancePanel: () =>
      set((state) => ({
        isShowCardRelativeLuminancePanel:
          !state.isShowCardRelativeLuminancePanel,
      })),

    toggleCardTemplatePanel: () =>
      set((state) => ({
        isShowCardTemplatePanel: !state.isShowCardTemplatePanel,
      })),

    closeAllPanels: () =>
      set({
        isShowCardContrastPanel: false,
        isShowCardHSVPanel: false,
        isShowCardCSVPanel: false,
        isShowCardEntropyPanel: false,
        isShowColorExtendPanel: false,
        isShowCardCIEDE2000Panel: false,
        isShowCardPreviewSVGPanel: false,
        isShowCardRelativeLuminancePanel: false,
        isShowCardTemplatePanel: false,
        isMyColorPanelOpen: false,
        isAboutPanelOpen: false,
        isContactPanelOpen: false,
        isNavigationOpen: false,
      }),
  }))
);
