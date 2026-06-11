"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { Xmark } from "iconoir-react";
import { useColorStore } from "@/store/useColorStore";
import { hsvToRgb, toHex, parseHex } from "@/core/color";
import { useT } from "@/lib/i18n/locale";

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
        <span className="text-text-2 font-mono text-[12px]">{label}</span>
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
  const t = useT();

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
      <Modal className="border-border-strong bg-surface rounded-panel shadow-overlay w-[380px] max-w-full overflow-hidden border">
        <Dialog className="outline-none">
          <div className="border-border flex items-center justify-between border-b px-[18px] py-3.5">
            <div className="flex items-baseline gap-[9px]">
              <span className="text-accent text-meta font-mono tracking-[0.1em]">
                ●
              </span>
              <Heading slot="title" className="text-sm font-bold">
                {picker.isNew ? t("picker.addTitle") : t("picker.editTitle")}
              </Heading>
            </div>
            <button
              type="button"
              onClick={closePicker}
              aria-label={t("common.close")}
              className="cff-control text-text-2 flex size-[26px] items-center justify-center"
            >
              <Xmark width={14} height={14} aria-hidden />
            </button>
          </div>

          <div className="p-[18px]">
            <div
              className="border-border-strong rounded-control mb-4 h-[84px] border"
              style={{ backgroundColor: preview }}
              aria-hidden
            />
            <div className="mb-4">
              <div className="flex items-center gap-[9px]">
                <span className="text-text-3 text-meta font-mono tracking-[0.12em] uppercase">
                  HEX
                </span>
                <input
                  type="text"
                  value={picker.hexInput}
                  onChange={(e) => setPickerHex(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  maxLength={7}
                  aria-label={t("picker.hex")}
                  aria-invalid={hexInvalid}
                  aria-describedby={hexInvalid ? "hex-error" : undefined}
                  className="border-border-strong bg-bg rounded-control flex-1 border px-[11px] py-2 font-mono text-[15px] tracking-[0.02em] aria-invalid:border-(--text)"
                />
              </div>
              {hexInvalid ? (
                <p
                  id="hex-error"
                  role="status"
                  className="text-text-2 text-meta mt-1.5 pl-[37px] font-mono"
                >
                  {t("picker.hexError")}
                </p>
              ) : null}
            </div>

            <div className="mb-5 flex flex-col gap-3.5">
              <Slider
                label={t("picker.hue")}
                value={picker.h}
                max={360}
                unit="°"
                onChange={(h) => setPickerHsv({ h })}
              />
              <Slider
                label={t("picker.sat")}
                value={picker.s}
                max={100}
                unit="%"
                onChange={(s) => setPickerHsv({ s })}
              />
              <Slider
                label={t("picker.val")}
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
                  className="cff-control text-text-2 hover:text-text text-control px-[13px] py-[9px]"
                >
                  {t("common.delete")}
                </button>
              ) : null}
              <div className="flex-1" />
              <button
                type="button"
                onClick={closePicker}
                className="cff-control text-control px-[15px] py-[9px]"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={commitPicker}
                className="cff-control-primary text-control px-[17px] py-[9px] font-semibold"
              >
                {picker.isNew ? t("picker.add") : t("picker.apply")}
              </button>
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
