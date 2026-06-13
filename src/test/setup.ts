import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion";
import { vi } from "vitest";

// テストではアニメーションを即時完了させる（AnimatePresence の exit 等を安定化）
MotionGlobalConfig.skipAnimations = true;

// ルーティング依存のコンポーネント（PaletteBar 等は Home 専用）を
// テストでは Home（/）として描画する。
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
