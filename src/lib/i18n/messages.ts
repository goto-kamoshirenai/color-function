/**
 * UI 文言辞書（ja / en）。
 * - ja を正とし、en は MessageKey 網羅を型で強制する。
 * - プレースホルダは {name} 形式。translate() で置換する。
 */
export type Locale = "ja" | "en";

const JA = {
  // 共通
  "common.cancel": "キャンセル",
  "common.close": "閉じる",
  "common.delete": "削除",

  // ヘッダー
  "app.tagline": "色彩定量解析",
  "theme.toDark": "ダークモードに切替",
  "theme.toLight": "ライトモードに切替",

  // カラーコード表示形式・コピー
  "format.label": "カラーコードの表示形式",
  "colorcode.copy": "クリックでコピー",
  "colorcode.copyAria": "{code} をコピー",

  // トースト
  "toast.add": "追加: {hex}",
  "toast.update": "更新: {hex}",
  "toast.remove": "削除: {hex}",
  "toast.accent": "アクセントに設定: {hex}",
  "toast.clear": "すべての色を消去しました",
  "toast.copy": "コピー: {text}",

  // 全消去の確認
  "confirm.title": "すべての色を消去しますか？",
  "confirm.body":
    "パレットの全 {count} 色が削除されます。この操作は元に戻せません。",
  "confirm.ok": "消去する",

  // カラーピッカー
  "picker.addTitle": "色を追加",
  "picker.editTitle": "色を編集",
  "picker.hex": "HEX 値",
  "picker.hexError": "#RRGGBB 形式（6桁の16進数）で入力してください",
  "picker.format": "形式 / Format",
  "picker.hue": "H 色相",
  "picker.sat": "S 彩度",
  "picker.val": "V 明度",
  "picker.lightness": "L 明度",
  "picker.red": "R 赤",
  "picker.green": "G 緑",
  "picker.blue": "B 青",
  "picker.add": "追加",
  "picker.apply": "適用",

  // モード切替
  "mode.unit": "単位 / Unit",
  "mode.view": "観点 / View",
  "unit.single": "単色",
  "unit.pair": "ペア",
  "unit.palette": "パレット",
  "view.verify": "検証",
  "view.design": "設計",

  // パレットバー
  "palette.empty": "NO SWATCHES — ＋ で追加",
  "palette.add": "色を追加",
  "palette.count": "{count} 色",
  "palette.clear": "すべて消去",
  "palette.collapse": "パレットを折りたたむ",
  "palette.expand": "パレットを展開",

  // スウォッチ
  "swatch.select": "色 {n} {hex}{badge} を選択",
  "swatch.selectTitle": "クリックで選択 / ダブルクリックで編集",
  "swatch.remove": "色 {n} を削除",
  "swatch.accent": "色 {n} をアクセントに設定",
  "swatch.accentTitle": "アクセントに設定（画面の差し色に反映）",

  // ヘルプ
  "help.aria": "{title} の説明",
  "help.guide": "目安 / Guide",

  // 参考資料
  "refs.aria": "{title} の参考資料",
  "refs.title": "参考資料",
  "refs.note": "リンクは外部サイトを新しいタブで開きます",
  "refs.viewAll": "すべての資料を見る",

  // 座学・ベンチツール（/learn）
  "learn.open": "座学・ベンチツールを開く",
  "learn.title": "座学・ベンチツール",
  "learn.lead":
    "色を定量的に扱うための背景知識と、検証に使える外部ツールのコレクション。",
  "learn.back": "ツールに戻る",
  "learn.byTopic": "指標別リファレンス",
  "learn.articles": "記事・読み物",
  "learn.books": "書籍",
  "learn.tools": "ベンチツール",
  "learn.affiliateNote":
    "書籍は Amazon 検索へのリンクです（アフィリエイト/PR を含む場合があります）",

  // カード共通の案内
  "card.empty": "色がありません — 下の ＋ から追加してください",
  "card.needPair": "ペアには2色以上が必要です — 下の ＋ から色を追加",
  "card.needMatrix": "マトリクスには2色以上が必要です — 下の ＋ から色を追加",

  // カード: 色値
  "card.value.title": "色値",
  "card.value.copyHint": "CLICK TO COPY — 値をクリックでコピー",

  // カード: HSV
  "card.hsv.title": "HSV",
  "card.hsv.h": "H · 色相",
  "card.hsv.s": "S · 彩度",
  "card.hsv.v": "V · 明度",

  // カード: 相対輝度
  "card.lum.title": "相対輝度",
  "card.lum.vsWhite": "対 白",
  "card.lum.vsBlack": "対 黒",

  // カード: 色相環
  "card.wheel.title": "色相環",
  "card.wheel.aria":
    "色相環。角度が色相、中心からの距離が鮮やかさ（彩度×明度）を表し、パレット各色の位置をマーカーで示す",

  // カード: 最寄り色名
  "card.name.title": "最寄り色名",
  "card.name.loading": "辞書を読み込み中…",
  "card.name.deltaE": "色差 ΔE",

  // カード: WCAG コントラスト比
  "card.contrast.title": "WCAG コントラスト比",
  "card.contrast.verdictAAA": "AAA 準拠",
  "card.contrast.verdictAA": "AA 準拠",
  "card.contrast.verdictAALarge": "大字のみ AA",
  "card.contrast.verdictFail": "不適合",
  "card.contrast.normalAA": "通常テキスト AA",
  "card.contrast.normalAAA": "通常テキスト AAA",
  "card.contrast.largeAA": "大きな文字 AA",
  "card.contrast.largeAAA": "大きな文字 AAA",
  "card.contrast.preview": "テキスト可読性プレビュー / Preview",
  "card.contrast.swap": "入替",
  "card.contrast.sampleHeading": "大きな見出しテキスト 24px Bold",
  "card.contrast.sampleBody":
    "通常の本文テキストです。コントラスト比 {ratio}:1 でこの組み合わせが読みやすいかを確認できます。",
  "card.contrast.sampleCaption":
    "小さな注釈テキスト 12px — 細部の可読性をチェック。",

  // カード: 色差 ΔE
  "card.deltae.title": "色差 ΔE",
  "card.deltae.l0": "ほぼ識別不能",
  "card.deltae.l1": "訓練された目で識別",
  "card.deltae.l2": "一見して違う",
  "card.deltae.l3": "明確に別色",
  "card.deltae.l4": "非常に大きな差",

  // カード: 色覚シミュレーション
  "card.cvd.title": "色覚シミュレーション",
  "card.cvd.protan": "P型 (1型)",
  "card.cvd.deutan": "D型 (2型)",
  "card.cvd.tritan": "T型 (3型)",
  "card.cvd.sample": "サンプル文字 Ag",

  // カード: コントラスト比マトリクス
  "card.cmatrix.title": "コントラスト比マトリクス",
  "card.cmatrix.sr":
    "パレット全色の総当たりコントラスト比の表。行と列の交点が2色の比で、4.5以上はAA合格として太字で強調されます。",

  // カード: 色差 ΔE マトリクス
  "card.dmatrix.title": "色差 ΔE マトリクス",
  "card.dmatrix.sr":
    "パレット全色の総当たり色差(CIEDE2000)の表。値が10未満のペアは紛らわしい近さとして太字で強調されます。",

  // カード: 色相分布
  "card.huedist.title": "色相分布",
  "card.huedist.aria":
    "色相分布。0°から360°の色相帯の上にパレット各色の位置をマーカーで示す",
  "card.huedist.entropy": "色相エントロピー",

  // カード: 調和スキーム生成
  "card.harmony.title": "調和スキーム生成",
  "card.harmony.loading": "調和ルールを読み込み中…",
  "card.harmony.hint": "クリックでパレットに追加",
  "card.harmony.add": "{label}の色 {hex} をパレットに追加",

  // カード: トーン展開
  "card.tone.title": "トーン展開",
  "card.tone.add": "トーン {step} {hex} をパレットに追加",

  // カード: 色相シフト
  "card.hueshift.title": "色相シフト",
  "card.hueshift.add": "色相シフト {offset} {hex} をパレットに追加",

  // スプラッシュ
  "splash.aria": "起動アニメーション（クリックでスキップ）",
  "splash.skip": "起動アニメーションをスキップ",
} as const;

