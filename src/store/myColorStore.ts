import { create } from "zustand";
import { devtools } from "zustand/middleware";

const defaultMainColor = "#000000";
export const defaultMainColorB = "#404040";
const defaultBaseColor = "#FFFFFF";
export const defaultBaseColorB = "#e5e5e5";
const defaultAccentColor = "#2EA9DF";
export const defaultAccentColorB = "#005CAF";
const defaultTextColor = "#000000";
export const defaultTextColorB = "#404040";

interface MyColorState {
  // パネルの表示状態
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;

  // アクション
  setMainColorA: (color: string) => void;
  setMainColorB: (color: string) => void;
  setBaseColorA: (color: string) => void;
  setBaseColorB: (color: string) => void;
  setAccentColorA: (color: string) => void;
  setAccentColorB: (color: string) => void;
  setTextColorA: (color: string) => void;
  setTextColorB: (color: string) => void;
}

export const useMyColorStore = create<MyColorState>()(
  devtools(
    (set) => ({
      mainColorA: defaultMainColor,
      mainColorB: "",
      baseColorA: defaultBaseColor,
      baseColorB: "",
      accentColorA: defaultAccentColor,
      accentColorB: "",
      textColorA: defaultTextColor,
      textColorB: "",

      setMainColorA: (color: string) => set({ mainColorA: color }),
      setMainColorB: (color: string) => set({ mainColorB: color }),
      setBaseColorA: (color: string) => set({ baseColorA: color }),
      setBaseColorB: (color: string) => set({ baseColorB: color }),
      setAccentColorA: (color: string) => set({ accentColorA: color }),
      setAccentColorB: (color: string) => set({ accentColorB: color }),
      setTextColorA: (color: string) => set({ textColorA: color }),
      setTextColorB: (color: string) => set({ textColorB: color }),
    }),

    {
      name: "MyColorStore",
    }
  )
);
