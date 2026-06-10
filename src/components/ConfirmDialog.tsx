"use client";

import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { useColorStore } from "@/store/useColorStore";

/** 破壊的操作（全消去）の確認ダイアログ（docs/03 §6 / docs/10 §5）。 */
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <Modal className="border-border bg-surface w-full max-w-sm rounded-2xl border p-5 shadow-xl">
        <Dialog role="alertdialog" className="outline-none">
          <Heading slot="title" className="text-text text-sm font-semibold">
            すべての色を消去しますか？
          </Heading>
          <p className="text-text-2 mt-2 text-xs">
            パレットの全 {paletteCount}{" "}
            色が削除されます。この操作は元に戻せません。
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelClear}
              className="border-border text-text-2 hover:text-text rounded-md border px-3 py-1.5 text-xs"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="bg-text text-bg rounded-md px-3 py-1.5 text-xs font-medium"
            >
              消去する
            </button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
