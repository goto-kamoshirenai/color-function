import { z } from "zod";
import type { ColorNameEntry } from "@/core/color";

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

const ManifestSchema = z.object({
  schemaVersion: z.string(),
  assets: z.record(
    z.string(),
    z.object({
      path: z.string(),
      version: z.string(),
      lazy: z.boolean().optional(),
    }),
  ),
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

/** 調和ルールを読み込み（docs/06 §1）。失敗時は空配列。 */
export async function loadHarmonyRules(base = "/data"): Promise<HarmonyRule[]> {
  try {
    return parseHarmonyRulesAsset(
      await fetchJson(`${base}/harmony/rules.json`),
    );
  } catch {
    return [];
  }
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${url}`);
  return res.json();
}

/**
 * マニフェスト経由で色名辞書を読み込み（docs/06 §1）。
 * 個別アセットの失敗は握りつぶし、読めたものだけ結合する。
 */
export async function loadColorNames(
  base = "/data",
): Promise<ColorNameEntry[]> {
  const manifest = ManifestSchema.parse(
    await fetchJson(`${base}/manifest.json`),
  );
  const paths = Object.entries(manifest.assets)
    .filter(([key]) => key.startsWith("names."))
    .map(([, v]) => v.path);

  const lists = await Promise.all(
    paths.map(async (p) => {
      try {
        return parseNamesAsset(await fetchJson(`${base}/${p}`));
      } catch {
        return [] as ColorNameEntry[];
      }
    }),
  );
  return lists.flat();
}
