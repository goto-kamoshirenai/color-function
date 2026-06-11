"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useT } from "@/lib/i18n/locale";

/**
 * スプラッシュ（v4: #FFF マークの SVG 描画演出）。
 * public/logo/color-function_logo.svg のパスを motion の pathLength で
 * ストロークなぞり描き → 塗りフェード → マーク内をアクセントの光沢が掃引 → タグライン。
 * - セッション初回のみ（sessionStorage）。表示判定はペイント前スクリプト（data-splash）。
 * - クリック / Esc / SKIP でいつでもスキップ。prefers-reduced-motion では表示しない。
 */

const TOTAL_MS = 5200; // 演出 ~4.2s + ホールド
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// フェーズ開始時刻（秒）
const T = {
  draw: 0.25, // なぞり描き（0.12s 間隔）
  fill: 1.5, // 塗り（0.08s 間隔）
  sweep: 2.45, // マーク内の光沢スイープ
  tagline: 2.9,
} as const;

// #FFF マークのパス（public/logo/color-function_logo.svg・viewBox 300×300）。
// 描画順 = 斜線5本（左→右）→ 上バー → 下バー。
const MARK_PATHS = [
  "M124.9 57.4478H144.815L52.315 242.448H32.3999L124.9 57.4478Z",
  "M155.69 57.4478H175.605L83.1048 242.448H63.1897L155.69 57.4478Z",
  "M186.349 57.4478H206.264L113.763 242.448H93.8484L186.349 57.4478Z",
  "M217.007 57.4478H236.923L144.422 242.448H124.507L217.007 57.4478Z",
  "M247.666 57.4478H267.581L175.081 242.448H155.166L247.666 57.4478Z",
  "M87.6905 120.075H243.867L237.447 133.177H81.2705L87.6905 120.075Z",
  "M65.1551 166.457H127.652L121.232 179.559H58.7351L65.1551 166.457Z",
];

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

            {/* 本体: キャプション＋マーク＋タグライン */}
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.02, filter: "blur(5px)" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <motion.span
                className="text-accent text-meta mb-1 font-mono tracking-[0.2em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
              >
                MARK “#FFF”
              </motion.span>

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

              {/* タグライン */}
              <motion.div
                className="mt-4 text-center whitespace-nowrap"
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: T.tagline, duration: 0.6, ease: EASE }}
              >
                <span className="text-text-2 text-meta font-mono tracking-[0.32em] uppercase">
                  Color Follows Function
                </span>
                <span className="text-text-3 text-meta mx-2.5 font-mono">
                  ·
                </span>
                <span className="text-text-3 text-meta font-mono tracking-[0.18em]">
                  {t("app.tagline")}
                </span>
              </motion.div>
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
