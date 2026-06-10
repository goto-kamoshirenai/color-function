"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * スプラッシュ（モック: CFF Wordmark Drafting.html）。
 * 製図シート上で CFF ワードマークが段階的に作図される演出:
 *   GRID ▸ GUIDES ▸ CONSTRUCTION ▸ STROKE-ON ▸ DIMENSIONS ▸ TITLE BLOCK（約5.6s）
 * - セッション初回のみ（sessionStorage）。表示判定はペイント前スクリプト（data-splash）。
 * - クリック / Esc / SKIP でいつでもスキップ。prefers-reduced-motion では表示しない。
 */

const TOTAL_MS = 6200; // 演出 ~5.6s + ホールド
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// フェーズ開始時刻（秒）— モックのキーフレーム比率を踏襲
const T = {
  grid: 0,
  guides: 0.6,
  construction: 1.15,
  stroke: 1.7,
  fill: 2.8,
  dims: 3.6,
  callouts: 4.4,
} as const;

const fade = (delay: number, duration = 0.5) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration, ease: EASE },
});

const mono = "var(--font-geist-mono), monospace";

function Ticks() {
  const ticks = [];
  for (let x = 160; x <= 480; x += 40) {
    ticks.push(
      <span
        key={`t${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 64,
          width: 1,
          height: x % 80 === 0 ? 14 : 8,
          background: "var(--text-3)",
        }}
      />,
      <span
        key={`l${x}`}
        style={{
          position: "absolute",
          left: x,
          top: 46,
          fontFamily: mono,
          fontSize: 7.5,
          color: "var(--text-3)",
          transform: "translateX(-50%)",
        }}
      >
        {x - 160}
      </span>,
    );
  }
  return <>{ticks}</>;
}

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
  const [scale, setScale] = useState(1);
  const reducedMotion = useReducedMotion();
  const done = useRef(false);

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

  // 640×400 のシートをビューポートに収める
  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          1,
          (window.innerWidth - 48) / 640,
          (window.innerHeight - 140) / 400,
        ),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
            aria-label="起動アニメーション（クリックでスキップ）"
            onClick={dismiss}
            exit={{
              opacity: 0,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
            className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center"
            style={{
              background:
                "linear-gradient(var(--grid) 1px,transparent 1px) 0 0/40px 40px," +
                "linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/40px 40px," +
                "var(--surface)",
            }}
          >
            {/* 図面ヘッダー（左上） */}
            <motion.div
              {...fade(T.grid, 0.5)}
              className="absolute top-4 left-[18px] flex items-center gap-2.5"
            >
              <span className="text-accent font-mono text-[10px] tracking-[0.14em]">
                DWG. CFF-LOGO-01
              </span>
              <span className="bg-border-strong h-px w-[22px]" aria-hidden />
              <span className="text-text-3 font-mono text-[10px] tracking-[0.14em]">
                SCALE 1:1 · UNIT px
              </span>
            </motion.div>

            {/* シート本体 640×400 */}
            <div style={{ transform: `scale(${scale})` }}>
              <div className="relative" style={{ width: 640, height: 400 }}>
                {/* ── P1: 外枠＋レジストレーション十字 ── */}
                <motion.div
                  {...fade(T.grid, 0.5)}
                  className="border-border absolute inset-0 border"
                />
                <motion.div {...fade(T.grid, 0.5)}>
                  {(
                    [
                      [
                        { left: 14, top: 14 },
                        { left: 20, top: 8 },
                      ],
                      [
                        { right: 14, top: 14 },
                        { right: 20, top: 8 },
                      ],
                      [
                        { left: 14, bottom: 14 },
                        { left: 20, bottom: 8 },
                      ],
                      [
                        { right: 14, bottom: 14 },
                        { right: 20, bottom: 8 },
                      ],
                    ] as const
                  ).map(([h, v], i) => (
                    <span key={i}>
                      <span
                        style={{
                          position: "absolute",
                          width: 14,
                          height: 1,
                          background: "var(--text-3)",
                          ...h,
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          width: 1,
                          height: 14,
                          background: "var(--text-3)",
                          ...v,
                        }}
                      />
                    </span>
                  ))}
                </motion.div>

                {/* ── P2: ガイド（CAP/BASE 破線・縦モジュール） ── */}
                <motion.div {...fade(T.guides, 0.5)}>
                  <div className="absolute top-[116px] right-[60px] left-[70px] border-t border-dashed border-(--text-3)" />
                  <div className="absolute top-[284px] right-[60px] left-[70px] border-t border-dashed border-(--text-3)" />
                  <span className="text-text-2 absolute top-[108px] right-6 font-mono text-[9px] tracking-[0.08em]">
                    CAP LINE
                  </span>
                  <span className="text-text-2 absolute top-[288px] right-6 font-mono text-[9px] tracking-[0.08em]">
                    BASE LINE
                  </span>
                  <div className="absolute top-[60px] bottom-[84px] left-[160px] border-l border-dashed border-(--grid)" />
                  <div className="absolute top-[60px] bottom-[84px] left-[478px] border-l border-dashed border-(--grid)" />
                </motion.div>

                {/* ── P3: 作図補助（中心十字・C ボウル円・目盛） ── */}
                <motion.div {...fade(T.construction, 0.55)}>
                  <span className="bg-accent absolute top-[200px] left-[320px] h-px w-[18px] -translate-x-1/2 -translate-y-1/2" />
                  <span className="bg-accent absolute top-[200px] left-[320px] h-[18px] w-px -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-[114px] left-[142px] size-[172px] rounded-full border border-dashed border-(--text-3) opacity-70" />
                  <span className="border-accent absolute top-[200px] left-[228px] size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
                  <Ticks />
                </motion.div>

                {/* ── STROKE-ON: 輪郭ワイプ → 塗りワイプ ── */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative h-[172px] leading-none font-black tracking-[-0.05em]"
                    style={{ fontSize: 172 }}
                  >
                    <motion.span
                      className="relative block text-transparent"
                      style={{ WebkitTextStroke: "1.6px var(--text)" }}
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{
                        delay: T.stroke,
                        duration: 1.15,
                        ease: EASE,
                      }}
                    >
                      CFF
                    </motion.span>
                    <motion.span
                      className="absolute top-0 left-0 text-(--text)"
                      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                      transition={{
                        delay: T.fill,
                        duration: 0.85,
                        ease: EASE,
                        opacity: { delay: T.fill, duration: 0.01 },
                      }}
                    >
                      CFF
                    </motion.span>
                  </div>
                </div>

                {/* プロッタヘッド（アクセント縦線の掃引） */}
                <motion.div
                  className="bg-accent absolute top-[104px] h-[192px] w-0.5"
                  initial={{ left: 158, opacity: 0 }}
                  animate={{
                    left: [158, 158, 482, 482],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    delay: T.stroke,
                    duration: 1.3,
                    times: [0, 0.05, 0.92, 1],
                    ease: EASE,
                  }}
                />

                {/* ── P4: 寸法（全幅 318・キャップ高 168・字幅） ── */}
                <motion.div {...fade(T.dims, 0.6)}>
                  <div className="border-t-accent absolute top-[88px] left-[160px] w-[318px] border-t-[1.5px]" />
                  <span className="bg-accent absolute top-[82px] left-[160px] h-[13px] w-px rotate-45" />
                  <span className="bg-accent absolute top-[82px] left-[478px] h-[13px] w-px rotate-45" />
                  <span className="absolute top-[60px] left-[160px] h-7 w-px bg-(--text-3)" />
                  <span className="absolute top-[60px] left-[478px] h-7 w-px bg-(--text-3)" />
                  <span className="text-accent bg-surface absolute top-[74px] left-[319px] -translate-x-1/2 px-[5px] font-mono text-[10px] font-medium">
                    318
                  </span>

                  <div className="absolute top-[116px] left-[104px] h-[168px] border-l-[1.5px] border-(--text-2)" />
                  <span className="absolute top-[116px] left-[98px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[284px] left-[98px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[116px] left-[70px] h-px w-10 bg-(--text-3)" />
                  <span className="absolute top-[284px] left-[70px] h-px w-10 bg-(--text-3)" />
                  <span className="text-text-2 bg-surface absolute top-[200px] left-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-90 px-[5px] font-mono text-[10px]">
                    168
                  </span>

                  <div className="absolute top-[312px] left-[160px] w-[114px] border-t border-(--text-3)" />
                  <div className="absolute top-[312px] left-[282px] w-[90px] border-t border-(--text-3)" />
                  <div className="absolute top-[312px] left-[382px] w-24 border-t border-(--text-3)" />
                  <span className="text-text-2 absolute top-[316px] left-[217px] -translate-x-1/2 font-mono text-[9px]">
                    114
                  </span>
                  <span className="text-text-2 absolute top-[316px] left-[327px] -translate-x-1/2 font-mono text-[9px]">
                    90
                  </span>
                  <span className="text-text-2 absolute top-[316px] left-[430px] -translate-x-1/2 font-mono text-[9px]">
                    96
                  </span>
                  {[160, 274, 372, 478].map((x) => (
                    <span
                      key={x}
                      className="absolute top-[308px] h-[9px] w-px bg-(--text-3)"
                      style={{ left: x }}
                    />
                  ))}
                </motion.div>

                {/* ── P5: 引出線＋タイトルブロック ── */}
                <motion.div {...fade(T.callouts, 0.6)}>
                  <div className="absolute top-[200px] left-[454px] w-[74px] border-t border-(--text-2)" />
                  <span className="bg-accent absolute top-[197px] left-[454px] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  <span className="text-text-2 absolute top-[192px] left-[530px] font-mono text-[9px] tracking-[0.04em]">
                    STEM t=28
                  </span>
                  <div className="absolute top-[150px] left-[150px] w-[84px] origin-right -rotate-[32deg] border-t border-(--text-2)" />
                  <span className="text-text-2 absolute top-[120px] left-24 font-mono text-[9px]">
                    R 86
                  </span>
                  <div className="absolute top-[250px] left-[236px] w-[54px] origin-left rotate-[34deg] border-t border-(--text-2)" />
                  <span className="text-text-2 absolute top-[268px] left-[286px] font-mono text-[9px]">
                    TERMINAL
                  </span>

                  {/* タイトルブロック */}
                  <div className="border-border-strong bg-surface absolute right-[18px] bottom-[18px] w-[196px] border font-mono">
                    <div className="border-border bg-surface-2 flex items-center justify-between border-b px-[9px] py-[5px]">
                      <span className="font-sans text-[11px] font-semibold tracking-[-0.01em]">
                        CFF WORDMARK
                      </span>
                      <span
                        className="border-accent size-[9px] rotate-45 border-[1.5px]"
                        aria-hidden
                      />
                    </div>
                    <div className="border-border flex border-b">
                      <div className="border-border flex-1 border-r px-[9px] py-1">
                        <span className="text-text-3 text-[7px] tracking-[0.1em]">
                          SHEET
                        </span>
                        <div className="text-[10px]">01 / 01</div>
                      </div>
                      <div className="flex-1 px-[9px] py-1">
                        <span className="text-text-3 text-[7px] tracking-[0.1em]">
                          SCALE
                        </span>
                        <div className="text-[10px]">1 : 1</div>
                      </div>
                    </div>
                    <div className="border-border flex border-b">
                      <div className="border-border flex-1 border-r px-[9px] py-1">
                        <span className="text-text-3 text-[7px] tracking-[0.1em]">
                          UNIT
                        </span>
                        <div className="text-[10px]">px</div>
                      </div>
                      <div className="flex-1 px-[9px] py-1">
                        <span className="text-text-3 text-[7px] tracking-[0.1em]">
                          REV
                        </span>
                        <div className="text-[10px]">2.4</div>
                      </div>
                    </div>
                    <div className="px-[9px] py-[5px]">
                      <span className="text-text-2 text-[8px] tracking-[0.12em]">
                        FORM FOLLOWS FUNCTION
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* フッター: フェーズ表記＋SKIP */}
            <motion.div
              {...fade(0.2, 0.5)}
              className="absolute right-[18px] bottom-4 left-[18px] flex items-center justify-between gap-4"
            >
              <span className="text-text-3 hidden font-mono text-[9.5px] tracking-[0.08em] sm:inline">
                PHASES — GRID ▸ GUIDES ▸ CONSTRUCTION ▸ STROKE-ON ▸ DIMENSIONS ▸
                TITLE BLOCK
              </span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="起動アニメーションをスキップ"
                className="border-border-strong text-text-2 hover:bg-surface-2 hover:text-text ml-auto rounded-[2px] border bg-transparent px-3 py-[7px] font-mono text-[11px] tracking-[0.05em]"
              >
                SKIP ▸
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
