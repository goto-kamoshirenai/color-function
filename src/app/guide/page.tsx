import type { Metadata } from "next";
import { GuideContent } from "@/features/guide/GuideContent";

export const metadata: Metadata = {
  title: "使い方 — Color Follows Function",
  description:
    "色を入れて、単位（単色/ペア/パレット）×観点（検証/設計）で診断し、デザイントークン・共有リンク・AI 用 Markdown として持ち出すまでの手順を、実際の画面写真つきで解説する。",
};

export default function GuidePage() {
  return <GuideContent />;
}
