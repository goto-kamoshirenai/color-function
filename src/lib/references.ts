import { z } from "zod";
import raw from "@/data/references.json";

/**
 * 参考資料データ（src/data/references.json）のローダー。
 * 指標別リファレンス・記事・書籍・ベンチツールを 1つの JSON で管理し、
 * ここで zod 検証して型付きで公開する
 * （不正なデータはビルド/テスト時に即座に失敗する）。
 *
 * リンクの追加・修正は JSON の編集だけで完結する:
 *  - topics.<helpKey>: カードの本マークと /learn の指標別リファレンス
 *  - articles / tools / books: /learn の各セクション
 */
const ReferenceSchema = z.object({
  title: z.string().min(1),
  source: z.string().min(1),
  url: z.url(),
  lang: z.enum(["ja", "en"]),
});

/**
 * 書籍の購入リンク（Amazon アソシエイトの短縮リンク。タグは URL に内包）。
 * 電子版がない書籍は kindle を省略する。
 */
const BookLinksSchema = z.object({
  print: z.url(),
  kindle: z.url().optional(),
});

const BookSchema = z.object({
  /** React キー・テスト用の安定 ID（書名や版が変わっても据え置く） */
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  /** 邦訳版・改訂版がある書籍はその版の発行年 */
  year: z.int().min(1900).max(2100),
  links: BookLinksSchema,
});

const ReferencesAssetSchema = z.object({
  schemaVersion: z.string(),
  topics: z.record(z.string(), z.array(ReferenceSchema).min(1)),
  articles: z.array(ReferenceSchema).min(1),
  tools: z.array(ReferenceSchema).min(1),
  books: z.array(BookSchema).min(1),
});

export type Reference = z.infer<typeof ReferenceSchema>;
export type Book = z.infer<typeof BookSchema>;
/** 書籍リンクの版種別（単行本 / Kindle）。 */
export type BookFormat = keyof z.infer<typeof BookLinksSchema>;

const data = ReferencesAssetSchema.parse(raw);

/** 指標（helpKey）別の参考資料。 */
export const REFERENCES: Record<string, Reference[]> = data.topics;
/** 一般記事・読み物。 */
export const ARTICLES: Reference[] = data.articles;
/** ベンチツール（外部ツール）。 */
export const TOOLS: Reference[] = data.tools;
/** 書籍。 */
export const BOOKS: Book[] = data.books;

/** 書籍の版種別と購入 URL の組（表示順は単行本→Kindle）。 */
export type BookLinkEntry = { format: BookFormat; url: string };

/** 書籍が持つ版のリンクを表示順に列挙する（電子版がなければ単行本のみ）。 */
export function bookLinks(book: Book): BookLinkEntry[] {
  const { print, kindle } = book.links;
  const entries: BookLinkEntry[] = [{ format: "print", url: print }];
  if (kindle) entries.push({ format: "kindle", url: kindle });
  return entries;
}
