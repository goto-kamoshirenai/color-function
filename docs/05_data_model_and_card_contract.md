# 05. データモデルとカード共通契約

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [UI骨格](./03_ui_skeleton.md) / [カードカタログ](./04_card_catalog.md) / [制約・前提](./02_constraints.md)

カードカタログ（04）を「実装できる形」にするための土台。
**色の正準表現・グローバル状態・状態のエンコード・計算レイヤ・カード共通契約**を定義する。
ここが固まると、各カードは「契約に沿った部品を1つ足す」だけで増やせる（コンセプト「考え得る限り可視化」と整合）。

---

## 1. 色の正準表現（Color）

すべての指標は1つの正準表現から算出する。状態には**派生値を持たず、必要時に計算する**（[UI骨格 §2](./03_ui_skeleton.md)）。

```ts
type Color = {
  id: string; // 安定識別子（並べ替え・役割割当・差分追跡のキー）
  srgb: RGB; // 正準表現: sRGB（0–255 または 0–1 に正規化、実装で統一）
  alpha?: number; // 0–1。省略時は 1（不透明）
  // 表示名・色名ヒット・各色空間値・指標はすべて srgb から算出する派生情報
};

type RGB = { r: number; g: number; b: number };
```

### 正準表現の決定と根拠

- **正準＝sRGB**。理由:
  - Web の既定色域であり、入出力（HEX/CSS）と往復しやすい。
  - URL エンコードがコンパクト（[制約 §2.3](./02_constraints.md)）。
- **精度トレードオフ**: OKLCH 等での生成・色差計算は sRGB から都度変換する。
  sRGB は 8bit だと丸め誤差が出るため、**内部計算は浮動小数（0–1 の RGB または変換後の空間）で行い、保存・URL のみ HEX に丸める**。
- 将来 P3 等の広色域対応が必要になった場合は `Color` に色域タグを足して拡張する（現時点は sRGB 固定）。

---

## 2. グローバル状態モデル（確定版）

[UI骨格 §2](./03_ui_skeleton.md) を精緻化したもの。

```ts
type Unit = "single" | "pair" | "palette"; // 単色 / ペア / パレット
type View = "validate" | "design"; // 検証 / 設計

type AppState = {
  palette: Color[]; // 唯一の真実の源（順序つき）
  selection: string[]; // フォーカス中の color.id 群（単位で意味が変わる §3）
  roles: { fg?: string; bg?: string }; // ペア時の役割割当（前景/背景）
  mode: { unit: Unit; view: View }; // 2軸モード
};
```

- 日本語ラベル（単色/検証 等）は表示層で対応づける。状態は安定した英語キーで持つ。
- `palette` と `mode` は**URL エンコード対象**。`selection` / `roles` は UI 都合の状態として URL に載せるかは任意（§4）。

---

## 3. 選択モデルの遷移規則

[UI骨格 §4](./03_ui_skeleton.md) の引き継ぎを具体化する。単位を切り替えても色・選択は可能な限り保持する。

| 遷移               | selection / roles の扱い                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| → single           | selection を先頭1色に縮約。なければ palette[0]                                                   |
| → pair             | フォーカス色を `fg` に、次の色（なければ palette 内の対照色）を `bg` に。2色未満なら不足分を促す |
| → pair → palette   | roles はハイライト用に退避。評価対象は palette 全体                                              |
| palette 内で色削除 | selection / roles から当該 id を除去し、規則で再充当                                             |

> 単位変更で「色や選択を失わない」ことを不変条件とする（コンセプト §5.2 の地続き性）。

---

## 4. 状態のエンコード（DBレス共有）

[制約 §2.3 / §5](./02_constraints.md) に従い、DB を介さず共有・復元する。

### URL（共有リンク）

- `palette`: `#` を除いた HEX を区切り連結（例 `p=ff0044-1e90ff-222831`）。
- `mode`: 短縮コード（例 `m=pair.validate`）。
- アルファありの色は `ff0044cc` のように8桁で表現。
- 設計目標: 数色のパレットが**URLとして手で扱える長さ**に収まること。

### localStorage（履歴・一時保存・任意）

- 直近の作業状態、最近使った色、ユーザー定義テンプレートなど。
- サーバには送らない（[制約 §4](./02_constraints.md) プライバシー）。

> エンコードの厳密フォーマット（バージョニング・後方互換）は実装着手時に確定。スキーマ変更に備え `v=` を持たせる余地を残す。

---

## 5. 計算レイヤの分離

指標計算は **React から独立した純粋関数モジュール**に置く。テスト可能で、カード間で再利用できる。

```
core/color/            ← フレームワーク非依存の純粋ロジック
  convert.ts           ← sRGB ⇔ HSL/HSV/HWB/LAB/LCH/OKLab/OKLCH/XYZ
  contrast.ts          ← WCAG コントラスト比 / 相対輝度 / APCA
  difference.ts        ← CIEDE2000 / ΔE76·94 / OKLab 距離
  cvd.ts               ← 色覚シミュレーション（P/D/T）
  harmony.ts           ← 調和スキーム生成・判定
  stats.ts             ← エントロピー / 分布 / 暖寒バランス
  name.ts              ← 色名辞書ルックアップ（最近傍）
```

