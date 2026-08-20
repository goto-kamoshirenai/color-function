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
 *  - articles / tools: /learn の各セクション
 *  - books: 図書館（/library）
 *  - libraries: 実装（/code）の計算ライブラリ
 */
const LocalizedSchema = z.object({
  ja: z.string().min(1),
  en: z.string().min(1),
});

const LocalizedListSchema = z.object({
  ja: z.array(z.string().min(1)).min(1),
  en: z.array(z.string().min(1)).min(1),
});

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

/** 書架（図書館ページの分類チップ）。書籍の性格を1語で表す。 */
const BookShelfSchema = z.enum([
  "theory",
  "practice",
  "accessibility",
  "psychology",
  "reference",
  "engineering",
]);

/**
 * 主な読者。図書館の絞り込みに使う。
 * デザイナー以外（実装者）が自分の棚を見つけられるようにするための軸で、
 * 内容の性格を表す shelf とは独立している。
 */
const BookAudienceSchema = z.enum(["engineer", "designer", "both"]);

const BookSchema = z.object({
  /** React キー・テスト用の安定 ID（書名や版が変わっても据え置く。URL にも使う） */
  id: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().min(1),
  /** 邦訳版・改訂版がある書籍はその版の発行年 */
  year: z.int().min(1900).max(2100),
  shelf: BookShelfSchema,
  audience: BookAudienceSchema,
  /** カバータイルの地色（書影は使えないため、色で識別する） */
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  /** この書籍が扱う指標（helpKey）。カードの参考資料と図書館の索引に使う */
  topics: z.array(z.string().min(1)).min(1),
  /** 一覧に出す一言レコメンド */
  pitch: LocalizedSchema,
  /** 詳細ページの本文（段落の配列） */
  summary: LocalizedListSchema,
  links: BookLinksSchema,
});

/**
 * 計算ライブラリ（/code）。図書館の「蔵書（Book）」とは別物で、
 * 「この指標を自分のコードで出すなら何を使うか」を指標に紐づけて並べる。
 */
const CodeLibrarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** npm パッケージ名。CSS ネイティブなど、入れるものが無い場合は省略 */
  pkg: z.string().min(1).optional(),
  kind: z.enum(["js", "css"]),
  /** ドキュメント（一次情報） */
  url: z.url(),
  /** ソース。ドキュメントが GitHub 自体のときは省略 */
  repo: z.url().optional(),
  /** 代表的な API（識別子なので言語別に持たない） */
  api: z.string().min(1),
  /** この道具が効く指標（helpKey） */
  topics: z.array(z.string().min(1)).min(1),
  pitch: LocalizedSchema,
});

const ReferencesAssetSchema = z.object({
  schemaVersion: z.string(),
  topics: z.record(z.string(), z.array(ReferenceSchema).min(1)),
  articles: z.array(ReferenceSchema).min(1),
  tools: z.array(ReferenceSchema).min(1),
  books: z.array(BookSchema).min(1),
  libraries: z.array(CodeLibrarySchema).min(1),
});

export type Reference = z.infer<typeof ReferenceSchema>;
export type Book = z.infer<typeof BookSchema>;
export type CodeLibrary = z.infer<typeof CodeLibrarySchema>;
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
/** 計算ライブラリ（実装で使う道具）。 */
export const CODE_LIBRARIES: CodeLibrary[] = data.libraries;

/** 書籍の版種別と購入 URL の組（表示順は単行本→Kindle）。 */
export type BookLinkEntry = { format: BookFormat; url: string };

/** 書籍が持つ版のリンクを表示順に列挙する（電子版がなければ単行本のみ）。 */
export function bookLinks(book: Book): BookLinkEntry[] {
  const { print, kindle } = book.links;
  const entries: BookLinkEntry[] = [{ format: "print", url: print }];
  if (kindle) entries.push({ format: "kindle", url: kindle });
  return entries;
}

const BY_ID = new Map(BOOKS.map((b) => [b.id, b]));

/** ID から書籍を引く（図書館の詳細ページ・結果連動の導線から使う）。 */
export function bookById(id: string): Book | undefined {
  return BY_ID.get(id);
}

/** 指標（helpKey）→ その指標を扱う書籍。BOOKS の並び順を保つ。 */
const BY_TOPIC = BOOKS.reduce<Map<string, Book[]>>((acc, book) => {
  for (const topic of book.topics) {
    const list = acc.get(topic);
    if (list) list.push(book);
    else acc.set(topic, [book]);
  }
  return acc;
}, new Map());

/** その指標を扱う書籍を返す（該当なしは空配列）。 */
export function booksForTopic(helpKey: string): Book[] {
  return BY_TOPIC.get(helpKey) ?? [];
}

/** 指標（helpKey）→ その指標を計算できるライブラリ。CODE_LIBRARIES の並び順を保つ。 */
const LIBS_BY_TOPIC = CODE_LIBRARIES.reduce<Map<string, CodeLibrary[]>>(
  (acc, lib) => {
    for (const topic of lib.topics) {
      const list = acc.get(topic);
      if (list) list.push(lib);
      else acc.set(topic, [lib]);
    }
    return acc;
  },
  new Map(),
);

const LIB_BY_ID = new Map(CODE_LIBRARIES.map((l) => [l.id, l]));

/** ID からライブラリを引く（カードのスニペットから使う）。 */
export function codeLibraryById(id: string): CodeLibrary | undefined {
  return LIB_BY_ID.get(id);
}

/** その指標を計算できるライブラリを返す（該当なしは空配列）。 */
export function librariesForTopic(helpKey: string): CodeLibrary[] {
  return LIBS_BY_TOPIC.get(helpKey) ?? [];
}
