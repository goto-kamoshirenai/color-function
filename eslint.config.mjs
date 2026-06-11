import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // コードベースを清潔に保つ追加ルール（コミット時に --fix で自動適用）
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // プロジェクト規約: any を禁止（CLAUDE.md / docs/08）
      "@typescript-eslint/no-explicit-any": "error",
      // 未使用は削除する（意図的なものは _ プレフィックス）
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 型だけの import は `import type` / `type` 修飾に統一
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      // 比較は厳密等価（null チェックの == null のみ許容）
      eqeqeq: ["error", "always", { null: "ignore" }],
      // アプリコードに console.log を残さない（warn/error は許容）
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prefer-const": "error",
    },
  },
]);

export default eslintConfig;
