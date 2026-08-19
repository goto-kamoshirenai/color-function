import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        // テスト自身とテスト用ユーティリティ
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/test/**",
        // ルート定義・メタデータ（振る舞いは e2e 側で検証する）
        "src/app/**",
        // 静的データ（内容の検証は assets.test.ts）
        "src/data/**",
      ],
      /*
       * 閾値は「現状を下回らないための床」。core/color（計算の芯）は
       * 高い水準を維持し、UI 層はカードの網羅を進めながら床を上げていく。
       */
      thresholds: {
        statements: 83,
        branches: 68,
        functions: 80,
        lines: 85,
        "src/core/**": {
          statements: 95,
          branches: 85,
          functions: 95,
          lines: 96,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
