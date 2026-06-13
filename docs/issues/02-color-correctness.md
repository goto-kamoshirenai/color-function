# 02. 色計算の正しさ・堅牢性

> 重大度: 🔴 高 / 🟡 中 / 🟢 低 ｜ 監査日 2026-06-14 ｜ 基準: `docs/07_card_calculation_specs.md`

計算の芯は非常に正確（CIEDE2000 は Sharma 34 組と4桁一致、相対輝度/コントラスト/HSL/HSV は
docs/07 §10 参照値と整合、OKLCH ガマットは単純クランプでなく `clampChroma` を採用、CMYK は
ICCなし近似である旨を日英で明示）。以下は主に**境界・堅牢性・spec整合**の指摘。

## 🐞 不具合

### 🟡 変換関数群が範囲外入力をクランプせず、CMYK で 0除算/NaN を伝播しうる

- **場所**: `src/core/color/convert.ts:230-242`（`rgbToCmyk`）ほか変換関数全般
- **内容**: `parseHex` 経由なら安全だが、内部生成 RGB（負・小数・>255）に対し各変換は入口でクランプしない。`rgbToCmyk` は `1-k` が極小のとき `(1-R-k)/(1-k)` が負/極端値になりうる。
- **改善方針**: 変換の入口で `clamp(v,0,255)` を共通適用、CMYK は `1-k≈0` の早期 return。範囲外入力のテストを追加。

### 🟢 `correlatedColorTemp` が純黒で誤った CCT（≈5520K）を返す

- **場所**: `src/core/color/perception.ts:21-25` ＋ `convert.ts:180-184`（`xyzToXy` は黒で D65 を返す）
- **内容**: 純黒/純白が同じ ≒6500K 付近になり「黒の色温度6500K」が出る。高彩度色は黒体軌跡から外れ McCamy 近似が大きく外れるが妥当性フラグ無し。
- **改善方針**: 無彩・極低輝度・Δuv 大では CCT を `null`/「—」にする妥当域ガード（戻り値型で表現）。

## ⚠️ 課題

### 🟡 `paletteEntropy`/`hueDistribution` が無彩色を色相0°（赤ビン）に集計

- **場所**: `src/core/color/stats.ts:7-30` ＋ `convert.ts:98-123`
- **内容**: `rgbToHsv` の `h`（無彩色では0）を使うため、グレー/白/黒が全部「赤ビン」に入り、docs/07 §1「無彩色は色相不定」に反する。無彩のみで entropy=0、白+黒+赤が赤ビンに偏り過小評価。他関数（`suggestGapFill`/`sortOrder`/`matchScheme`）は `c>=0.03` で除外しており**一貫性も欠く**。
- **改善方針**: 彩度閾値未満を分布から除外、または専用「無彩」ビンを設け、他関数と閾値を揃える。

### 🟡 `matchScheme` のスコアがターゲット被覆を見ず偽陽性を出しうる

- **場所**: `src/core/color/analyze.ts:126-156`
- **内容**: 「各パレット色→最寄りターゲットの平均偏差」だけで算出。全色が base 近傍に固まっていても complementary の `0` 側だけで偏差ゼロ→score 100 になりうる。「全色が1パターンに均等対応」を保証しない。
- **改善方針**: ターゲット側からの双方向マッチ（割当 or 未使用ターゲットへのペナルティ）。偽陽性ケースのテスト追加。

### 🟡 近似探索（nudge/cvdSafe/accent）が厳密な最寄りを保証しない

- **場所**: `src/core/color/suggest.ts:19-43,62-88` / `accent.ts:11-37`
- **内容**: OKLCH の L を固定ステップでグリッド探索し「先に届いた方＝最寄り」とするが厳密最小ΔLの保証なし。L のみ可変で彩度由来でしか届かない色は `reached:false` で打ち切り。`ensureReadableAccent` は明背景固定＋step 符号を一方向固定で、中間輝度背景では逆方向最適でも探索しない。
- **改善方針**: 二分探索化／両方向の最小ステップ比較。`ensureReadableAccent` も両方向探索に。

### 🟢 `mixColors` がガンマ空間でブレンド（知覚的に不正確）

- **場所**: `src/core/color/blend.ts:9-29`
- **内容**: sRGB（ガンマ）で直接 multiply/screen/average。CSS 互換だが、補間方針（線形/OKLab）と不整合（コメントに明記はある）。
- **改善方針**: CSS互換が目的なら明示、設計支援用途なら線形版を別途。

### 🟢 `judgeWcag` の等号境界が未テスト

- **場所**: `src/core/color/contrast.ts:37-48`
- **内容**: `ratio>=4.5` 合格は仕様準拠（生値判定）だが、2桁表示の都合「4.5 表示でも不合格」が起こりうる。`4.5/7/3` ちょうどのテストが無い。
- **改善方針**: `judgeWcag(4.5/7/3)` の境界テストで回帰固定。

### 🟢 `assignRoles` の neutral がコメント（最低彩度）と実装（残り彩度降順の末尾）で乖離

- **場所**: `src/core/color/suggest.ts:201-212`
- **改善方針**: コメントを実装に合わせるか、neutral を全体最低彩度で選び直す。

## ✨ 機能追加・改善案

### 🟡 core/color のテスト穴を埋める

- **場所**: 横断（`*.test.ts`）
- **内容**: 直接テストが薄い/無い分岐: `srgbToLinear/linearToSrgb` の閾値跨ぎ、`oklchToRgb` のガマット外 `clampChroma` 経路、`generateTones` の頭打ち、`apcaContrast` の `loClip`/reverse 符号境界、`suggestGapFill`(c<2→null)、`equalizeLightness`(length<3)、`confusablePairs`/`nearestName` の空・全不正境界。
- **改善方針**: 上記境界・null 分岐にユニットテストを追加。特に `oklchToRgb` は多くの設計支援関数の土台なので既知ガマット外→期待hex の固定値テストを推奨。

### 🟢 CardGamut「印刷近似（CMYK往復）」の限界注記

- **場所**: `convert.ts:230-242` / i18n `card.gamut.print`
- **内容**: ナイーブ CMYK は sRGB へほぼ可逆なので「印刷ガマット外」を実質検出できない。判定材料にならない旨を注記すると誤解防止。

### 🟢 角度/色相の正規化ヘルパを集約

- **場所**: `convert.ts:86,126` / `harmony.ts:10` / `analyze.ts:145` / `stats.ts` ほか
- **内容**: `(((x%360)+360)%360)` と circ-diff が散在。1ヘルパに集約して境界扱いを一元化。

## このトピックの最重要

1. 🟡 `paletteEntropy` が無彩色を色相0°に集計（`stats.ts:7-30`）— 分布カードが体系的に歪む＋他関数と非一貫。
2. 🟡 `matchScheme` の偽陽性（`analyze.ts:126-156`）— 調和判定の信頼性に直結。
3. 🟡 変換関数の範囲外入力ガード欠如（`convert.ts` 全般・特に CMYK の NaN）。
