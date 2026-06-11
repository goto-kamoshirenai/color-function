# 06. 静的アセット スキーマ定義

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [制約・前提](./02_constraints.md) / [カードカタログ](./04_card_catalog.md) / [データモデルとカード契約](./05_data_model_and_card_contract.md)

[制約 §2.2](./02_constraints.md) で「バックエンドに持つ静的データアセット」と定めた4種の**スキーマ・配置・バージョニング**を確定する。
これは `core/color/*`（[05 §5](./05_data_model_and_card_contract.md)）が参照するデータ基盤であり、DB を持たない本アプリの"根拠データ"の中核。

対象アセット:

1. 色名辞書（辞）
2. WCAG / 基準値（WCAG）
3. 調和ルール / テンプレート（調）
4. 色覚多様性プロファイル（覚）

---

## 1. 方針

### 1.1 配置と読み込み

- **配置**: `public/data/` 配下に静的 JSON として置き、クライアントが fetch する（推奨）。
  - 理由: DB レス・クライアント計算中心（[制約 §4](./02_constraints.md)）と整合。CDN キャッシュも効く。
  - API Routes 経由が必要になった場合（整形・絞り込み配信）は後から差し込める。
- **遅延読み込み**: 色名辞書は大きくなりうる（[制約 §5](./02_constraints.md)）ため、**システム単位でファイル分割**し必要時に取得。
- **マニフェスト**: `public/data/manifest.json` が全アセットの所在とバージョンを列挙し、読み込みの起点になる。

```
public/data/
  manifest.json
  names/
    css.json          # CSS named colors
    jis.json          # JIS 慣用色名
    wa.json           # 和色
  standards/
    wcag.json         # コントラスト基準
  harmony/
    rules.json        # 調和ルール（色相回転）
    templates.json    # 用途別テンプレート
  cvd/
    profiles.json     # 色覚シミュレーション行列
```

### 1.2 共通エンベロープ

すべてのアセットファイルは共通メタを持つ。

```ts
type AssetEnvelope<T> = {
  schemaVersion: string; // スキーマ定義のバージョン（破壊的変更で上げる）
  version: string; // データ内容のバージョン
  kind: "names" | "standards" | "harmony-rules" | "harmony-templates" | "cvd";
  source?: string; // 出典・帰属（ライセンス §7）
  data: T; // 種別ごとの本体
};
```

- **バージョニング**: スキーマと内容を分離。`schemaVersion` はコード側の読み取り互換、`version` はデータ更新追跡。
- [制約 §5](./02_constraints.md) の「アセットのスキーマを文書側で担保」をこの章が担う。

### 1.3 マニフェスト

```json
{
  "schemaVersion": "1.0.0",
  "assets": {
    "names.css": { "path": "names/css.json", "version": "1.0.0", "lazy": true },
    "names.jis": { "path": "names/jis.json", "version": "1.0.0", "lazy": true },
    "names.wa": { "path": "names/wa.json", "version": "1.0.0", "lazy": true },
    "wcag": {
      "path": "standards/wcag.json",
      "version": "1.0.0",
      "lazy": false
    },
    "harmony.rules": {
      "path": "harmony/rules.json",
      "version": "1.0.0",
      "lazy": false
    },
    "harmony.templates": {
      "path": "harmony/templates.json",
      "version": "1.0.0",
      "lazy": false
    },
    "cvd": { "path": "cvd/profiles.json", "version": "1.0.0", "lazy": false }
  }
}
```

---

## 2. 色名辞書（names）

「名前 ⇔ 値」と最近傍ルックアップ（カタログ I）の根拠。システム単位でファイル分割。

```ts
type ColorNameEntry = {
  id: string; // 一意（例 'css-tomato' / 'wa-asagi'）
  name: string; // 表示名（英: 'Tomato' / 和: '浅葱'）
  hex: string; // '#rrggbb'（正準は sRGB）
  reading?: string; // 読み仮名（日本語系のみ。例 'あさぎ'）
  aliases?: string[]; // 別名・異表記
  tags?: string[]; // 分類・連想（'warm' / '青系' 等。任意）
  meaning?: string; // 文化的・意味的な注記（任意。カタログ I「意味ラベル」）
};

type NamesAsset = AssetEnvelope<{
  system: "css" | "jis" | "wa";
  locale: "en" | "ja";
  colors: ColorNameEntry[];
}>;
```

例（`names/wa.json` 抜粋）:

```json
{
  "schemaVersion": "1.0.0",
  "version": "1.0.0",
  "kind": "names",
  "source": "伝統色（パブリックドメイン由来）",
  "data": {
    "system": "wa",
    "locale": "ja",
    "colors": [
      {
        "id": "wa-asagi",
        "name": "浅葱",
        "hex": "#00a3af",
        "reading": "あさぎ",
        "tags": ["青系"]
      }
    ]
  }
}
```

