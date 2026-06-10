"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";

/**
 * スプラッシュ（モック: CFF Wordmark Drafting.html ベースのリッチ版）。
 * 製図シート上で CFF ワードマークが段階的に作図される演出:
 *   GRID ▸ GUIDES ▸ CONSTRUCTION ▸ STROKE-ON(文字ごと) ▸ DIMENSIONS(カウントアップ) ▸ CALLOUTS ▸ TAGLINE
 * - セッション初回のみ（sessionStorage）。表示判定はペイント前スクリプト（data-splash）。
 * - クリック / Esc / SKIP でいつでもスキップ。prefers-reduced-motion では表示しない。
 */

const TOTAL_MS = 6600; // 演出 ~5.8s + ホールド
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// フェーズ開始時刻（秒）
const T = {
  grid: 0,
  guides: 0.55,
  construction: 1.1,
  stroke: 1.7, // C → F → F を 0.45s 間隔でステップ描画
  fill: 3.1,
  sweep: 3.95, // ベースラインのアクセントスイープ
  dims: 3.95,
  callouts: 4.55,
  tagline: 4.9,
} as const;

const LETTERS = ["C", "F", "F"] as const;
const LETTER_DELAYS = [T.stroke, T.stroke + 0.45, T.stroke + 0.9];

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

