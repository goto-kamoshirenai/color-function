import { z } from "zod";
import raw from "@/data/references.json";

/**
 * 参考資料データ（src/data/references.json）のローダー。
 * 指標別リファレンス・記事・書籍・ベンチツール・アフィリエイトタグを
 * 1つの JSON で管理し、ここで zod 検証して型付きで公開する
 * （不正なデータはビルド/テスト時に即座に失敗する）。
 *
 * リンクの追加・修正は JSON の編集だけで完結する:
 *  - topics.<helpKey>: カードの本マークと /learn の指標別リファレンス
 *  - articles / tools / books: /learn の各セクション
 *  - amazonAssociateTag: 設定すると書籍リンクがアフィリエイトリンクになる
 */
const ReferenceSchema = z.object({
  title: z.string().min(1),
  source: z.string().min(1),
  url: z.url(),
  lang: z.enum(["ja", "en"]),
});

const BookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  /** Amazon 検索クエリ（ASIN 直リンクは改版で切れやすいため検索を使う） */
  query: z.string().min(1),
});

const ReferencesAssetSchema = z.object({
  schemaVersion: z.string(),
  amazonAssociateTag: z.string(),
  topics: z.record(z.string(), z.array(ReferenceSchema).min(1)),
  articles: z.array(ReferenceSchema).min(1),
  tools: z.array(ReferenceSchema).min(1),
  books: z.array(BookSchema).min(1),
});

export type Reference = z.infer<typeof ReferenceSchema>;
export type Book = z.infer<typeof BookSchema>;

const data = ReferencesAssetSchema.parse(raw);

/** 指標（helpKey）別の参考資料。 */
export const REFERENCES: Record<string, Reference[]> = data.topics;
/** 一般記事・読み物。 */
export const ARTICLES: Reference[] = data.articles;
/** ベンチツール（外部ツール）。 */
export const TOOLS: Reference[] = data.tools;
/** 書籍。 */
export const BOOKS: Book[] = data.books;

/** 書籍の Amazon 検索 URL（amazonAssociateTag 設定時はアフィリエイトリンク）。 */
export function bookUrl(book: Book): string {
  const url = new URL("https://www.amazon.co.jp/s");
  url.searchParams.set("k", book.query);
  if (data.amazonAssociateTag) {
    url.searchParams.set("tag", data.amazonAssociateTag);
  }
  return url.toString();
}
