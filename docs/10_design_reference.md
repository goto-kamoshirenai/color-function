# 10. デザインリファレンス（モック基準）

> ステータス: ドラフト / 最終更新: 2026-06-10
> 関連: [デザインブリーフ](./09_design_brief.md) / [データモデル](./05_data_model_and_card_contract.md) / [静的アセット](./06_static_assets_schema.md) / [計算仕様](./07_card_calculation_specs.md)

## 0. 位置づけ

リポジトリ直下の **`Color Follows Function.html`** が確定デザインモック（自己展開バンドル、ブラウザで直接閲覧可）。
これは設計ドキュメント 01–09 の内容をほぼ網羅した**完動プロトタイプ**であり、以降の実装は**これを視覚・挙動の基準（source of truth）**とする。
本書はモックから抽出した確定仕様と、既存ドキュメント（特に 05/06/07）との**差分・要判断点**をまとめる。

> モックは React 風の単一コンポーネント（`DCLogic`）で、色計算・状態・全カード・ピッカー・確認・ヘルプを内包する。

---

## 1. デザイントークン（確定）

そのまま Tailwind テーマ（CSS変数）に移植する。無彩色中心で「UIクロムは中立」（[09 §2](./09_design_brief.md)）を満たす。

```css
[data-theme="light"] {
  --bg:#FAFAF9; --surface:#FFFFFF; --surface-2:#F3F3F1; --surface-3:#ECECEA;
  --border:#E4E3E0; --border-strong:#C8C7C3;
  --text:#1A1A18; --text-2:#6C6B66; --text-3:#9C9B95; --ring:#1A1A18;
}
[data-theme="dark"] {
  --bg:#151513; --surface:#1D1D1B; --surface-2:#262623; --surface-3:#2F2F2B;
  --border:#33332F; --border-strong:#4A4A44;
  --text:#F3F2EE; --text-2:#A2A19A; --text-3:#6F6E68; --ring:#F3F2EE;
}
```

- **フォント**: UI＝**Archivo**（sans）/ 数値・HEX＝**Geist Mono**（mono）。数値はモノで計測器的トーンを出す。
- **角丸**: 主に 6–10px（カード/ボタン）、小要素 3–5px、モーダル 20px。
- **フォーカス**: `outline:2px solid var(--ring); outline-offset:2px`（キーボード可視・[09 §2-2]）。
- **アニメーション**: `cffIn`（出現: opacity+translateY 6px）、`cffToast`（トースト）。控えめ。
- **選択色**: `::selection { background:var(--text); color:var(--bg); }`。

---

## 2. 状態モデル（モック準拠）

```ts
state = {
  theme: 'light' | 'dark',
  unit: 'single' | 'pair' | 'palette',      // 単位
  perspective: 'verify' | 'design',         // 観点（docでは view）
  palette: string[],                         // HEX大文字の配列（既定5色）
  selected: number,                          // 単色フォーカス index
  fg: number, bg: number,                    // ペアの前景/背景 index
  picker: { open, index, isNew, draftH, draftS, draftV, hexInput },
  confirmOpen, helpOpen, helpKey, toast,
}
```

- **既定値**: palette = `#1F2933 #2D6CDF #E4572E #1B998B #E8C547`、起動モードは **pair × verify**、fg=0 / bg=4。
- [05 §2](./05_data_model_and_card_contract.md) との対応: `view` ⇄ `perspective`、`roles.fg/bg` ⇄ `fg/bg`（index 方式）、`selection` ⇄ `selected`。
  実装では 05 の **id ベース**（color.id）を踏襲しつつ、モックの index 挙動を再現する（並べ替え・削除で安定するよう id 採用）。

### 選択・編集の挙動（モック準拠）
- スウォッチクリック: pair なら「bgをクリック→fg/bg入替」「他をクリック→fgに設定」、single/palette なら selected 設定。
- 各スウォッチに編集（ピッカー起動）・削除。削除時は selected/fg/bg を範囲内に補正。
- 「＋」追加はピッカーを新規モード（既定 H210/S70/V60）で開く。

---

## 3. URL共有フォーマット（モック準拠 → 05を更新）

```
#p=1F2933,2D6CDF,E4572E,1B998B,E8C547
```
- **ハッシュ** `#p=` に **`#`抜きHEXをカンマ連結・大文字**。読込時に検証（6桁HEXのみ採用）。
- [05 §4](./05_data_model_and_card_contract.md) は `-` 区切り・searchParams を案としていたが、**モックのカンマ＋ハッシュ方式を採用**する。
- 実装は nuqs ではなく **ハッシュ同期**（モック同様）か、nuqs のハッシュ対応を検討（[08](./08_tech_stack.md) §7 に追記事項）。
- mode の URL 反映は将来拡張（モックは palette のみ載せる）。

---

## 4. カードインベントリ（モード別・確定）

メイン領域は `unit × perspective` でカードを出し分ける（モックの `showSingle/Pair/Palette/Design`）。

