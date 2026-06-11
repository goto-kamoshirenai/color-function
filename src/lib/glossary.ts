import { z } from "zod";
import raw from "@/data/glossary.json";

/**
 * 用語集データ（src/data/glossary.json）のローダー。
 * references.json と同様、zod 検証して型付きで公開する。
 * 用語の追加・修正は JSON の編集だけで完結する。
 */
const LocalizedSchema = z.object({
  ja: z.string().min(1),
  en: z.string().min(1),
});

const GlossarySchema = z.object({
  schemaVersion: z.string(),
  terms: z.array(
    z.object({
      id: z.string().min(1),
      term: LocalizedSchema,
      def: LocalizedSchema,
    }),
  ),
});

export type GlossaryTerm = z.infer<typeof GlossarySchema>["terms"][number];

export const GLOSSARY: GlossaryTerm[] = GlossarySchema.parse(raw).terms;
