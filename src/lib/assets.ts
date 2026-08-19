import { z } from "zod";
import cssNamesJson from "../../public/data/names/css.json";
import waNamesJson from "../../public/data/names/wa.json";
import harmonyRulesJson from "../../public/data/harmony/rules.json";
import type { ColorNameEntry } from "@/core/color";

/*
 * 静的データ資産（docs/06 §1）はビルドに同梱する。
 * 合計 6KB 程度で、マニフェスト→各アセットの多段 fetch はウォーターフォールと
 * 「読み込み中」状態を生むだけだった。public/data には SW のプリキャッシュ対象
 * および外部から参照できる資産の正本として引き続き置き、ここから直接読む。
 */

/** 色名辞書アセットのスキーマ（docs/06 §2）。 */
const ColorNameEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  reading: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  meaning: z.string().optional(),
});

const NamesAssetSchema = z.object({
  schemaVersion: z.string(),
  version: z.string(),
  kind: z.literal("names"),
  source: z.string().optional(),
  data: z.object({
    system: z.string(),
    locale: z.string(),
    colors: z.array(ColorNameEntrySchema),
  }),
});

/** 調和ルールアセットのスキーマ（docs/06 §4.1）。 */
const HarmonyRulesSchema = z.object({
  schemaVersion: z.string(),
  version: z.string(),
  kind: z.literal("harmony-rules"),
  source: z.string().optional(),
  data: z.object({
    rules: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        sub: z.string().optional(),
        hueOffsets: z.array(z.number()),
      }),
    ),
  }),
});

export type HarmonyRule = z.infer<
  typeof HarmonyRulesSchema
>["data"]["rules"][number];

/** 名前辞書アセット(JSON)を検証して name/hex の配列に変換。不正なら例外。 */
export function parseNamesAsset(json: unknown): ColorNameEntry[] {
  const parsed = NamesAssetSchema.parse(json);
  return parsed.data.colors.map((c) => ({ name: c.name, hex: c.hex }));
}

/** 調和ルールアセット(JSON)を検証してルール配列に変換。不正なら例外。 */
export function parseHarmonyRulesAsset(json: unknown): HarmonyRule[] {
  return HarmonyRulesSchema.parse(json).data.rules;
}

/** 色名辞書（ビルド同梱・検証済み）。 */
export const COLOR_NAMES: ColorNameEntry[] = [
  ...parseNamesAsset(cssNamesJson),
  ...parseNamesAsset(waNamesJson),
];

/** 調和ルール（ビルド同梱・検証済み）。 */
export const HARMONY_RULES: HarmonyRule[] =
  parseHarmonyRulesAsset(harmonyRulesJson);
