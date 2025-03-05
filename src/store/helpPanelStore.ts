import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { HelpPanelKey } from "@/types/common";
interface HelpPanelState {
  // パネルの表示状態
  isHelpPanelOpen: boolean;
  helpPanelKey: HelpPanelKey;

  // アクション
  openHelpPanel: (key: HelpPanelKey) => void;
  closeHelpPanel: () => void;
}

export const useHelpPanelStore = create<HelpPanelState>()(
  devtools((set) => ({
    isHelpPanelOpen: false,

    openHelpPanel: (key: HelpPanelKey) =>
      set(() => ({
        isHelpPanelOpen: true,
        helpPanelKey: key,
      })),

    closeHelpPanel: () =>
      set(() => ({
        isHelpPanelOpen: false,
        helpPanelKey: null,
      })),
  }))
);
