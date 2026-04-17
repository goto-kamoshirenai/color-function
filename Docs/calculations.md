# その他の色計算仕様

WCAG 関連の式は [wcag.md](./wcag.md) にまとめています。本ドキュメントでは、配色分析・色展開・エクスポートで使う計算ロジックを扱います。

## 1. HEX → RGB / HSV 変換

### hexToRgb

[src/libs/colorUtils.ts](../src/libs/colorUtils.ts)

```ts
/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
```

- 6 桁 HEX のみ対応（`#`は任意）
- 3 桁短縮形 (`#abc`)、RGBA、CSS 色名は `null` を返す
- アプリ内のカラーピッカーは常に 6 桁を出力するため実害なし

### rgbToHsv（内部関数）

標準的な RGB → HSV 変換。

```
max  = max(R', G', B')
min  = min(R', G', B')
Δ    = max - min

H = 0                              (Δ = 0)
H = 60° × ((G'-B')/Δ mod 6)        (max = R)
H = 60° × ((B'-R')/Δ + 2)          (max = G)
H = 60° × ((R'-G')/Δ + 4)          (max = B)

S = 0           (max = 0)
S = Δ / max     (otherwise)

V = max
```

R', G', B' は `[0, 1]` に正規化した値。戻り値は `{ h: [0,360], s: [0,100], v: [0,100] }` を整数丸め。

### hexToHsv

`hexToRgb` → `rgbToHsv` の合成。`CardHSV` で各色の HSV を算出するのに利用。

## 2. 配色パレット分析（analyzeColorPalette）

[src/libs/colorUtils.ts](../src/libs/colorUtils.ts) の `analyzeColorPalette`。`CardEntropy` が唯一の呼び出し側で、1〜8 色の HEX 配列を受け取り、次の構造を返します。

```ts
interface ColorAnalysis {
  entropy: number;              // 総合エントロピー（0-0.667）
  hueVariety: number;           // 色相の広がり（0-1）
  saturationUnity: number;      // 彩度の統一性（0.5-1）
  lightnessBalance: number;     // 明度のバランス（0.5-1）
  colorCategory: "統一感" | "バランス" | "カラフル";
}
```

すべて `chroma(color).hsl()` を基準に算出します（`h ∈ [0,360]`, `s ∈ [0,1]`, `l ∈ [0,1]`、無彩色の `h` は NaN）。

### 2.1 無彩色判定

```ts
isAchromatic(hsl) = (l <= 0) || (l >= 1) || (s <= 0)
```

純黒・純白・完全無彩色（彩度 0）を除外。

### 2.2 hueVariety（色相の広がり）

`calculateHueVariety(hues, lightness)`:

1. `lightness` が `0 < l < 1` のインデックスに限定（純黒/純白を除外）
2. そのうち hue が非 NaN のものだけ抽出
3. 全ペアの **最大**円周距離を算出（`min(|a-b|, 360-|a-b|)`）
4. `maxDiff / 180` を返す（上限 1）

**⚠️ 設計上の特性**: これは**平均的な多様性ではなく、最大ペア距離**です。7 色が赤・1 色が水色のパレットでも、補色ペアが存在する時点で 1.0 になります。「パレット内に最も離れた色がどれだけ離れているか」を測る指標です。

**⚠️ フィルタ不一致**: `analyzeColorPalette` の `isAchromatic` と違い、ここでは彩度フィルタ `s <= 0` を直接適用しません。NaN hue の除外で実質的に彩度 0 のケースは落ちますが、彩度が極小（例: 0.001）の色は含まれます。

### 2.3 saturationUnity（彩度の統一性）

無彩色を除いた彩度の標準偏差 `σ` を用いて:

```
saturationUnity = 1 - σ(saturations)
```

彩度値は `[0, 1]` 範囲なので `σ` は最大でも 0.5 程度。結果として saturationUnity は概ね `[0.5, 1.0]` に収まります（値がばらつくほど低下）。

全色が無彩色の場合は `1` を返します。

### 2.4 lightnessBalance（明度のバランス）

**全色**（無彩色含む）の明度の平均が 0.5 に近いほど 1、両端に寄るほど低下。

```
lightnessBalance = 1 - |0.5 - avg(lightness)|
```

取り得る範囲: `[0.5, 1.0]`。

### 2.5 entropy と colorCategory

```
entropy = (hueVariety + (1 - saturationUnity) + (1 - lightnessBalance)) / 3
```

- `hueVariety`: `[0, 1]`
- `1 - saturationUnity`: 実質 `[0, 0.5]`
- `1 - lightnessBalance`: `[0, 0.5]`

**⚠️ 実効最大値は約 0.667**（1 + 0.5 + 0.5 = 2、/3 で 0.667）。

カテゴリ判定:

| entropy | colorCategory |
|---|---|
| < 0.3 | 統一感 |
| 0.3〜0.6 | バランス |
| ≥ 0.6 | カラフル |

カラフル判定が引かれるのは entropy が 0.6〜0.667 と狭い範囲のときです。閾値の設計は UI ラベル上の三分類を保つためのもので、WCAG のような外部規格ではありません。

### 2.6 UI への出力