- **最近傍探索**: 距離計算は `core/color`（CIEDE2000 等）が担う。辞書は値を持つだけ。
- 大規模化に備え、システム単位の遅延読み込み＋（必要なら）将来のインデックス分割を許容。

---

## 3. WCAG / 基準値（standards）

コントラスト合否判定（カタログ C）の根拠。複数規格を配列で持ち拡張可能にする。

```ts
type ContrastLevel = {
  id: string; // 'AA-normal' 等
  label: string; // 'AA 通常テキスト'
  minRatio: number; // 合格に必要な最小コントラスト比
  context: "text" | "nontext";
  textSize?: "normal" | "large";
};

type ContrastStandard = {
  id: "WCAG21" | "APCA" | string;
  label: string;
  metric: "ratio" | "Lc"; // WCAG=比, APCA=Lc 値
  levels: ContrastLevel[];
  largeText?: { minPt: number; minPtBold: number }; // 大きい文字の定義
};

type StandardsAsset = AssetEnvelope<{ standards: ContrastStandard[] }>;
```

例（`standards/wcag.json` 抜粋）:

```json
{
  "schemaVersion": "1.0.0",
  "version": "1.0.0",
  "kind": "standards",
  "source": "W3C WCAG 2.1",
  "data": {
    "standards": [
      {
        "id": "WCAG21",
        "label": "WCAG 2.1",
        "metric": "ratio",
        "largeText": { "minPt": 18, "minPtBold": 14 },
        "levels": [
          {
            "id": "AA-normal",
            "label": "AA 通常テキスト",
            "minRatio": 4.5,
            "context": "text",
            "textSize": "normal"
          },
          {
            "id": "AA-large",
            "label": "AA 大きい文字",
            "minRatio": 3.0,
            "context": "text",
            "textSize": "large"
          },
          {
            "id": "AAA-normal",
            "label": "AAA 通常テキスト",
            "minRatio": 7.0,
            "context": "text",
            "textSize": "normal"
          },
          {
            "id": "AAA-large",
            "label": "AAA 大きい文字",
            "minRatio": 4.5,
            "context": "text",
            "textSize": "large"
          },
          {
            "id": "AA-ui",
            "label": "UI部品/グラフィック",
            "minRatio": 3.0,
            "context": "nontext"
          }
        ]
      }
    ]
  }
}
```

- 相対輝度の係数（0.2126 / 0.7152 / 0.0722）は**計算定数**として `core/color/contrast.ts` 側に置く（データではない）。
- APCA は将来 `standards` 配列に `metric: 'Lc'` の規格として追加する余地を確保。

---

## 4. 調和ルール / テンプレート（harmony）

設計支援（カタログ G/H）の素。**ルール（生成関数の定義）**と**テンプレート（具体的な出発配色）**を分けて持つ。

### 4.1 調和ルール（色相回転で定義）

```ts
type HarmonyRule = {
  id: string; // 'complementary' 等
  label: string; // '補色'
  hueOffsets: number[]; // 基準色相からのオフセット（度）
  varyBy?: "lightness" | "saturation"; // モノクロ系の派生軸（任意）
};

type HarmonyRulesAsset = AssetEnvelope<{ rules: HarmonyRule[] }>;
```

例（`harmony/rules.json` 抜粋）:

```json
{
  "schemaVersion": "1.0.0",
  "version": "1.0.0",
  "kind": "harmony-rules",
  "data": {
    "rules": [
      { "id": "complementary", "label": "補色", "hueOffsets": [0, 180] },
      { "id": "analogous", "label": "類似色", "hueOffsets": [-30, 0, 30] },
      { "id": "triadic", "label": "トライアド", "hueOffsets": [0, 120, 240] },
      {
        "id": "split-complementary",
        "label": "分裂補色",
        "hueOffsets": [0, 150, 210]
      },
      {
        "id": "tetradic",
        "label": "テトラード",
        "hueOffsets": [0, 90, 180, 270]
      },
      {
        "id": "monochromatic",
        "label": "モノクロマティック",
        "hueOffsets": [0],
        "varyBy": "lightness"
      }
    ]
  }
}
```

- オフセットを適用する色空間（HSL の色相 / OKLCH の色相）は `core/color/harmony.ts` の仕様で固定する（[05 §5](./05_data_model_and_card_contract.md)）。推奨は知覚均等な OKLCH の色相。

### 4.2 配色テンプレート（用途別の出発配色）

```ts
type ColorTemplate = {
  id: string; // 'ui-neutral-accent' 等
  label: string; // 'UI: ニュートラル＋アクセント'
  useCase?: string; // 用途タグ（'ui' / 'data-viz' / 'brand' 等）
  roles: string[]; // 役割の並び（'background','surface','text','accent'…）
  swatches: string[]; // 役割に対応する HEX（roles と同順・同数）
};

type HarmonyTemplatesAsset = AssetEnvelope<{ templates: ColorTemplate[] }>;
```

