"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { Xmark } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { hsvToRgb, toHex, parseHex } from "@/core/color";

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
    <div>
      <div className="mb-[5px] flex justify-between">
        <span className="text-text-2 font-mono text-[11px]">{label}</span>
        <span className="font-mono text-xs font-medium">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full accent-(--accent)"
      />
    </div>
  );
}

/** カラーピッカー（v2: 380px パネル・84px プレビュー・HEX＋HSVスライダー）。 */
export function ColorPicker() {
  const picker = useColorStore((s) => s.picker);
  const closePicker = useColorStore((s) => s.closePicker);
  const setPickerHsv = useColorStore((s) => s.setPickerHsv);
  const setPickerHex = useColorStore((s) => s.setPickerHex);
  const commitPicker = useColorStore((s) => s.commitPicker);
  const apply = useColorStore((s) => s.apply);

  const preview = toHex(hsvToRgb({ h: picker.h, s: picker.s, v: picker.v }));
  const hexInvalid =
    picker.hexInput.trim() !== "" && parseHex(picker.hexInput) === null;

  return (
    <ModalOverlay
      isOpen={picker.open}
      onOpenChange={(open) => {
        if (!open) closePicker();
      }}
      isDismissable
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
    >
      <Modal className="border-border-strong bg-surface w-[380px] max-w-full overflow-hidden rounded-[3px] border shadow-[0_24px_64px_rgba(0,0,0,0.32)]">
        <Dialog className="outline-none">
          <div className="border-border flex items-center justify-between border-b px-[18px] py-3.5">
            <div className="flex items-baseline gap-[9px]">
              <span className="text-accent font-mono text-[10px] tracking-[0.1em]">
                ●
              </span>
              <Heading slot="title" className="text-sm font-bold">
                {picker.isNew ? "色を追加" : "色を編集"}
              </Heading>
            </div>
            <button
              type="button"
              onClick={closePicker}
              aria-label="閉じる"
              className="border-border-strong text-text-2 hover:bg-surface-2 flex size-[26px] items-center justify-center rounded-[2px] border bg-transparent"
            >
              <Xmark width={14} height={14} aria-hidden />
            </button>
          </div>

          <div className="p-[18px]">
            <div
              className="border-border-strong mb-4 h-[84px] rounded-[2px] border"
              style={{ backgroundColor: preview }}
              aria-hidden
            />
            <div className="mb-4">
              <div className="flex items-center gap-[9px]">
                <span className="text-text-3 font-mono text-[10px] tracking-[0.12em] uppercase">
                  HEX
                </span>
                <input
                  type="text"
                  value={picker.hexInput}
                  onChange={(e) => setPickerHex(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={7}
                  aria-label="HEX 値"
                  aria-invalid={hexInvalid}
                  aria-describedby={hexInvalid ? "hex-error" : undefined}
                  className="border-border-strong bg-bg flex-1 rounded-[2px] border px-[11px] py-2 font-mono text-[15px] tracking-[0.02em] aria-invalid:border-(--text)"
                />
              </div>
              {hexInvalid ? (
                <p
                  id="hex-error"
                  role="status"
                  className="text-text-2 mt-1.5 pl-[37px] font-mono text-[10px]"
                >
                  #RRGGBB 形式（6桁の16進数）で入力してください
                </p>
              ) : null}
            </div>

            <div className="mb-5 flex flex-col gap-3.5">
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

            <div className="flex items-center gap-[9px]">
              {!picker.isNew && picker.targetId ? (
                <button
                  type="button"
                  onClick={() => {
                    apply({ kind: "remove", id: picker.targetId! });
                    closePicker();
                  }}
                  className="border-border-strong text-text-2 hover:bg-surface-2 hover:text-text rounded-[2px] border bg-transparent px-[13px] py-[9px] text-[12.5px]"
                >
                  削除
                </button>
              ) : null}
              <div className="flex-1" />
              <button
                type="button"
                onClick={closePicker}
                className="border-border-strong hover:bg-surface-2 rounded-[2px] border bg-transparent px-[15px] py-[9px] text-[12.5px]"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={commitPicker}
                className="rounded-[2px] border border-(--text) bg-(--text) px-[17px] py-[9px] text-[12.5px] font-semibold text-(--bg)"
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
