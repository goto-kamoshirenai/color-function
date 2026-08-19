import type { Metadata } from "next";
import { LibraryContent } from "@/features/library/LibraryContent";

export const metadata: Metadata = {
  title: "図書館 — Color Follows Function",
  description:
    "色を体系的に学ぶための書籍を、コントラスト比・色覚・調和スキームなど本ツールの指標と対応づけて並べた蔵書リスト。",
};

export default function LibraryPage() {
  return <LibraryContent />;
}
