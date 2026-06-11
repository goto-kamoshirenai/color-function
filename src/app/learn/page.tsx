import type { Metadata } from "next";
import { LearnContent } from "@/features/learn/LearnContent";

export const metadata: Metadata = {
  title: "学習コンテンツ — Color Follows Function",
  description:
    "色を定量的に扱うための背景知識（指標別リファレンス・記事・書籍）と、検証に使える外部ベンチツール集。",
};

export default function LearnPage() {
  return <LearnContent />;
}