export type MessageKey = keyof typeof JA;

const EN: Record<MessageKey, string> = {
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.delete": "Delete",

  "app.tagline": "Quantitative Color Analysis",
  "theme.toDark": "Switch to dark mode",
  "theme.toLight": "Switch to light mode",

  "format.label": "Color code format",
  "colorcode.copy": "Click to copy",
  "colorcode.copyAria": "Copy {code}",

  "toast.add": "Added: {hex}",
  "toast.update": "Updated: {hex}",
  "toast.remove": "Removed: {hex}",
  "toast.accent": "Accent set: {hex}",
  "toast.clear": "All colors cleared",
  "toast.copy": "Copied: {text}",

  "confirm.title": "Clear all colors?",
  "confirm.body":
    "All {count} colors in the palette will be deleted. This action cannot be undone.",
  "confirm.ok": "Clear",

  "picker.addTitle": "Add Color",
  "picker.editTitle": "Edit Color",
  "picker.hex": "HEX value",
  "picker.hexError": "Enter a #RRGGBB value (6 hex digits)",
  "picker.format": "Format",
  "picker.hue": "H Hue",
  "picker.sat": "S Saturation",
  "picker.val": "V Value",
  "picker.lightness": "L Lightness",
  "picker.red": "R Red",
  "picker.green": "G Green",
  "picker.blue": "B Blue",
  "picker.add": "Add",
  "picker.apply": "Apply",

  "mode.unit": "Unit",
  "mode.view": "View",
  "unit.single": "Single",
  "unit.pair": "Pair",
  "unit.palette": "Palette",
  "view.verify": "Verify",
  "view.design": "Design",

  "palette.empty": "NO SWATCHES — add with ＋",
  "palette.add": "Add color",
  "palette.count": "{count} colors",
  "palette.clear": "Clear all",
  "palette.collapse": "Collapse palette",
  "palette.expand": "Expand palette",

  "swatch.select": "Select color {n} {hex}{badge}",
  "swatch.selectTitle": "Click to select / double-click to edit",
  "swatch.remove": "Remove color {n}",
  "swatch.accent": "Set color {n} as accent",
  "swatch.accentTitle": "Set as accent (used as the UI accent color)",

  "help.aria": "About {title}",
  "help.guide": "Guide",

  "refs.aria": "References for {title}",
  "refs.title": "References",
  "refs.note": "Links open external sites in a new tab",
  "refs.viewAll": "View all references",

  "learn.open": "Open learning & bench tools",
  "learn.title": "Learning & Bench Tools",
  "learn.lead":
    "Background knowledge for quantitative color work, plus external tools for verification.",
  "learn.back": "Back to the tool",
  "learn.byTopic": "References by Metric",
  "learn.articles": "Articles & Reading",
  "learn.books": "Books",
  "learn.tools": "Bench Tools",
  "learn.affiliateNote":
    "Book entries link to Amazon search (may contain affiliate/PR links)",

  "card.empty": "No colors — use ＋ below to add one",
  "card.needPair": "A pair needs at least 2 colors — add more with ＋ below",
  "card.needMatrix":
    "The matrix needs at least 2 colors — add more with ＋ below",

  "card.value.title": "Color Value",
  "card.value.copyHint": "CLICK TO COPY",

  "card.hsv.title": "HSV",
  "card.hsv.h": "H · Hue",
  "card.hsv.s": "S · Saturation",
  "card.hsv.v": "V · Value",

  "card.lum.title": "Relative Luminance",
  "card.lum.vsWhite": "vs White",
  "card.lum.vsBlack": "vs Black",

  "card.wheel.title": "Hue Wheel",
  "card.wheel.aria":
    "Hue wheel. Angle is hue, distance from center is chroma (saturation × value); markers show each palette color.",

  "card.name.title": "Nearest Color Name",
  "card.name.loading": "Loading dictionary…",
  "card.name.deltaE": "ΔE difference",

  "card.contrast.title": "WCAG Contrast Ratio",
  "card.contrast.verdictAAA": "AAA compliant",
  "card.contrast.verdictAA": "AA compliant",
  "card.contrast.verdictAALarge": "AA large text only",
  "card.contrast.verdictFail": "Fail",
  "card.contrast.normalAA": "Normal text AA",
  "card.contrast.normalAAA": "Normal text AAA",
  "card.contrast.largeAA": "Large text AA",
  "card.contrast.largeAAA": "Large text AAA",
  "card.contrast.preview": "Text Readability Preview",
  "card.contrast.swap": "Swap",
  "card.contrast.sampleHeading": "Large heading text 24px Bold",
  "card.contrast.sampleBody":
    "Normal body text. Check how readable this combination is at a {ratio}:1 contrast ratio.",
  "card.contrast.sampleCaption":
    "Small caption text 12px — check fine-detail readability.",

  "card.deltae.title": "Color Difference ΔE",
  "card.deltae.l0": "Nearly indistinguishable",
  "card.deltae.l1": "Visible to a trained eye",
  "card.deltae.l2": "Different at a glance",
  "card.deltae.l3": "Clearly different colors",
  "card.deltae.l4": "Very large difference",

  "card.cvd.title": "Color Vision Simulation",
  "card.cvd.protan": "Protan",
  "card.cvd.deutan": "Deutan",
  "card.cvd.tritan": "Tritan",
  "card.cvd.sample": "Sample text Ag",

  "card.cmatrix.title": "Contrast Ratio Matrix",
  "card.cmatrix.sr":
    "Table of pairwise contrast ratios for all palette colors. Each cell is the ratio of two colors; values of 4.5 or higher pass AA and are shown in bold.",

  "card.dmatrix.title": "ΔE Difference Matrix",
  "card.dmatrix.sr":
    "Table of pairwise color differences (CIEDE2000) for all palette colors. Pairs below 10 are confusably close and shown in bold.",

  "card.huedist.title": "Hue Distribution",
  "card.huedist.aria":
    "Hue distribution. Markers show each palette color on a 0°–360° hue strip.",
  "card.huedist.entropy": "Hue Entropy",

  "card.harmony.title": "Harmony Schemes",
  "card.harmony.loading": "Loading harmony rules…",
  "card.harmony.hint": "click to add to the palette",
  "card.harmony.add": "Add {label} color {hex} to the palette",

  "card.tone.title": "Tone Scale",
  "card.tone.add": "Add tone {step} {hex} to the palette",

  "card.hueshift.title": "Hue Shift",
  "card.hueshift.add": "Add hue shift {offset} {hex} to the palette",

  "splash.aria": "Intro animation (click to skip)",
  "splash.skip": "Skip intro animation",
};

const MESSAGES: Record<Locale, Record<MessageKey, string>> = {
  ja: JA,
  en: EN,
};

export type MessageParams = Record<string, string | number>;

/** ロケールとキーから文言を解決し、{name} プレースホルダを置換する。 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: MessageParams,
): string {
  let msg = MESSAGES[locale][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      msg = msg.replaceAll(`{${name}}`, String(value));
    }
  }
  return msg;
}

/**
 * 現在のロケール（<html lang> を真実の源とする）。
 * ペイント前スクリプトが localStorage / ブラウザ言語から lang を確定する。
 * SSR・テスト等で未設定の場合は ja。
 */
export function getLocale(): Locale {
  if (typeof document === "undefined") return "ja";
  return document.documentElement.lang === "en" ? "en" : "ja";
}
