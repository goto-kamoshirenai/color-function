import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion";

// テストではアニメーションを即時完了させる（AnimatePresence の exit 等を安定化）
MotionGlobalConfig.skipAnimations = true;
