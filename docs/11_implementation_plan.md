# 11. 実装ロードマップ＆モジュール設計

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [データモデル](./05_data_model_and_card_contract.md) / [静的アセット](./06_static_assets_schema.md) / [計算仕様](./07_card_calculation_specs.md) / [技術選定](./08_tech_stack.md) / [デザインリファレンス](./10_design_reference.md)

実装直前まで設計を詰める。**モジュールの責務・主要シグネチャ**と、**垂直スライスのスプリント計画（DoD付き）**を定義する。
基準は確定モック（[10](./10_design_reference.md)）、計算は精度仕様（CIEDE2000 / Machado2009 / OKLCH）。

---

## 1. ディレクトリ構成（確定）

```
src/
  app/
    layout.tsx            # アプリシェル（テーマ属性・フォント・パレットバー常設）
    page.tsx              # ワークスペース（メイン＝カードスクロール）
    globals.css           # Tailwind＋トークン（CSS変数 [10 §1]）
  core/color/             # 計算レイヤ（フレームワーク非依存・純粋関数）
    types.ts  convert.ts  contrast.ts  difference.ts  cvd.ts  harmony.ts  stats.ts  name.ts
    index.ts              # 公開API
  store/
    useColorStore.ts      # Zustand（palette/selection/mode/picker…）
  features/cards/
    registry.ts           # CardDef レジストリ
    cards/                # 各カード実装（CardValue, CardHSV, CardContrast …）
  components/
    PaletteBar.tsx  Swatch.tsx  ModeToggle.tsx  ColorPicker.tsx
    ConfirmDialog.tsx  HelpPopover.tsx  Toast.tsx  Card.tsx
  lib/
    urlState.ts           # ハッシュ同期（#p=…）
    assets.ts             # 静的アセット読み込み＋zod検証
    clipboard.ts
public/data/              # 静的アセット（[06] のスキーマ）
```

---

## 2. `core/color` — 主要シグネチャ

純粋関数のみ。入出力はプレーン型。culori を内部実装に使ってよいが、公開APIは本書で固定し[07 §10](./07_card_calculation_specs.md)の参照値でテスト。

```ts
// types.ts
export type RGB = { r: number; g: number; b: number };   // 0–255
export type HSL = { h: number; s: number; l: number };
export type HSV = { h: number; s: number; v: number };
export type OKLCH = { l: number; c: number; h: number };
export type LAB = { L: number; a: number; b: number };
export type CvdType = 'protan' | 'deutan' | 'tritan';

// convert.ts
export function parseHex(input: string): RGB | null;     // #rgb/#rrggbb 受理、不正は null
export function toHex(rgb: RGB): string;                  // 小文字 #rrggbb
export function srgbToLinear(c: number): number;          // 0–1
export function linearToSrgb(c: number): number;
export function rgbToHsl(rgb: RGB): HSL;  export function hslToRgb(hsl: HSL): RGB;
export function rgbToHsv(rgb: RGB): HSV;  export function hsvToRgb(hsv: HSV): RGB;
export function rgbToOklch(rgb: RGB): OKLCH; export function oklchToRgb(o: OKLCH): RGB;
export function rgbToLab(rgb: RGB): LAB;                   // 経由: linear→XYZ(D65)→LAB

// contrast.ts
export function relativeLuminance(rgb: RGB): number;       // 0–1
export function contrastRatio(a: RGB, b: RGB): number;     // 1–21
export function judgeWcag(ratio: number, std: ContrastStandard): WcagVerdict;

// difference.ts
export function deltaE2000(a: LAB, b: LAB): number;        // 採用（[07 §7.3]）
export function deltaE76(a: LAB, b: LAB): number;          // 参考・教育用

// cvd.ts  （Machado2009・線形RGBで適用 [06 §5]）
export function simulateCvd(rgb: RGB, type: CvdType, severity: number, profiles: CvdAsset): RGB;

// harmony.ts （OKLCH色相回転 [06 §4.1]）
export function rotateHueOklch(rgb: RGB, deltaDeg: number): RGB;
export function generateScheme(base: RGB, rule: HarmonyRule): RGB[];

// stats.ts
export function paletteEntropy(palette: RGB[]): number;
export function hueDistribution(palette: RGB[]): number[];  // 0–360 上の位置

// name.ts
export function nearestName(rgb: RGB, dict: ColorNameEntry[]): { entry: ColorNameEntry; deltaE: number } | null;
```

