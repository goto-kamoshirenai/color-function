import {
  defaultAccentColor,
  defaultBaseColor,
  defaultMainColor,
  defaultTextColor,
} from "@/const/colorConst";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MyColorState {
  // 色の設定
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;

  // ゲッター
  getMainColor: () => string;
  getBaseColor: () => string;
  getAccentColor: () => string;
  getTextColor: () => string;
  getHoverMainColor: () => string;
  getHoverBaseColor: () => string;
  getHoverAccentColor: () => string;
  getHoverTextColor: () => string;
  getBorderColor: () => string;
  // アクション
  setMainColorA: (color: string) => void;
  setMainColorB: (color: string) => void;
  setBaseColorA: (color: string) => void;
  setBaseColorB: (color: string) => void;
  setAccentColorA: (color: string) => void;
  setAccentColorB: (color: string) => void;
  setTextColorA: (color: string) => void;
  setTextColorB: (color: string) => void;

  // リセット
  resetMyColorStore: () => void;
}

export const useMyColorStore = create<MyColorState>()(
  devtools(
    (set, get) => ({
      mainColorA: defaultMainColor,
      mainColorB: "",
      baseColorA: defaultBaseColor,
      baseColorB: "",
      accentColorA: defaultAccentColor,
      accentColorB: "",
      textColorA: defaultTextColor,
      textColorB: "",

      // ゲッター
      getMainColor: () => get().mainColorA ?? defaultMainColor,
      getBaseColor: () => get().baseColorA ?? defaultBaseColor,
      getAccentColor: () => get().accentColorA ?? defaultAccentColor,
      getTextColor: () => get().textColorA ?? defaultTextColor,

      getHoverMainColor: () =>
        get().mainColorB ?? get().mainColorA ?? defaultMainColor,
      getHoverBaseColor: () =>
        get().baseColorB ?? get().baseColorA ?? defaultBaseColor,
      getHoverAccentColor: () =>
        get().accentColorB ?? get().accentColorA ?? defaultAccentColor,
      getHoverTextColor: () =>
        get().textColorB ?? get().textColorA ?? defaultTextColor,
      getBorderColor: () =>
        get().baseColorB ?? get().textColorA ?? defaultBaseColor,

      // アクション
      setMainColorA: (color: string) => set({ mainColorA: color }),
      setMainColorB: (color: string) => set({ mainColorB: color }),
      setBaseColorA: (color: string) => set({ baseColorA: color }),
      setBaseColorB: (color: string) => set({ baseColorB: color }),
      setAccentColorA: (color: string) => set({ accentColorA: color }),
      setAccentColorB: (color: string) => set({ accentColorB: color }),
      setTextColorA: (color: string) => set({ textColorA: color }),
      setTextColorB: (color: string) => set({ textColorB: color }),

      resetMyColorStore: () =>
        set({
          mainColorA: defaultMainColor,
          mainColorB: "",
          baseColorA: defaultBaseColor,
          baseColorB: "",
          accentColorA: defaultAccentColor,
          accentColorB: "",
          textColorA: defaultTextColor,
          textColorB: "",
        }),
    }),
    {
      name: "MyColorStore",
    }
  )
);