例（`harmony/templates.json` 抜粋）:

```json
{
  "schemaVersion": "1.0.0",
  "version": "1.0.0",
  "kind": "harmony-templates",
  "data": {
    "templates": [
      {
        "id": "ui-neutral-accent",
        "label": "UI: ニュートラル＋アクセント",
        "useCase": "ui",
        "roles": ["background", "surface", "text", "accent"],
        "swatches": ["#ffffff", "#f3f4f6", "#1f2937", "#3b82f6"]
      }
    ]
  }
}
```

- `roles` は将来の「セマンティックロール割当」（カタログ H）と語彙を共有する。役割語彙は別途用語として固定する。

---

## 5. 色覚多様性プロファイル（cvd）

色覚シミュレーション（カタログ E）の変換パラメータ。**P/D/T 型ごとの 3×3 行列**を持つ。

```ts
type CvdType = {
  id: "protan" | "deutan" | "tritan";
  label: string; // 'P型（1型/赤）' 等
  severity: number; // 0–1（1=最重度）。複数強度を持つ場合は別エントリ
  matrix: number[][]; // 3×3。線形RGB空間で適用
};

type CvdAsset = AssetEnvelope<{
  method: "machado2009" | "brettel1997" | "vienot1999";
  appliesIn: "linear-rgb"; // 行列適用の前提色空間
  types: CvdType[];
}>;
```

例（`cvd/profiles.json` 抜粋・係数はプレースホルダ）:

```json
{
  "schemaVersion": "1.0.0",
  "version": "1.0.0",
  "kind": "cvd",
  "source": "Machado et al. 2009",
  "data": {
    "method": "machado2009",
    "appliesIn": "linear-rgb",
    "types": [
      {
        "id": "protan",
        "label": "P型（1型/赤）",
        "severity": 1.0,
        "matrix": [
          [0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0],
          [0.0, 0.0, 0.0]
        ]
      }
    ]
  }
}
```

- **推奨手法**: Machado 2009（強度パラメータ付き・単一行列で適用が簡潔）。実係数は実装時に確定し `version` を上げる。
- **重要な前提**: 行列は**線形RGB**で適用する（sRGB ガンマを解除 → 行列 → 再ガンマ）。`appliesIn` で明示し、`core/color/cvd.ts` がこの順序を守る。
- 強度を複数提供する場合は `severity` 違いのエントリを並べる（UI で軽度〜重度を切替可能に）。

---

## 6. 計算レイヤとの接続

[05 §5](./05_data_model_and_card_contract.md) の `core/color/*` がアセットを参照する対応。

| アセット               | 参照する計算モジュール   | 用途                   |
| ---------------------- | ------------------------ | ---------------------- |
| names/\*               | `core/color/name.ts`     | 最近傍色名ルックアップ |
| standards/wcag.json    | `core/color/contrast.ts` | コントラスト合否判定   |
| harmony/rules.json     | `core/color/harmony.ts`  | 調和スキーム生成・判定 |
| harmony/templates.json | （設計カード）           | テンプレート適用       |
| cvd/profiles.json      | `core/color/cvd.ts`      | 色覚シミュレーション   |

- アセットは**読み取り専用**。計算モジュールはアセット＋`Color` から結果を算出するだけ（状態に保存しない）。
- 読み込み層（fetch + キャッシュ）は計算層と分離し、マニフェスト経由で遅延取得する。

---

## 7. ライセンス・出典

DB を持たず静的同梱するため、各データの**出典と再配布条件**を明確化する（`source` フィールド＋本節）。

| アセット         | 想定出典                   | 留意点                                       |
| ---------------- | -------------------------- | -------------------------------------------- |
| CSS named colors | CSS Color 仕様（公開標準） | 仕様由来。帰属表記で利用可                   |
| JIS 慣用色名     | JIS 規格の色名             | 規格本文の扱いに留意。名称・近似値の出典明記 |
| 和色             | 伝統色（一般に公知）       | データソースのライセンスを確認して明記       |
| WCAG 基準値      | W3C WCAG 2.1               | 公開標準。閾値は事実データ                   |
| 色覚行列         | Machado 2009 等の学術論文  | 出典明記。係数の版を `version` で管理        |

> 実データ投入前に、各ソースのライセンスを確認し `source` と本表を更新する。

---

## 8. 未決事項（次に詰める）

1. **実データの投入**: 各アセットの初期データセット作成（特に色名辞書の収録範囲）。
2. **色覚行列の実係数**確定（Machado 2009 の採用版・強度段階）。
3. **役割語彙（roles）**の標準化（テンプレート／セマンティックロールで共有する語彙集）。
4. アセット**読み込み層**の実装方針（fetch・キャッシュ・失敗時フォールバック）。
5. 各MVPカードの**計算仕様**（[05 §9-2](./05_data_model_and_card_contract.md)）— アセットと対で確定。