/** 寸法値のカウントアップ表示。 */
function CountUp({ to, delay }: { to: number; delay: number }) {
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => String(Math.round(v)));
  useEffect(() => {
    const controls = animate(value, to, {
      delay,
      duration: 0.8,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, to, delay]);
  return <motion.span>{text}</motion.span>;
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
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            className="bg-surface fixed inset-0 z-[100] flex cursor-pointer items-center justify-center"
          >
            {/* ごく淡いスポットライト（奥行き） */}
            <motion.div
              {...fade(0, 1.2)}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 46%, color-mix(in srgb, var(--text) 4%, transparent), transparent 70%)",
              }}
            />

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

            {/* シート本体 640×400（ブラー＋スケール入場、退場は微ズーム） */}
            <motion.div
              initial={{ opacity: 0, scale: 0.965, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.02, filter: "blur(5px)" }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div
                className="relative"
                style={{
                  width: 640,
                  height: 400,
                  transform: `scale(${scale})`,
                }}
              >
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

                {/* ── P2: ガイド（CAP/BASE は左から線が伸びる） ── */}
                <motion.div
                  className="absolute top-[116px] right-[60px] left-[70px] origin-left border-t border-dashed border-(--text-3)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: T.guides, duration: 0.55, ease: EASE }}
                />
                <motion.div
                  className="absolute top-[284px] right-[60px] left-[70px] origin-left border-t border-dashed border-(--text-3)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: T.guides + 0.1,
                    duration: 0.55,
                    ease: EASE,
                  }}
                />
                <motion.div {...fade(T.guides + 0.35, 0.4)}>
                  <span className="text-text-2 absolute top-[108px] right-6 font-mono text-[9px] tracking-[0.08em]">
                    CAP LINE
                  </span>
                  <span className="text-text-2 absolute top-[288px] right-6 font-mono text-[9px] tracking-[0.08em]">
                    BASE LINE
                  </span>
                </motion.div>

                {/* ── P3: 作図補助（中心十字・C ボウル円・目盛） ── */}
                <motion.div {...fade(T.construction, 0.55)}>
                  <span className="bg-accent absolute top-[200px] left-[320px] h-px w-[18px] -translate-x-1/2 -translate-y-1/2" />
                  <span className="bg-accent absolute top-[200px] left-[320px] h-[18px] w-px -translate-x-1/2 -translate-y-1/2" />
                  <span className="border-accent absolute top-[200px] left-[228px] size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
                  <Ticks />
                </motion.div>
                <motion.div
                  className="absolute top-[114px] left-[142px] size-[172px] rounded-full border border-dashed border-(--text-3)"
                  initial={{ opacity: 0, scale: 0.85, rotate: -40 }}
                  animate={{ opacity: 0.7, scale: 1, rotate: 0 }}
                  transition={{
                    delay: T.construction + 0.1,
                    duration: 0.6,
                    ease: EASE,
                  }}
                />

                {/* ── STROKE-ON: 文字ごとの輪郭ワイプ（C → F → F） ── */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative flex h-[172px] leading-none font-black tracking-[-0.05em]"
                    style={{ fontSize: 172 }}
                  >
                    {LETTERS.map((ch, i) => (
                      <motion.span
                        key={`stroke-${i}`}
                        className="relative inline-block text-transparent"
                        style={{ WebkitTextStroke: "1.6px var(--text)" }}
                        initial={{
                          clipPath: "inset(-10% 100% -10% 0)",
                          y: 10,
                          filter: "blur(3px)",
                        }}
                        animate={{
                          clipPath: "inset(-10% 0% -10% 0)",
                          y: 0,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          delay: LETTER_DELAYS[i],
                          duration: 0.42,
                          ease: EASE,
                        }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                    {/* 塗りレイヤ（同じ3スパン構造でワイプ） */}
                    <div className="absolute top-0 left-0 flex">
                      {LETTERS.map((ch, i) => (
                        <motion.span
                          key={`fill-${i}`}
                          className="inline-block text-(--text)"
                          initial={{
                            clipPath: "inset(-10% 100% -10% 0)",
                            opacity: 0,
                          }}
                          animate={{
                            clipPath: "inset(-10% 0% -10% 0)",
                            opacity: 1,
                          }}
                          transition={{
                            delay: T.fill + i * 0.16,
                            duration: 0.5,
                            ease: EASE,
                            opacity: {
                              delay: T.fill + i * 0.16,
                              duration: 0.01,
                            },
                          }}
                        >
                          {ch}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* プロッタヘッド（文字境界で停留しながら掃引） */}
                <motion.div
                  className="bg-accent absolute top-[104px] h-[192px] w-0.5"
                  style={{ boxShadow: "0 0 12px 1px var(--accent)" }}
                  initial={{ left: 158, opacity: 0 }}
                  animate={{
                    left: [158, 276, 276, 374, 374, 480, 480],
                    opacity: [0, 1, 1, 1, 1, 1, 0],
                  }}
                  transition={{
                    delay: T.stroke,
                    duration: 1.55,
                    times: [0, 0.26, 0.3, 0.55, 0.6, 0.92, 1],
                    ease: EASE,
                  }}
                />

                {/* 塗り完了後のベースライン・アクセントスイープ */}
                <motion.div
                  className="bg-accent absolute top-[290px] left-[160px] h-0.5 w-[318px] origin-left"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
                  transition={{
                    delay: T.sweep,
                    duration: 1.0,
                    times: [0, 0.55, 1],
                    ease: EASE,
                  }}
                />

                {/* ── P4: 寸法（318・168 はカウントアップ） ── */}
                <motion.div {...fade(T.dims, 0.6)}>
                  <div className="border-t-accent absolute top-[88px] left-[160px] w-[318px] border-t-[1.5px]" />
                  <span className="bg-accent absolute top-[82px] left-[160px] h-[13px] w-px rotate-45" />
                  <span className="bg-accent absolute top-[82px] left-[478px] h-[13px] w-px rotate-45" />
                  <span className="absolute top-[60px] left-[160px] h-7 w-px bg-(--text-3)" />
                  <span className="absolute top-[60px] left-[478px] h-7 w-px bg-(--text-3)" />
                  <span className="text-accent bg-surface absolute top-[74px] left-[319px] -translate-x-1/2 px-[5px] font-mono text-[10px] font-medium tabular-nums">
                    <CountUp to={318} delay={T.dims + 0.1} />
                  </span>

                  <div className="absolute top-[116px] left-[104px] h-[168px] border-l-[1.5px] border-(--text-2)" />
                  <span className="absolute top-[116px] left-[98px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[284px] left-[98px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[116px] left-[70px] h-px w-10 bg-(--text-3)" />
                  <span className="absolute top-[284px] left-[70px] h-px w-10 bg-(--text-3)" />
                  <span className="text-text-2 bg-surface absolute top-[200px] left-[104px] -translate-x-1/2 -translate-y-1/2 -rotate-90 px-[5px] font-mono text-[10px] tabular-nums">
                    <CountUp to={168} delay={T.dims + 0.2} />
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

                {/* ── P5: 引出線 ── */}
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
                </motion.div>

                {/* ── タグライン（ブランドの締め） ── */}
                <motion.div
                  className="absolute top-[352px] left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: T.tagline, duration: 0.6, ease: EASE }}
                >
                  <span className="text-text-2 font-mono text-[10px] tracking-[0.32em] uppercase">
                    Color Follows Function
                  </span>
                  <span className="text-text-3 mx-2.5 font-mono text-[10px]">
                    ·
                  </span>
                  <span className="text-text-3 font-mono text-[10px] tracking-[0.18em]">
                    色彩定量解析
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* フッター: フェーズ表記＋SKIP */}
            <motion.div
              {...fade(0.2, 0.5)}
              className="absolute right-[18px] bottom-4 left-[18px] flex items-center justify-between gap-4"
            >
              <span className="text-text-3 hidden font-mono text-[9.5px] tracking-[0.08em] sm:inline">
                PHASES — GRID ▸ GUIDES ▸ CONSTRUCTION ▸ STROKE-ON ▸ DIMENSIONS ▸
                CALLOUTS
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
