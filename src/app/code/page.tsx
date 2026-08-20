import type { Metadata } from "next";
import { CodeContent } from "@/features/code/CodeContent";

export const metadata: Metadata = {
  title: "実装 — Color Follows Function",
  description:
    "コントラスト比・色差 ΔE・APCA・色覚シミュレーションなどを自分のコードで計算するためのライブラリ集。指標ごとに culori・Color.js・apca-w3 などを対応づけて紹介する。",
};

export default function CodePage() {
  return <CodeContent />;
}