- 丸めは**しない**（[07 §1](./07_card_calculation_specs.md)）。表示丸めは UI/カード側。
- 色は内部 0–1 浮動小数で計算し、境界で RGB(0–255)/HEX に変換。

---

## 3. `store/useColorStore` — 状態とアクション

[05 §2](./05_data_model_and_card_contract.md)（id方式）＋[10 §2](./10_design_reference.md)（モック挙動）を統合。

```ts
type Color = { id: string; hex: string };   // hex 正準（大文字）。id は安定キー

type State = {
  theme: 'light' | 'dark';
  unit: 'single' | 'pair' | 'palette';
  view: 'verify' | 'design';                 // モックの perspective
  palette: Color[];
  selectedId: string | null;
  fgId: string | null; bgId: string | null;
  picker: { open: boolean; targetId: string | null; isNew: boolean; h: number; s: number; v: number; hexInput: string };
  confirmOpen: boolean;
  help: { open: boolean; key: string | null };
  toast: string | null;
};

type Actions = {
  toggleTheme(): void;
  setUnit(u): void; setView(v): void;
  selectColor(id): void;                      // pair時は fg/bg 入替ロジック [10 §2]
  apply(intent: ColorChangeIntent): void;     // 中央アクション [05 §7]
  openPicker(targetId | 'new'): void; closePicker(): void; commitPicker(): void;
  askClear(): void; clear(): void;            // 確認ダイアログ経由
  openHelp(key): void; closeHelp(): void;
  showToast(msg): void;
};
```

- **id生成**: `crypto.randomUUID()`（ブラウザ標準）。
- **`apply`** が唯一の palette 変更経路。破壊的 intent（`replaceAll`/全削除）は `askClear`→確認後に実行。
- **URL同期**: `palette` 変更を購読し `lib/urlState` でハッシュへ反映。起動時にハッシュから復元（[10 §3]）。
- **selectColor のペア挙動**: bg をクリック→fg/bg入替、他→fg設定（モック準拠）。

---

## 4. `features/cards` — レジストリ

[05 §6](./05_data_model_and_card_contract.md) の契約を、[10 §4](./10_design_reference.md) の確定カードで具体化。

```ts
type CardDef = {
  key: string;                       // 'wcag-contrast' 等
  title: string;
  category: CardCategory;
  appliesTo: { unit: Unit; view: View }[];
  helpKey: string;                   // helpMap のキー（[10 §4] の13指標）
  Component: React.FC;               // ストアを購読し core/color で算出・描画
};
```

確定レジストリ（モード→カード、[10 §4]）:

| key | モード | helpKey |
|-----|--------|---------|
| `value` | single×verify | value |
| `hsv` | single×verify | hsv |
| `luminance` | single×verify | luminance |
| `hue-wheel` | single×verify | wheel |
| `nearest-name` | single×verify | name |
| `wcag-contrast` | pair×verify | contrast |
| `delta-e` | pair×verify | deltae |
| `cvd` | pair×verify | cvd |
| `contrast-matrix` | palette×verify | cmatrix |
| `delta-matrix` | palette×verify | dmatrix |
| `hue-distribution` | palette×verify | huedist |
| `harmony` | (single/pair/palette)×design | harmony |
| `tone` | (single/pair/palette)×design | tone |

- メイン領域は現在の `unit×view` で `appliesTo` をフィルタし、`category` 順に並べる。

---

## 5. `lib` — URL同期・アセット

```ts
// urlState.ts
export function encodePalette(palette: Color[]): string;     // '#p=1F2933,2D6CDF,…'
export function decodePalette(hash: string): string[] | null;
export function syncToHash(palette: Color[]): void;          // history.replaceState

// assets.ts （zod 検証 [08 必須]）
export async function loadAsset<T>(key: keyof Manifest): Promise<T>;  // fetch→zod parse→cache
export const NamesSchema, StandardsSchema, HarmonyRulesSchema, CvdSchema;  // zod
```

