import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PanelState {
  // パネルの表示状態
  isMyColorPanelOpen: boolean;
  isHistoryPanelOpen: boolean;
  isSettingsPanelOpen: boolean;
  isNavigationOpen: boolean;

  // アクション
  toggleMyColorPanel: () => void;
  toggleHistoryPanel: () => void;
  toggleSettingsPanel: () => void;
  toggleNavigation: () => void;

  // 全てのパネルを閉じる
  closeAllPanels: () => void;
}

export const usePanelStore = create<PanelState>()(
  devtools(
    (set) => ({
      isMyColorPanelOpen: false,
      isHistoryPanelOpen: false,
      isSettingsPanelOpen: false,
      isNavigationOpen: false,

      toggleMyColorPanel: () =>
        set(
          (state) => ({
            isMyColorPanelOpen: !state.isMyColorPanelOpen,
            isHistoryPanelOpen: false,
            isSettingsPanelOpen: false,
            isNavigationOpen: false,
          }),
          false,
          "toggleMyColorPanel"
        ),

      toggleHistoryPanel: () =>
        set(
          (state) => ({
            isHistoryPanelOpen: !state.isHistoryPanelOpen,
            isMyColorPanelOpen: false,
            isSettingsPanelOpen: false,
            isNavigationOpen: false,
          }),
          false,
          "toggleHistoryPanel"
        ),

      toggleSettingsPanel: () =>
        set(
          (state) => ({
            isSettingsPanelOpen: !state.isSettingsPanelOpen,
            isColorPickerOpen: false,
            isHistoryPanelOpen: false,
            isNavigationOpen: false,
          }),
          false,
          "toggleSettingsPanel"
        ),

      toggleNavigation: () =>
        set(
          (state) => ({
            isNavigationOpen: !state.isNavigationOpen,
            isColorPickerOpen: false,
            isHistoryPanelOpen: false,
            isSettingsPanelOpen: false,
          }),
          false,
          "toggleNavigation"
        ),

      closeAllPanels: () =>
        set(
          {
            isMyColorPanelOpen: false,
            isHistoryPanelOpen: false,
            isSettingsPanelOpen: false,
            isNavigationOpen: false,
          },
          false,
          "closeAllPanels"
        ),
    }),
    {
      name: "PanelStore",
    }
  )
);
