"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { useColorStore } from "@/store/useColorStore";
import { hsvToRgb, toHex } from "@/core/color";

function Slider({
  label,
  value,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-text-2 flex items-center gap-2 text-xs">
      <span className="w-16 font-mono">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent flex-1"
      />
      <span className="text-text w-12 text-right font-mono">
        {Math.round(value)}
        {unit}
      </span>
    </label>
  );
}

export function ColorPicker() {
  const picker = useColorStore((s) => s.picker);
  const closePicker = useColorStore((s) => s.closePicker);
  const setPickerHsv = useColorStore((s) => s.setPickerHsv);
  const setPickerHex = useColorStore((s) => s.setPickerHex);
  const commitPicker = useColorStore((s) => s.commitPicker);
  const apply = useColorStore((s) => s.apply);

  const preview = toHex(hsvToRgb({ h: picker.h, s: picker.s, v: picker.v }));

  return (
    <ModalOverlay
      isOpen={picker.open}
      onOpenChange={(open) => {
        if (!open) closePicker();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <Modal className="border-border bg-surface w-full max-w-sm rounded-2xl border p-5 shadow-xl">
        <Dialog className="outline-none">
          <Heading slot="title" className="text-text text-sm font-semibold">
            {picker.isNew ? "色を追加" : "色を編集"}
          </Heading>

          <div className="mt-4 flex items-center gap-3">
            <div
              className="border-border size-14 rounded-lg border"
              style={{ backgroundColor: preview }}
              aria-hidden
            />
            <label className="text-text-2 flex flex-1 flex-col gap-1 text-xs">
              <span className="font-mono">HEX</span>
              <input
                type="text"
                value={picker.hexInput}
                onChange={(e) => setPickerHex(e.target.value)}
                spellCheck={false}
                className="border-border bg-bg text-text rounded-md border px-2 py-1 font-mono"
              />
            </label>
          </div>

          <div className="mt-4 space-y-2">
            <Slider
              label="H 色相"
              value={picker.h}
              max={360}
              unit="°"
              onChange={(h) => setPickerHsv({ h })}
            />
            <Slider
              label="S 彩度"
              value={picker.s}
              max={100}
              unit="%"
              onChange={(s) => setPickerHsv({ s })}
            />
            <Slider
              label="V 明度"
              value={picker.v}
              max={100}
              unit="%"
              onChange={(v) => setPickerHsv({ v })}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            {!picker.isNew && picker.targetId ? (
              <button
                type="button"
                onClick={() => {
                  apply({ kind: "remove", id: picker.targetId! });
                  closePicker();
                }}
                className="text-text-3 hover:text-text text-xs"
              >
                削除
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closePicker}
                className="border-border text-text-2 hover:text-text rounded-md border px-3 py-1.5 text-xs"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={commitPicker}
                className="bg-text text-bg rounded-md px-3 py-1.5 text-xs font-medium"
              >
                {picker.isNew ? "追加" : "適用"}
              </button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
