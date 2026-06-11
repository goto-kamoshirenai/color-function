import { create } from "zustand";
import { parseHex, toHex, rgbToHsv, hsvToRgb } from "@/core/color";
import { translate, getLocale } from "@/lib/i18n/messages";

export type Color = { id: string; hex: string };
export type Unit = "single" | "pair" | "palette";
export type View = "verify" | "design";

/** palette 変更の唯一の経路（docs/05 §7 / docs/11 §7）。 */
export type ColorChangeIntent =
  | { kind: "set"; id: string; hex: string }
  | { kind: "add"; hex: string }
  | { kind: "remove"; id: string }
  | { kind: "reorder"; order: string[] }
  | { kind: "replaceAll"; hexes: string[] };

export type PickerState = {
  open: boolean;
  targetId: string | null;
  isNew: boolean;
  h: number;
  s: number;
  v: number;
  hexInput: string;
};

export type ColorStore = {
  palette: Color[];
  selectedId: string | null;
  fgId: string | null;
  bgId: string | null;
  accentId: string | null;
  unit: Unit;
  view: View;
  picker: PickerState;
  confirmOpen: boolean;
  toast: string | null;

  apply: (intent: ColorChangeIntent) => void;
  setUnit: (u: Unit) => void;
  setView: (v: View) => void;
  selectSwatch: (id: string) => void;
  setAccent: (id: string) => void;
  hydratePalette: (hexes: string[]) => void;

  openAdd: () => void;
  openEdit: (id: string) => void;
  closePicker: () => void;
  setPickerHsv: (partial: Partial<Pick<PickerState, "h" | "s" | "v">>) => void;
  setPickerHex: (hex: string) => void;
  commitPicker: () => void;

  askClear: () => void;
  cancelClear: () => void;
  clearAll: () => void;
  showToast: (msg: string) => void;
};

const DEFAULT_HEXES = ["#1F2933", "#2D6CDF", "#E4572E", "#1B998B", "#E8C547"];

const uid = (): string => crypto.randomUUID();

function makeColors(hexes: string[]): Color[] {
  return hexes.map((h) => ({ id: uid(), hex: h.toUpperCase() }));
}

const draftHex = (h: number, s: number, v: number) =>
  toHex(hsvToRgb({ h, s, v }));

/** palette 変更後、参照ID（選択/前景/背景/アクセント）を実在する色に補正。 */
function reconcile(
  palette: Color[],
  cur: {
    selectedId: string | null;
    fgId: string | null;
    bgId: string | null;
    accentId: string | null;
  },
) {
  const ids = new Set(palette.map((c) => c.id));
  const first = palette[0]?.id ?? null;
  const last = palette[palette.length - 1]?.id ?? null;
  const fix = (id: string | null) => (id && ids.has(id) ? id : first);
  const fgId = fix(cur.fgId);
  let bgId = fix(cur.bgId);
  if (bgId === fgId && palette.length > 1) bgId = last;
  return {
    selectedId: fix(cur.selectedId),
    fgId,
    bgId,
    accentId: fix(cur.accentId),
  };
}

