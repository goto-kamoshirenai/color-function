import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PanelState {
  // パネルの表示状態
  isMyColorPanelOpen: boolean;
  isNavigationOpen: boolean;

  isShowCardContrastPanel: boolean;
  isShowCardHSVPanel: boolean;

  // アクション
  toggleMyColorPanel: () => void;
  toggleNavigation: () => void;

  toggleCardContrastPanel: () => void;
  toggleCardHSVPanel: () => void;

  // 全てのパネルを閉じる
  closeAllPanels: () => void;
}

export const usePanelStore = create<PanelState>()(
  devtools((set) => ({
    isMyColorPanelOpen: false,
    isNavigationOpen: false,

    isShowCardContrastPanel: true,
    isShowCardHSVPanel: true,

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

    closeAllPanels: () =>
      set({
        isShowCardContrastPanel: false,
        isShowCardHSVPanel: false,
        isMyColorPanelOpen: false,
        isNavigationOpen: false,
      }),
  }))
);