- アセットは [06 §1.3](./06_static_assets_schema.md) の `manifest.json` 経由で遅延取得し、zod で検証。失敗時はカードを無効化（クラッシュさせない）。

---

## 6. スプリント計画（DoD付き）

垂直スライス。各スプリント末に「動くもの」が増える。

| S | 内容 | 主な成果物 | DoD（完了条件） |
|---|------|-----------|----------------|
| **S0** | 基盤scaffold | Next＋Tailwindトークン＋フォント(Archivo/Geist Mono)＋テーマ切替＋ESLint/Prettier/Husky/CI | light/dark でアプリシェルが表示。CI(lint/型/test/build)が緑 |
| **S1** | `core/color`＋テスト | convert/contrast/difference(ΔE2000)/cvd/harmony/stats/name | [07 §10](./07_card_calculation_specs.md) の参照値で vitest 通過。CIEDE2000 は Sharma 34組で照合 |
| **S2** | ストア＋パレットバー | Zustand＋スウォッチ＋2軸トグル＋ピッカー(追加/編集/削除)＋URLハッシュ同期＋コピー/トースト | パレットを編集でき、共有URLで復元。確認ダイアログで全消去 |
| **S3** | 単色×検証カード | 色値/HSV/相対輝度/色相環/最寄り色名（names アセット投入） | 5カードが描画・リアルタイム更新・ヘルプ動作 |
| **S4** | ペア×検証カード | WCAGコントラスト(+テキストプレビュー)/色差ΔE/色覚シミュ（wcag・cvd アセット投入） | 3カード動作。判定が wcag.json 基準と一致 |
| **S5** | パレット×検証カード | コントラスト比マトリクス/色差ΔEマトリクス/色相分布 | 3カード動作。2色未満は空状態表示 |
| **S6** | 設計カード | 調和スキーム(OKLCH)/トーン展開（harmony アセット投入） | クリックでパレットに色追加。OKLCH回転で生成 |
| **S7** | 仕上げ＋a11y | キーボード操作・フォーカス・レスポンシブ・空状態・トースト | @axe-core/playwright が主要画面でクリーン。主要フローの Playwright 緑 |

> MVP の体験（[05 §8](./05_data_model_and_card_contract.md)「色を入れる→検証→共有」）は **S2 終了時点**で一周する。S3 以降は可視化軸の拡充。

---

## 7. 静的アセット投入スケジュール

| アセット | 投入スプリント | 備考 |
|---------|--------------|------|
| `names/*`（色名辞書） | S3 | モックの18色を起点に拡充。CSS/JIS/和色 |
| `standards/wcag.json` | S4 | 閾値は事実データ。S2でも仮値可 |
| `cvd/profiles.json` | S4 | Machado2009 実係数を確定 |
| `harmony/rules.json` | S6 | OKLCH回転前提のオフセット |
| `harmony/templates.json` | S6以降 | テンプレート適用カード（MVP範囲外） |

---

## 8. テスト戦略

| 層 | 道具 | 対象 |
|----|------|------|
| 単体 | Vitest | `core/color`（[07 §10] 参照値・CIEDE2000 標準ペア） |
| コンポーネント | Vitest＋Testing Library＋happy-dom | カード描画・ストア連携 |
| E2E / a11y | Playwright＋@axe-core/playwright | 編集→検証→共有フロー、アクセシビリティ |

---

## 9. 未決事項（実装中に確定）

1. OKLCH 変換の実装手段（culori 依存 vs 自前）と精度確認。
2. mode を URL に載せるか（現状 palette のみ。[10 §3]）。
3. Machado2009 の採用版・強度段階（[06 §5]）。
4. Storybook 導入タイミング（[08 §7]）。
5. モック原本の最終配置（[10 §8-3]）。
6. ΔE ラベル閾値の CIEDE2000 向け再較正値。