function initialState(hexes: string[] = DEFAULT_HEXES) {
  const palette = makeColors(hexes);
  return {
    palette,
    selectedId: palette[0]?.id ?? null,
    fgId: palette[0]?.id ?? null,
    bgId: palette[palette.length - 1]?.id ?? null,
    accentId: palette[0]?.id ?? null,
    unit: "pair" as Unit,
    view: "verify" as View,
    picker: {
      open: false,
      targetId: null,
      isNew: false,
      h: 210,
      s: 70,
      v: 60,
      hexInput: "#2D6CDF",
    },
    confirmOpen: false,
    toast: null as string | null,
  };
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useColorStore = create<ColorStore>((set, get) => ({
  ...initialState(),

  apply: (intent) => {
    const palette = get().palette;
    let next: Color[];
    switch (intent.kind) {
      case "set":
        next = palette.map((c) =>
          c.id === intent.id ? { ...c, hex: intent.hex.toUpperCase() } : c,
        );
        break;
      case "add":
        next = [...palette, { id: uid(), hex: intent.hex.toUpperCase() }];
        break;
      case "remove":
        next = palette.filter((c) => c.id !== intent.id);
        break;
      case "reorder": {
        const byId = new Map(palette.map((c) => [c.id, c]));
        next = intent.order
          .map((id) => byId.get(id))
          .filter((c): c is Color => !!c);
        break;
      }
      case "replaceAll":
        next = makeColors(intent.hexes);
        break;
    }
    set({ palette: next, ...reconcile(next, get()) });
  },

  setUnit: (unit) => set({ unit }),
  setView: (view) => set({ view }),

  selectSwatch: (id) => {
    const { unit, view, fgId, bgId } = get();
    // 設計ビューは単位を問わず「基準色の選択」（調和・トーンは selectedId を参照）。
    // FG/BG の入替はペア×検証のときだけ。
    if (view !== "design" && unit === "pair") {
      if (id === bgId) set({ fgId: bgId, bgId: fgId });
      else set({ fgId: id });
    } else {
      set({ selectedId: id });
    }
  },

  setAccent: (id) => set({ accentId: id }),

  hydratePalette: (hexes) => {
    const palette = makeColors(hexes);
    set({
      palette,
      selectedId: palette[0]?.id ?? null,
      fgId: palette[0]?.id ?? null,
      bgId: palette[palette.length - 1]?.id ?? palette[0]?.id ?? null,
      accentId: palette[0]?.id ?? null,
    });
  },

  openAdd: () =>
    set({
      picker: {
        open: true,
        targetId: null,
        isNew: true,
        h: 210,
        s: 70,
        v: 60,
        hexInput: draftHex(210, 70, 60),
      },
    }),

  openEdit: (id) => {
    const color = get().palette.find((c) => c.id === id);
    if (!color) return;
    const v = rgbToHsv(parseHex(color.hex) ?? { r: 0, g: 0, b: 0 });
    set({
      picker: {
        open: true,
        targetId: id,
        isNew: false,
        h: v.h,
        s: v.s,
        v: v.v,
        hexInput: color.hex,
      },
    });
  },

  closePicker: () => set((s) => ({ picker: { ...s.picker, open: false } })),

  setPickerHsv: (partial) =>
    set((s) => {
      const p = { ...s.picker, ...partial };
      return { picker: { ...p, hexInput: draftHex(p.h, p.s, p.v) } };
    }),

  setPickerHex: (hex) =>
    set((s) => {
      const rgb = parseHex(hex);
      if (!rgb) return { picker: { ...s.picker, hexInput: hex } };
      const v = rgbToHsv(rgb);
      return { picker: { ...s.picker, hexInput: hex, h: v.h, s: v.s, v: v.v } };
    }),

  commitPicker: () => {
    const { picker, apply, closePicker, showToast } = get();
    const hex = draftHex(picker.h, picker.s, picker.v);
    if (picker.isNew) {
      apply({ kind: "add", hex });
      showToast(
        translate(getLocale(), "toast.add", { hex: hex.toUpperCase() }),
      );
    } else if (picker.targetId) {
      apply({ kind: "set", id: picker.targetId, hex });
      showToast(
        translate(getLocale(), "toast.update", { hex: hex.toUpperCase() }),
      );
    }
    closePicker();
  },

  askClear: () => set({ confirmOpen: true }),
  cancelClear: () => set({ confirmOpen: false }),
  clearAll: () => {
    get().apply({ kind: "replaceAll", hexes: [] });
    set({ confirmOpen: false });
    get().showToast(translate(getLocale(), "toast.clear"));
  },

  showToast: (msg) => {
    set({ toast: msg });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 1600);
  },
}));

/** テスト用: 既定状態へリセット。 */
export function resetColorStore(hexes?: string[]) {
  useColorStore.setState(initialState(hexes));
}