[CardEntropy.tsx](../src/components/feature/card/CardEntropy.tsx) は各指標を `Math.round(value * 100)` でパーセント表示します。

| 表示名 | 出典 |
|---|---|
| 色相分布 | `hueVariety` |
| 彩度分布 | `saturationUnity` |
| 明度分布 | `lightnessBalance` |

## 3. ColorExtend（色の展開）

[src/components/feature/card/ColorExtend.tsx](../src/components/feature/card/ColorExtend.tsx)

tinycolor2 を用い、基準色の HSV を固定した状態で **明度 / 彩度 / 色相** を段階的に変化させた派生色を生成します。

### 明度バリエーション（generateExtendedColors）

- ステップ: 10%（`step = 0.1`）
- 基準色の V が 0% のとき: 上方向のみに展開（0% → 100%）
- 基準色の V が 100% のとき: 下方向のみに展開（0% → 100%）
- 間の値のとき: 基準値から上下に 10% ずつ、両端 0%・100% まで
- オフセット値（%）を各バリエーションに付与（基準色は `0`）

### 彩度・色相バリエーション

同様に `saturationColors`, `hueColors` を生成。色相は補色位置も計算されるため、`isComplementary: boolean` を各要素に持ちます。

UI 上で任意のバリエーションをクリックすると、`myColorStore` の対応スロット（MainA/B, BaseA/B, AccentA/B, TextA/B）が置き換えられます。

## 4. CIEDE2000 色差

chroma-js 同梱の `deltaE`（CIEDE2000 実装）を使用。詳細しきい値とバッジ色は [wcag.md#4-ciede2000-色差](./wcag.md#4-ciede2000-色差) 参照。

## 5. エクスポート/インポート

[src/libs/colorExport.ts](../src/libs/colorExport.ts)

### ExportFormat

| 値 | 出力ファイル | 生成関数 |
|---|---|---|
| `csv` | `color-settings.csv` | `generateCSV` |
| `tailwind-js` | `tailwind.config.js` | `generateTailwindConfig(colors, false)` |
| `tailwind-ts` | `tailwind.config.ts` | `generateTailwindConfig(colors, true)` |
| `css` | `color-settings.css` | `generateCSSVariables` |
| `sass` | `color-settings.scss` | `generateSassVariables` |
| `json` | `color-settings.json` | `generateJSON` |

### CSV 形式

```
mainColorA,mainColorB,baseColorA,baseColorB,accentColorA,accentColorB,textColorA,textColorB
#000000,,#a3a3a3,,#2EA9DF,,#000000,
```

- 1 行目: 固定ヘッダ
- 2 行目: HEX 値（B 系列が未設定なら空欄）
- `undefined` は `Array.prototype.join` により自動で空文字列化

### Tailwind Config 出力

ネストされた `colors` オブジェクトとして出力:

```js
colors: {
  main:   { a: "#xxx", b: "#xxx" },
  base:   { a: "#xxx", b: "#xxx" },
  accent: { a: "#xxx", b: "#xxx" },
  text:   { a: "#xxx", b: "#xxx" },
}
```

B 系列は未設定時にキーごと省略。

### CSS Variables / SASS

`--color-{role}-{a|b}` / `$color-{role}-{a|b}` の命名規則。B 系列は未設定時は行ごと省略。

### ダウンロード実装

`Blob` + `URL.createObjectURL` + 一時 `<a>` クリックで保存。`URL.revokeObjectURL` で後始末。

### parseColorSettings（CSV インポート）

```ts
parseColorSettings(csvText) = csvText.trim().split("\n")[1].split(",");
```

- 2 行目を `,` で split して返す
- ヘッダ行や引用符は考慮しない単純実装。アプリ自身がエクスポートした CSV の往復に最適化されているため、外部の複雑な CSV には対応しません

## 6. 実装上の既知の特性（要注意点）

| 項目 | 場所 | 内容 |
|---|---|---|
| hueVariety は「範囲」指標 | `calculateHueVariety` | 平均距離や円周分散ではなく **最大ペア距離 / 180**。1 ペアでも補色があれば 1.0 になる |
| 無彩色フィルタの不一致 | `analyzeColorPalette` vs `calculateHueVariety` | 前者は `l ≤ 0 \|\| l ≥ 1 \|\| s ≤ 0`、後者は `l > 0 && l < 1` のみ（hue の NaN 判定で実質カバー） |
| entropy 最大値 ≒ 0.667 | `analyzeColorPalette` | `saturationUnity`・`lightnessBalance` の下限が 0.5 のため `(1 - x)` 側の上限が 0.5 止まり |
| CSV パーサ単純化 | `parseColorSettings` | RFC 4180 非準拠。引用符・改行エスケープ不可 |
| HEX は 6 桁のみ | `hexToRgb` | 3 桁短縮形 `#abc` を受けない |

これらは既知の設計特性として運用しています。UI 要件に応じて改修する場合は本ドキュメントを更新してください。

## 7. 参考

- [HSV and HSL (Wikipedia)](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [chroma-js API: deltaE / hsl / distance](https://gka.github.io/chroma.js/)
- [tinycolor2](https://github.com/bgrins/TinyColor)
