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
import { useT } from "@/lib/i18n/locale";

/**
 * スプラッシュ（v3: #FFF マーク版。public/logo/color-function_logo.svg 基準）。
 * 製図シート上で「#FFF」マーク（# = HEX 記法 / FF = Follows Function）が
 * 段階的に作図される演出:
 *   GRID ▸ GUIDES ▸ STROKE-ON(斜線→バー) ▸ DIMENSIONS(カウントアップ) ▸ CALLOUTS ▸ TAGLINE
 * - セッション初回のみ（sessionStorage）。表示判定はペイント前スクリプト（data-splash）。
 * - クリック / Esc / SKIP でいつでもスキップ。prefers-reduced-motion では表示しない。
 */

const TOTAL_MS = 6000; // 演出 ~5.2s + ホールド
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

// フェーズ開始時刻（秒）
const T = {
  grid: 0,
  guides: 0.5,
  stroke: 1.0, // 斜線5本を 0.18s 間隔で下からワイプ
  bars: 2.1, // 横バー2本を左からワイプ
  sweep: 2.8, // ベースラインのアクセントスイープ
  dims: 2.95,
  callouts: 3.6,
  tagline: 4.05,
} as const;

// #FFF マークのパス（public/logo/color-function_logo.svg・viewBox 300×300）
const DIAGONALS = [
  "M124.9 57.4478H144.815L52.315 242.448H32.3999L124.9 57.4478Z",
  "M155.69 57.4478H175.605L83.1048 242.448H63.1897L155.69 57.4478Z",
  "M186.349 57.4478H206.264L113.763 242.448H93.8484L186.349 57.4478Z",
  "M217.007 57.4478H236.923L144.422 242.448H124.507L217.007 57.4478Z",
  "M247.666 57.4478H267.581L175.081 242.448H155.166L247.666 57.4478Z",
];
const BARS = [
  "M87.6905 120.075H243.867L237.447 133.177H81.2705L87.6905 120.075Z", // 上バー（長）
  "M65.1551 166.457H127.652L121.232 179.559H58.7351L65.1551 166.457Z", // 下バー（短）
];

// シート(640×400)内のマーク配置。コンテンツは x202–438 / y107–292 に収まる
const MARK = { x: 170, y: 50, size: 300 } as const;

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
          fontSize: 9,
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

