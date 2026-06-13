"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Xmark } from "iconoir-react";
import { useT } from "@/lib/i18n/locale";

const KEY = "cff-onboarded";
const PALETTE_SELECTOR = '[data-coach-target="palette"]';

/** 初回判定（localStorage が真実の源。未設定でのみ表示。不可環境では出さない）。 */
function isOnboarded(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true;
  }
}

/** スプラッシュ表示中か（ペイント前スクリプトが立てる data-splash）。 */
function splashPending(): boolean {
  try {
    return document.documentElement.dataset.splash === "1";
  } catch {
    return false;
  }
}

/**
 * 初回のみ配色パレット（PaletteBar）への導線を出すコーチマーク。
 * - localStorage `cff-onboarded` が未設定のときだけ表示（SSR では出さずチラつき防止）。
 * - スプラッシュ終了後（cff-splash-done）に出す。スプラッシュが無ければ即時。
 * - 閉じる、またはパレットバーへの操作で消し、そのとき初回フラグを保存。
 * - メイン（/）のみ。reduced-motion でも表示するが脈動はしない。
 */
export function FirstRunHint() {
  const pathname = usePathname();
  const t = useT();
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);
  const [barH, setBarH] = useState(0);
  const dismissed = useRef(false);

  // 表示判定（クライアントのみ）。スプラッシュ後に出す。
  useEffect(() => {
    if (pathname !== "/" || isOnboarded()) return;
    const reveal = () => setShow(true);
    if (!splashPending()) {
      // 同期 setState を避けて次フレームで表示
      const id = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(id);
    }
    window.addEventListener("cff-splash-done", reveal);
    return () => window.removeEventListener("cff-splash-done", reveal);
  }, [pathname]);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // 保存不可環境は無視
    }
    setShow(false);
  };

  // パレットバーの高さに合わせて配置し、バーを強調。バー操作で消す。
  useEffect(() => {
    if (!show) return;
    const bar = document.querySelector<HTMLElement>(PALETTE_SELECTOR);
    if (!bar) return;
    const update = () => setBarH(bar.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(bar);
    window.addEventListener("resize", update);
    bar.setAttribute("data-coach-active", "1");
    const onPointer = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(PALETTE_SELECTOR)) dismiss();
    };
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      document.removeEventListener("pointerdown", onPointer, true);
      bar.removeAttribute("data-coach-active");
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="coach"
          role="status"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-[22px] z-30 max-w-[min(280px,calc(100vw-44px))]"
          style={{ bottom: barH + 12 }}
        >
          <div className="border-accent bg-surface rounded-panel shadow-overlay relative border px-4 py-3">
            <button
              type="button"
              onClick={dismiss}
              aria-label={t("coach.dismiss")}
              className="cff-control text-text-3 hover:text-text absolute top-1.5 right-1.5 flex size-6 items-center justify-center"
            >
              <Xmark width={13} height={13} aria-hidden />
            </button>
            <div className="flex items-center gap-2 pr-5">
              <span className="text-accent text-meta font-mono" aria-hidden>
                ↓
              </span>
              <p className="text-[13px] font-bold">{t("coach.title")}</p>
            </div>
            <p className="text-text-2 mt-1 text-[12px] leading-[1.5]">
              {t("coach.body")}
            </p>
            {/* 下向きの矢（パレットバーを指す） */}
            <span
              aria-hidden
              className="border-accent bg-surface absolute -bottom-[6px] left-6 size-3 rotate-45 border-r border-b"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
