import common from "@locales/ja/common.json";

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type TranslationType = DeepReadonly<typeof common>;

declare module "@locales/*/common.json" {
  const content: TranslationType;
  export default content;
}