| モード | カード | 内容 |
|--------|--------|------|
| 単色 × 検証 | 色値 / HSV / 相対輝度 / 色相環 / 最寄り色名 | HEX·RGB·HSL·HSV（クリックでコピー）/ HSVメーター / 相対輝度＋対白·対黒 / 色相環(角度=色相,距離=彩度) / 最寄り色名＋ΔE |
| ペア × 検証 | WCAGコントラスト比 / 色差ΔE / 色覚シミュレーション | 比＋AA/AAAバッジ＋FG/BG入替＋テキスト可読性プレビュー / ΔE値＋バー＋ラベル / P·D·T型の見え方＋各コントラスト |
| パレット × 検証 | コントラスト比マトリクス / 色差ΔEマトリクス / 色相分布 | 総当たり比(太字=AA合格) / 総当たりΔE / 色相0–360°軸の分布 |
| 設計（単位共通） | 調和スキーム生成 / トーン展開 | 補色·類似·トライアド·スプリット補色（クリックで追加）/ 明度5段階の濃淡（クリックで追加） |

- 各カードに **ヘルプ（?）**を持つ（[09 §5]）。ヘルプ文言はモック `helpMap` に確定済み（13指標）。
- カードは [05 §6](./05_data_model_and_card_contract.md) の `CardDef` レジストリに移植し、`appliesTo` で上表を表現する。

---

## 5. インタラクション仕様（モック準拠）

- **コピー**: 値クリックで `navigator.clipboard` ＋ トースト（1.6秒）。
- **共有**: `share()` が `#p=...` を `history.replaceState` し URL をコピー。
- **追加/編集ピッカー**: HSVスライダー（H0–360/S·V0–100）＋HEX入力の双方向同期。`適用`/`追加`/`削除`/`キャンセル`。
- **すべて消去**: 確認ダイアログ（「元に戻せません」）→ パレット空に。空状態は「色がありません — ＋ で追加」。
- **テーマ切替**: ☾/☀ トグル。
- **ヘルプ**: 指標キーごとにモーダル（title / body / 目安 guide）。

---

## 6. 既存ドキュメントとの差分・要判断点

モックは**プロトタイプ精度**で実装されており、05/06/07 の厳密仕様と一部で異なる。実装時にどちらに寄せるか判断する。

| 項目 | モック実装 | ドキュメント仕様 | 決定（2026-06-10） |
|------|-----------|----------------|------|
| 色差ΔE | ΔE76（Lab ユークリッド距離） | [07 §7](./07_card_calculation_specs.md) は CIEDE2000 | ✅ **CIEDE2000 を採用**（精度優先） |
| 色覚シミュレーション | 固定3×3行列・sRGB空間で適用 | [06 §5](./06_static_assets_schema.md) は Machado2009・線形RGB | ✅ **Machado2009・線形RGB を採用**（精度優先） |
| 調和スキーム | HSV色相回転 | [06 §4.1](./06_static_assets_schema.md) は OKLCH色相推奨 | ✅ **OKLCH色相回転を採用**（知覚均等） |
| sRGB→XYZ係数 | 丸め（0.4124 等） | [07 §7.1] は高精度（0.4124564 等） | ✅ 高精度に寄せる（無害） |
| 静的アセット | コード内ハードコード（色名18件等） | [06](./06_static_assets_schema.md) は外部JSON | ✅ JSON化（モックは内蔵） |
| 状態キー | index 方式 | [05](./05_data_model_and_card_contract.md) は id 方式 | ✅ id 方式（安定性） |

> **確定方針**: UI/挙動/トークン/カード構成は**モックに完全準拠**。計算の中身（ΔE/CVD/調和）は**精度の高いドキュメント仕様（CIEDE2000 / Machado2009 / OKLCH）に差し替え**る。
> 数値ラベルの閾値（ΔE「ほぼ同一」等）は採用式（CIEDE2000）に合わせて**再較正**する。

---

## 7. 実装へのマッピング

| モック要素 | 実装先（[08 §6](./08_tech_stack.md)） |
|-----------|----------------|
| デザイントークン（§1） | Tailwind テーマ（CSS変数）＋ next/font(Archivo, Geist Mono) |
| 色計算（color math） | `core/color/*`（[07](./07_card_calculation_specs.md) の式で実装、参照値テスト） |
| state（§2） | Zustand ストア（id ベース化） |
| URL同期（§3） | `lib/`（ハッシュ `#p=` 同期） |
| カード（§4） | `features/cards/`（CardDef レジストリ＋ appliesTo） |
| ピッカー/確認/ヘルプ/トースト | `components/`（Radix Dialog/Tooltip ベース） |
| 色名18件 等 | `public/data/`（[06](./06_static_assets_schema.md) のJSONへ外部化） |

---

## 8. 未決事項（次に詰める）

1. ~~§6の3つの計算差分~~ → **確定済み**（CIEDE2000 / Machado2009 / OKLCH）。ΔEラベル閾値の再較正は実装時。
2. URL同期の実装手段（自前ハッシュ vs nuqs ハッシュ対応）。
3. モック原本の配置（リポジトリ直下のまま vs `docs/` か `design/` へ移動）。
4. スプリント1の実装着手点（`core/color` ＋ トークン ＋ パレットバーの骨格）。
5. モジュール詳細設計（`core/color` 関数シグネチャ・ストア・カードレジストリ・アセットローダ）→ [11](./11_implementation_plan.md)。