/** マークの1ストローク（クリップワイプで作図される）。 */
function MarkStroke({
  d,
  delay,
  wipe,
}: {
  d: string;
  delay: number;
  wipe: "up" | "right";
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        left: MARK.x,
        top: MARK.y,
        width: MARK.size,
        height: MARK.size,
      }}
      initial={{
        clipPath:
          wipe === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
      }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ delay, duration: wipe === "up" ? 0.45 : 0.35, ease: EASE }}
    >
      <svg viewBox="0 0 300 300" width="100%" height="100%">
        <path d={d} fill="var(--text)" />
      </svg>
    </motion.div>
  );
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
              {...{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0, duration: 1.2, ease: EASE },
              }}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 46%, color-mix(in srgb, var(--text) 4%, transparent), transparent 70%)",
              }}
            />

            {/* 図面ヘッダー（左上） */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: T.grid, duration: 0.5, ease: EASE }}
              className="absolute top-4 left-[18px] flex items-center gap-2.5"
            >
              <span className="text-accent text-meta font-mono tracking-[0.14em]">
                DWG. CFF-LOGO-02
              </span>
              <span className="bg-border-strong h-px w-[22px]" aria-hidden />
              <span className="text-text-3 text-meta font-mono tracking-[0.14em]">
                MARK “#FFF” · SCALE 1:1
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: T.grid, duration: 0.5, ease: EASE }}
                  className="border-border absolute inset-0 border"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: T.grid, duration: 0.5, ease: EASE }}
                >
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
                  className="absolute top-[107px] right-[60px] left-[70px] origin-left border-t border-dashed border-(--text-3)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: T.guides, duration: 0.55, ease: EASE }}
                />
                <motion.div
                  className="absolute top-[292px] right-[60px] left-[70px] origin-left border-t border-dashed border-(--text-3)"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: T.guides + 0.1,
                    duration: 0.55,
                    ease: EASE,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: T.guides + 0.35,
                    duration: 0.4,
                    ease: EASE,
                  }}
                >
                  <span className="text-text-2 text-meta absolute top-[99px] right-6 font-mono tracking-[0.08em]">
                    CAP LINE
                  </span>
                  <span className="text-text-2 text-meta absolute top-[296px] right-6 font-mono tracking-[0.08em]">
                    BASE LINE
                  </span>
                </motion.div>

                {/* ── P3: 作図補助（中心十字・目盛） ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: T.guides + 0.25,
                    duration: 0.55,
                    ease: EASE,
                  }}
                >
                  <span className="bg-accent absolute top-[200px] left-[320px] h-px w-[18px] -translate-x-1/2 -translate-y-1/2" />
                  <span className="bg-accent absolute top-[200px] left-[320px] h-[18px] w-px -translate-x-1/2 -translate-y-1/2" />
                  <Ticks />
                </motion.div>

                {/* ── STROKE-ON: 斜線5本（下からワイプ）→ 横バー2本（左からワイプ） ── */}
                {DIAGONALS.map((d, i) => (
                  <MarkStroke
                    key={`diag-${i}`}
                    d={d}
                    delay={T.stroke + i * 0.18}
                    wipe="up"
                  />
                ))}
                {BARS.map((d, i) => (
                  <MarkStroke
                    key={`bar-${i}`}
                    d={d}
                    delay={T.bars + i * 0.2}
                    wipe="right"
                  />
                ))}

                {/* プロッタヘッド（ストローク描画に合わせて掃引） */}
                <motion.div
                  className="bg-accent absolute top-[95px] h-[207px] w-0.5"
                  style={{ boxShadow: "0 0 12px 1px var(--accent)" }}
                  initial={{ left: 198, opacity: 0 }}
                  animate={{
                    left: [198, 260, 320, 380, 442],
                    opacity: [0, 1, 1, 1, 0],
                  }}
                  transition={{
                    delay: T.stroke,
                    duration: 1.5,
                    times: [0, 0.3, 0.55, 0.8, 1],
                    ease: EASE,
                  }}
                />

                {/* バー描画後のベースライン・アクセントスイープ */}
                <motion.div
                  className="bg-accent absolute top-[292px] left-[202px] h-0.5 w-[236px] origin-left"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
                  transition={{
                    delay: T.sweep,
                    duration: 1.0,
                    times: [0, 0.55, 1],
                    ease: EASE,
                  }}
                />

                {/* ── P4: 寸法（235・185 はカウントアップ） ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: T.dims, duration: 0.6, ease: EASE }}
                >
                  <div className="border-t-accent absolute top-[88px] left-[202px] w-[236px] border-t-[1.5px]" />
                  <span className="bg-accent absolute top-[82px] left-[202px] h-[13px] w-px rotate-45" />
                  <span className="bg-accent absolute top-[82px] left-[438px] h-[13px] w-px rotate-45" />
                  <span className="absolute top-[60px] left-[202px] h-7 w-px bg-(--text-3)" />
                  <span className="absolute top-[60px] left-[438px] h-7 w-px bg-(--text-3)" />
                  <span className="text-accent bg-surface text-meta absolute top-[74px] left-[320px] -translate-x-1/2 px-[5px] font-mono font-medium tabular-nums">
                    <CountUp to={235} delay={T.dims + 0.1} />
                  </span>

                  <div className="absolute top-[107px] left-[180px] h-[185px] border-l-[1.5px] border-(--text-2)" />
                  <span className="absolute top-[107px] left-[174px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[292px] left-[174px] h-px w-[13px] rotate-45 bg-(--text-2)" />
                  <span className="absolute top-[107px] left-[146px] h-px w-10 bg-(--text-3)" />
                  <span className="absolute top-[292px] left-[146px] h-px w-10 bg-(--text-3)" />
                  <span className="text-text-2 bg-surface text-meta absolute top-[200px] left-[180px] -translate-x-1/2 -translate-y-1/2 -rotate-90 px-[5px] font-mono tabular-nums">
                    <CountUp to={185} delay={T.dims + 0.2} />
                  </span>

                  {/* 斜線ピッチ（30.7 TYP.） */}
                  <div className="absolute top-[306px] left-[202px] w-[123px] border-t border-(--text-3)" />
                  {[202, 233, 264, 294, 325].map((x) => (
                    <span
                      key={x}
                      className="absolute top-[302px] h-[9px] w-px bg-(--text-3)"
                      style={{ left: x }}
                    />
                  ))}
                  <span className="text-text-2 text-meta absolute top-[310px] left-[263px] -translate-x-1/2 font-mono">
                    30.7 TYP.
                  </span>
                </motion.div>

                {/* ── P5: 引出線（マークの意味） ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: T.callouts, duration: 0.6, ease: EASE }}
                >
                  <div className="absolute top-[177px] left-[414px] w-[56px] border-t border-(--text-2)" />
                  <span className="bg-accent absolute top-[177px] left-[414px] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  <span className="text-text-2 text-meta absolute top-[170px] left-[476px] font-mono tracking-[0.04em]">
                    “#” = HEX
                  </span>
                  <div className="absolute top-[296px] left-[338px] w-[46px] origin-left rotate-[30deg] border-t border-(--text-2)" />
                  <span className="bg-accent absolute top-[296px] left-[338px] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  <span className="text-text-2 text-meta absolute top-[316px] left-[384px] font-mono tracking-[0.04em]">
                    “FF” = FOLLOWS FUNCTION
                  </span>
                </motion.div>

                {/* ── タグライン（ブランドの締め） ── */}
                <motion.div
                  className="absolute top-[352px] left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
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
              </div>
            </motion.div>

            {/* フッター: フェーズ表記＋SKIP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
              className="absolute right-[18px] bottom-4 left-[18px] flex items-center justify-between gap-4"
            >
              <span className="text-text-3 text-meta hidden font-mono tracking-[0.08em] sm:inline">
                PHASES — GRID ▸ GUIDES ▸ STROKE-ON ▸ DIMENSIONS ▸ CALLOUTS
              </span>
              <button
                type="button"
                onClick={dismiss}
                aria-label={t("splash.skip")}
                className="cff-control text-text-2 hover:text-text ml-auto px-3 py-[7px] font-mono text-[12px] tracking-[0.05em]"
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
