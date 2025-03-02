import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PanelState {
  // パネルの表示状態
  isMyColorPanelOpen: boolean;
  isNavigationOpen: boolean;

  isShowCardContrastPanel: boolean;
  isShowCardHSVPanel: boolean;
  isShowCardCSVPanel: boolean;
  isShowCardEntropyPanel: boolean;
  isShowColorExtendPanel: boolean;

  // アクション
  toggleMyColorPanel: () => void;
  toggleNavigation: () => void;

  toggleCardContrastPanel: () => void;
  toggleCardHSVPanel: () => void;
  toggleCardCSVPanel: () => void;
  toggleCardEntropyPanel: () => void;
  toggleColorExtendPanel: () => void;
  // 全てのパネルを閉じる
  closeAllPanels: () => void;
}

export const usePanelStore = create<PanelState>()(
  devtools((set) => ({
    isMyColorPanelOpen: false,
    isNavigationOpen: false,

    isShowCardContrastPanel: true,
    isShowCardHSVPanel: true,
    isShowCardCSVPanel: false,
    isShowCardEntropyPanel: true,
    isShowColorExtendPanel: true,

    toggleMyColorPanel: () =>
      set((state) => ({
        isMyColorPanelOpen: !state.isMyColorPanelOpen,
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

    closeAllPanels: () =>
      set({
        isShowCardContrastPanel: false,
        isShowCardHSVPanel: false,
        isShowCardCSVPanel: false,
        isShowCardEntropyPanel: false,
        isShowColorExtendPanel: false,
        isMyColorPanelOpen: false,
        isNavigationOpen: false,
      }),
  }))
);