- カードは `core/color/*` を呼ぶだけ。**UIに計算ロジックを書かない**。
- 静的アセット（[制約 §2.2](./02_constraints.md)）はこの層から参照する（辞書・WCAG基準・調和ルール・色覚プロファイル）。
- 既存の検討（外部ライブラリの利用可否：culori 等）は実装時に評価。まずは契約を固める。

---

## 6. カード共通契約（Card Contract）

[UI骨格 §5](./03_ui_skeleton.md) の `appliesTo` を実装可能な契約に拡張する。
**カードを1つ足して登録するだけ**で可視化軸が増える構造。

```ts
type CardCategory =
  | "space"
  | "luminance"
  | "contrast"
  | "difference"
  | "cvd"
  | "stats"
  | "harmony"
  | "generate"
  | "naming"
  | "preview"
  | "gamut"
  | "export";

type ModeMatch = { unit: Unit; view: View };

type CardContext = {
  palette: Color[];
  selection: string[];
  roles: { fg?: string; bg?: string };
  apply: (intent: ColorChangeIntent) => void; // 編集は中央アクション経由（§7）
};

type CardDef = {
  key: string; // 一意キー（例 'wcag-contrast'）
  title: string; // 表示名
  category: CardCategory; // カタログ04の分類
  appliesTo: ModeMatch[]; // 表示されるモードの組（複数可）
  help: HelpRef; // 解説の相棒（カタログ M）
  // 描画: CardContext を購読し、core/color を使って算出・表示する
  // render(ctx: CardContext): UI
};
```

### メイン領域のレンダリング規則

1. 現在の `mode` に `appliesTo` が一致するカードを抽出。
2. `category` の規定順（04のA→M順）で縦に並べる。
3. 各カードは `CardContext` を購読し、状態変化でリアルタイム再描画する。

### カード追加の手順（拡張契約）

1. `core/color/*` に計算関数を足す（必要なら）。
2. `CardDef` を1つ書いて**レジストリに登録**。
3. レイアウトは不変。`appliesTo` がモードへの所属を決める。

> これにより「OKLCHカードを足す」「APCAカードを足す」等が**局所変更**で済む。

---

## 7. 編集の中央アクション（再掲・契約化）

[UI骨格 §6](./03_ui_skeleton.md) の `applyColorChange` を型として固定する。

```ts
type ColorChangeIntent =
  | { kind: "set"; id: string; srgb: RGB; alpha?: number } // 1色変更
  | { kind: "add"; srgb: RGB; alpha?: number } // 追加
  | { kind: "remove"; id: string } // 削除
  | { kind: "reorder"; order: string[] } // 並べ替え
  | { kind: "replaceAll"; palette: Color[] }; // 一括置換（破壊的）

// apply(intent): 破壊的判定 → 必要なら確認ダイアログ → palette 更新 → URL同期
```

- すべての編集入口（スウォッチ/カード/数値入力）は `apply(intent)` に集約。
- **破壊的ガード**: `replaceAll` / 全 `remove` 等は確認ダイアログ対象の候補（既定は即時反映）。
- 一元化により**取消・履歴・URL同期**を一箇所で扱える。

---

## 8. 第1スプリントの最小セット（提案）

承認済みMVP候補（04）から、**最初の1スプリントで動かす最小縦切り**を抜き出す。
狙いは「下部パレットバー＋メイン＝カード」の骨格を、少数のカードで端から端まで通すこと。

### スプリント1（骨格＋単色・ペアの検証）

- 基盤: パレットバー（スウォッチ/モード2軸トグル/追加） + メイン領域 + `apply` + URL同期
- 計算: `convert` / `contrast` / `difference` の最小実装
- カード（検証）:
  - 単色: **RGB/HEX・HSL・HSV**（色空間値）/ **相対輝度** / 対白・対黒コントラスト
  - ペア: **WCAGコントラスト比** / **CIEDE2000色差** / テキスト可読性プレビュー
- 横断: 値コピー / 共有リンク / 指標ヘルプ（最小）

> ここまでで「色を入れる→数値で検証する→URLで共有する」が一周する。
> 以降のスプリントで OKLCH・色覚シミュレーション・調和生成・パレット系マトリクス・設計モードを段階追加する。

---

## 9. 未決事項（次に詰める）

1. **静的アセットのスキーマ定義**（色名辞書・WCAG基準・調和ルール・色覚プロファイル）。データ依存カードの前提。
2. **各MVPカードの計算仕様**（使用色空間・丸め桁・基準値の出典）を指標ごとに確定。
3. **URLエンコードの厳密フォーマット**とバージョニング方針。
4. カラーライブラリの採否（自前実装 vs culori 等）の評価。
5. スプリント1の**画面ワイヤー**（パレットバー具体UI／カードの最小ビジュアル）。
