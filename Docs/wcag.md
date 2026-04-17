# WCAG・色彩計算の詳細仕様

本アプリの色分析ロジック（相対輝度、コントラスト比、WCAG 判定、色差、輝度レベル）の計算式としきい値をまとめます。

## 1. 相対輝度（Relative Luminance）

### 定義

WCAG 2.x の [relativeluminancedef](https://www.w3.org/TR/WCAG20/#relativeluminancedef) に準拠。sRGB 色空間の線形化を経て輝度を算出します。

```
L = 0.2126 × R + 0.7152 × G + 0.0722 × B
```

各チャンネル `C ∈ {R, G, B}` は sRGB 値 `c_sRGB = c / 255` を次のガンマ補正で線形化します:

```
C = c_sRGB / 12.92                        (c_sRGB ≤ 0.03928)
C = ((c_sRGB + 0.055) / 1.055) ^ 2.4      (c_sRGB > 0.03928)
```

- 値域: `0.0`（純黒）〜 `1.0`（純白）
- 係数 `0.2126 / 0.7152 / 0.0722` は BT.709 標準観測者での知覚寄与率

### 実装

[src/libs/wcag.ts](../src/libs/wcag.ts) と [src/libs/relativeLuminance.ts](../src/libs/relativeLuminance.ts) に同一ロジックで実装されています。HEX を受け取る場合は [src/libs/colorUtils.ts](../src/libs/colorUtils.ts) の `hexToRgb` で RGB に変換してから渡します。

### 輝度レベル判定（独自分類）

`getLuminanceLevel`（[relativeLuminance.ts:36-42](../src/libs/relativeLuminance.ts)）で 5 段階に分類。WCAG 規格ではなくアプリ独自のラベルです。

| 相対輝度 | レベル | バッジ（Tailwind） |
|---|---|---|
| ≥ 0.8 | 非常に明るい | `bg-blue-100` |
| 0.6〜0.8 | 明るい | `bg-blue-200` |
| 0.4〜0.6 | 中程度 | `bg-blue-300` |
| 0.2〜0.4 | 暗い | `bg-blue-400` |
| < 0.2 | 非常に暗い | `bg-blue-500` |

`CardRelativeLuminance` でのみ使用されます。

## 2. コントラスト比（Contrast Ratio）

### 定義

WCAG 2.x の [contrast-ratiodef](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio) に準拠。

```
ratio = (L1 + 0.05) / (L2 + 0.05)
```

- `L1`: 2 色のうち相対輝度が**大きい**方
- `L2`: 2 色のうち相対輝度が**小さい**方
- 値域: `1:1`（同色）〜 `21:1`（黒と白）
- 加算している `0.05` は周囲光（ambient luminance）を模擬した補正項

### 実装

[src/libs/wcag.ts](../src/libs/wcag.ts) の `getContrastRatio`。常に `lighter / darker` の向きで計算し、結果は `formatContrastRatio` で `"X.XX：1"` 形式に整形します。

## 3. WCAG 適合レベル判定

### 基準（WCAG 2.1 / 2.2 共通）

| 評価軸 | 通常テキスト | 大きなテキスト* |
|---|---|---|
| **AA**（SC 1.4.3 Minimum） | ≥ 4.5 : 1 | ≥ 3.0 : 1 |
| **AAA**（SC 1.4.6 Enhanced） | ≥ 7.0 : 1 | ≥ 4.5 : 1 |
| 不適合 | < 4.5 : 1 | < 3.0 : 1 |

*大きなテキスト = 18pt（≈24px）以上、または 14pt（≈18.67px）以上の太字

WCAG 2.2 でこの基準は WCAG 2.1 から変更されていません。

### 実装

[src/libs/wcag.ts](../src/libs/wcag.ts) の `getWCAGLevel(ratio, isLargeText)` が上表どおりに判定します。

```ts
export const getWCAGLevel = (
  ratio: number,
  isLargeText: boolean = false
): ContrastLevel => {
  const aaaThreshold = isLargeText ? 4.5 : 7.0;
  const aaThreshold = isLargeText ? 3.0 : 4.5;
  if (ratio >= aaaThreshold) return "AAA(適合)";
  if (ratio >= aaThreshold) return "AA(適合)";
  return "不適合";
};
```

戻り値の型は `ContrastLevel = "不適合" | "AA(適合)" | "AAA(適合)"`。

### 呼び出し側（CardContrast）

[CardContrast.tsx](../src/components/feature/card/CardContrast.tsx) は `isLargeText` を渡さず **常に通常テキスト基準で判定**しています。1 つの `ContrastResult` で以下の組合せを評価:

- TextA × （Main/Base/Accent）A
- TextA × （Main/Base/Accent）B（B が設定されていれば）
- TextB × （Main/Base/Accent）A（TextB が設定されていれば）
- TextB × （Main/Base/Accent）B（両方あれば）

バッジ色は `getLevelColor()`:

| レベル | バッジ |
|---|---|
| AAA(適合) | `bg-sky-600` |
| AA(適合) | `bg-lime-600` |
| 不適合 | `bg-pink-600` |

## 4. CIEDE2000 色差

### 定義

CIE が 2000 年に標準化した知覚色差指標 `ΔE*₀₀`。CIELAB 色空間で 2 色間の距離を計算し、L・C・H の各差に補正項を加えて算出します。chroma-js の `deltaE` 実装を利用。

### しきい値（独自分類）

[CardCIEDE2000.tsx:19-37](../src/components/feature/card/CardCIEDE2000.tsx)

| ΔE₀₀ | 評価 | バッジ |
|---|---|---|
| ≥ 5.0 | 明確な差 | `bg-sky-600` |
| 2.0〜5.0 | 認識可能 | `bg-lime-600` |
| < 2.0 | 差が小さい | `bg-pink-600` |

**参考**: 一般に以下が知覚目安とされています（本アプリの分類はこれを簡略化したもの）。

- `ΔE < 1.0`: 人間には区別がつかない
- `1.0 ≤ ΔE < 2.0`: 訓練された目にのみ差が見える
- `2.0 ≤ ΔE < 10.0`: 一瞥で差が分かる
- `ΔE ≥ 11.0`: 明らかに異なる色

## 5. 実装上の注意点

### 入力 HEX の形式

[colorUtils.ts:25-36](../src/libs/colorUtils.ts) の `hexToRgb` は正規表現 `/^#?([a-f\d]{2}){3}$/i` で **6 桁 HEX のみ**受理します。3 桁短縮形 (`#abc`)、RGBA、CSS 色名は `null` になり、`getContrastRatio` は `0` を返します。アプリ内ではカラーピッカーが常に 6 桁を出力するため実害はありません。

### ガンマ補正のしきい値

WCAG 2.x の文面どおり `0.03928` を使用しています。IEC 61966-2-1 の新版では `0.04045` とされていますが、差分は極小で実務上影響ありません。

### 丸め

- `formatContrastRatio`: 小数 2 桁（`ratio.toFixed(2)`）
- `formatLuminance`: 小数 3 桁（`luminance.toFixed(3)`）

判定は丸める前の浮動小数点値を使うため、表示上「4.50：1」でも内部値が 4.4999… なら `AAA` には届きません。

## 6. 参考リンク

- [WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG21/#contrast-minimum)
- [WCAG 2.1 Success Criterion 1.4.6 Contrast (Enhanced)](https://www.w3.org/TR/WCAG21/#contrast-enhanced)
- [WCAG 2.0 relative luminance definition](https://www.w3.org/TR/WCAG20/#relativeluminancedef)
- [CIEDE2000 Color-Difference Formula (Sharma, Wu, Dalal 2005)](http://www2.ece.rochester.edu/~gsharma/ciede2000/)
