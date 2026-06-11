"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useT } from "@/lib/i18n/locale";
import { MARK_PATHS } from "./BrandMark";

/**
 * スプラッシュ（v4: #FFF マークの SVG 描画演出）。
 * public/logo/color-function_logo.svg のパスを motion の pathLength で
 * ストロークなぞり描き → 塗りフェード → マーク内をアクセントの光沢が掃引。
 * - セッション初回のみ（sessionStorage）。表示判定はペイント前スクリプト（data-splash）。
 * - クリック / Esc / SKIP でいつでもスキップ。prefers-reduced-motion では表示しない。
 */

const TOTAL_MS = 4600; // 演出 ~3.4s + ホールド
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// フェーズ開始時刻（秒）
const T = {
  draw: 0.25, // なぞり描き（0.12s 間隔）
  fill: 1.5, // 塗り（0.08s 間隔）
  sweep: 2.45, // マーク内の光沢スイープ
} as const;

// #FFF マークのパスは BrandMark と共有（描画順 = 斜線5本（左→右）→ 上バー → 下バー）
const MARK_URL = "/logo/color-function_logo.svg";

// data-splash はペイント前スクリプトが設定する外部状態（変化通知は不要）
const emptySubscribe = () => () => {};
const getSplashFlag = () => document.documentElement.dataset.splash === "1";
const getSplashFlagServer = () => false;

export function SplashScreen() {
  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    getSplashFlag,
    getSplashFlagServer,
  );
  const [dismissed, setDismissed] = useState(false);
  const reducedMotion = useReducedMotion();
  const done = useRef(false);
  const t = useT();

  const visible = shouldShow && !dismissed && !reducedMotion;

  const dismiss = useCallback(() => {
    if (done.current) return;
    done.current = true;
    try {
      sessionStorage.setItem("cff-splash-shown", "1");
    } catch {
      // 保存不可環境は無視
    }
    setDismissed(true);
  }, []);

  // 万一モーション低減で attr が立っていた場合はプリカバーを畳む（setState は使わない）
  useEffect(() => {
    if (shouldShow && reducedMotion) {
      try {
        sessionStorage.setItem("cff-splash-shown", "1");
      } catch {
        // 無視
      }
      delete document.documentElement.dataset.splash;
    }
  }, [shouldShow, reducedMotion]);

  // 自動終了タイマー＋Esc スキップ
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, TOTAL_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, dismiss]);

  return (
    <>
      {/* React マウント前のカバー（CSS が data-splash で出し分け） */}
      <div className="cff-splash-precover" aria-hidden />

      <AnimatePresence
        onExitComplete={() => {
          delete document.documentElement.dataset.splash;
        }}
      >
        {visible ? (
          <motion.div
            key="splash"
            role="dialog"
            aria-label={t("splash.aria")}
            onClick={dismiss}
            exit={{
              opacity: 0,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className="bg-surface fixed inset-0 z-[100] flex cursor-pointer items-center justify-center"
          >
            {/* ごく淡いスポットライト（奥行き） */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: EASE }}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 46%, color-mix(in srgb, var(--text) 4%, transparent), transparent 70%)",
              }}
            />

            {/* 本体: マークのみ */}
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.02, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {/* マーク（なぞり描き → 塗り） */}
              <div className="relative size-64 sm:size-80" aria-hidden>
                <svg viewBox="0 0 300 300" width="100%" height="100%">
                  {MARK_PATHS.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      fill="var(--text)"
                      stroke="var(--text)"
                      strokeWidth={1.6}
                      initial={{
                        pathLength: 0,
                        fillOpacity: 0,
                        strokeOpacity: 1,
                      }}
                      animate={{
                        pathLength: 1,
                        fillOpacity: 1,
                        strokeOpacity: 0,
                      }}
                      transition={{
                        pathLength: {
                          delay: T.draw + i * 0.12,
                          duration: 0.7,
                          ease: "easeInOut",
                        },
                        fillOpacity: {
                          delay: T.fill + i * 0.08,
                          duration: 0.45,
                          ease: EASE,
                        },
                        strokeOpacity: {
                          delay: T.fill + i * 0.08 + 0.35,
                          duration: 0.3,
                          ease: EASE,
                        },
                      }}
                    />
                  ))}
                </svg>

                {/* マーク形状でマスクしたアクセントの光沢スイープ */}
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{
                    maskImage: `url(${MARK_URL})`,
                    WebkitMaskImage: `url(${MARK_URL})`,
                    maskSize: "100% 100%",
                    WebkitMaskSize: "100% 100%",
                  }}
                >
                  <motion.div
                    className="absolute top-[-20%] h-[140%] w-1/3"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent, color-mix(in srgb, var(--accent) 85%, transparent), transparent)",
                      filter: "blur(2px)",
                    }}
                    initial={{ left: "-40%" }}
                    animate={{ left: "115%" }}
                    transition={{ delay: T.sweep, duration: 0.9, ease: EASE }}
                  />
                </div>
              </div>
            </motion.div>

            {/* フッター: SKIP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              className="absolute right-[18px] bottom-4"
            >
              <button
                type="button"
                onClick={dismiss}
                aria-label={t("splash.skip")}
                className="cff-control text-text-2 hover:text-text px-3 py-[7px] font-mono text-[12px] tracking-[0.05em]"
              >
                SKIP ▸
              </button>
            </motion.div>

            {/* 進行プログレスバー（最下端・アクセント） */}
            <motion.div
              aria-hidden
              className="bg-accent absolute bottom-0 left-0 h-0.5 w-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
