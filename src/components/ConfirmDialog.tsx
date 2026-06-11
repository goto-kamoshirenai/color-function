"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { useColorStore } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** 破壊的操作（全消去）の確認ダイアログ（v2: 左アクセント縁の360pxパネル）。 */
export function ConfirmDialog() {
  const open = useColorStore((s) => s.confirmOpen);
  const paletteCount = useColorStore((s) => s.palette.length);
  const cancelClear = useColorStore((s) => s.cancelClear);
  const clearAll = useColorStore((s) => s.clearAll);
  const t = useT();

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(o) => {
        if (!o) cancelClear();
      }}
      isDismissable
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-6"
    >
      <Modal className="border-border-strong border-l-accent bg-surface rounded-panel shadow-overlay w-[360px] max-w-full border border-l-[3px] p-[22px]">
        <Dialog role="alertdialog" className="outline-none">
          <Heading slot="title" className="mb-2 text-[15px] font-bold">
            {t("confirm.title")}
          </Heading>
          <p className="text-text-2 mb-5 text-[13px] leading-[1.55]">
            {t("confirm.body", { count: paletteCount })}
          </p>
          <div className="flex justify-end gap-[9px]">
            <button
              type="button"
              onClick={cancelClear}
              className="cff-control text-control px-[15px] py-[9px]"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="cff-control-primary text-control px-[17px] py-[9px] font-semibold"
            >
              {t("confirm.ok")}
            </button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
