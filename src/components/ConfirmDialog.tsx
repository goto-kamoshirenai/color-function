"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { useColorStore } from "@/store/useColorStore";

/** 破壊的操作（全消去）の確認ダイアログ（v2: 左アクセント縁の360pxパネル）。 */
export function ConfirmDialog() {
  const open = useColorStore((s) => s.confirmOpen);
  const paletteCount = useColorStore((s) => s.palette.length);
  const cancelClear = useColorStore((s) => s.cancelClear);
  const clearAll = useColorStore((s) => s.clearAll);

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(o) => {
        if (!o) cancelClear();
      }}
      isDismissable
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-6"
    >
      <Modal className="border-border-strong border-l-accent bg-surface w-[360px] max-w-full rounded-[3px] border border-l-[3px] p-[22px] shadow-[0_24px_64px_rgba(0,0,0,0.32)]">
        <Dialog role="alertdialog" className="outline-none">
          <Heading slot="title" className="mb-2 text-[15px] font-bold">
            すべての色を消去しますか？
          </Heading>
          <p className="text-text-2 mb-5 text-[13px] leading-[1.55]">
            パレットの全 {paletteCount}{" "}
            色が削除されます。この操作は元に戻せません。
          </p>
          <div className="flex justify-end gap-[9px]">
            <button
              type="button"
              onClick={cancelClear}
              className="border-border-strong hover:bg-surface-2 rounded-[2px] border bg-transparent px-[15px] py-[9px] text-[12.5px]"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-[2px] border border-(--text) bg-(--text) px-[17px] py-[9px] text-[12.5px] font-semibold text-(--bg)"
            >
              消去する
            </button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
