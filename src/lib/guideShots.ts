import { z } from "zod";
import raw from "@/data/guideShots.json";

/**
 * 使い方ページの画面写真の寸法（scripts/generate-guide-shots.mjs が生成）。
 *
 * 画像そのものは public/guide/<id>-<theme>.png。ここが持つのは CSS ピクセルの
 * 寸法だけで、img に width/height を渡してレイアウトシフトを防ぐために使う。
 * 撮り直せば寸法も一緒に更新されるので、手で直す場所は無い。
 */
const GuideShotsSchema = z.object({
  schemaVersion: z.string(),
  shots: z.record(
    z.string(),
    z.object({ width: z.int().positive(), height: z.int().positive() }),
  ),
});

export type GuideShotSize = { width: number; height: number };

const data = GuideShotsSchema.parse(raw);

/** 画面写真の寸法（未生成の id は undefined）。 */
export function guideShotSize(id: string): GuideShotSize | undefined {
  return data.shots[id];
}
