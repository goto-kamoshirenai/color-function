import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PanelState {
  // パネルの表示状態
  isColorPickerOpen: boolean;
  isHistoryPanelOpen: boolean;
  isSettingsPanelOpen: boolean;
  isNavigationOpen: boolean;

  // アクション
  toggleColorPicker: () => void;
  toggleHistoryPanel: () => void;
  toggleSettingsPanel: () => void;
  toggleNavigation: () => void;

  // 全てのパネルを閉じる
  closeAllPanels: () => void;
}

export const usePanelStore = create<PanelState>()(
  devtools(
    (set) => ({
      isColorPickerOpen: false,
      isHistoryPanelOpen: false,
      isSettingsPanelOpen: false,
      isNavigationOpen: false,

      toggleColorPicker: () =>
        set(
          (state) => ({
            isColorPickerOpen: !state.isColorPickerOpen,
            isHistoryPanelOpen: false,
            isSettingsPanelOpen: false,
            isNavigationOpen: false,
          }),
          false,
          "toggleColorPicker"
        ),

      toggleHistoryPanel: () =>
        set(
          (state) => ({
            isHistoryPanelOpen: !state.isHistoryPanelOpen,
            isColorPickerOpen: false,
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
            isColorPickerOpen: false,
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
