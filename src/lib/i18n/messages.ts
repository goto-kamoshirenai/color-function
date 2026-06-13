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

  // ナビゲーション
  "nav.home": "ホーム",
  "nav.backHome": "ホームに戻る",

  // 設定メニュー
  "settings.open": "設定",
  "settings.title": "設定",
  "settings.theme": "テーマ",
  "settings.light": "ライト",
  "settings.dark": "ダーク",
  "settings.language": "言語",

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
  "swatch.selectTitle":
    "クリックで選択 / ダブルクリックで編集 / ドラッグ・←→で並べ替え",
  "swatch.remove": "色 {n} を削除",
  "swatch.accent": "色 {n} をアクセントに設定",
  "swatch.accentTitle": "アクセントに設定（画面の差し色に反映）",
  "swatch.reorder": "色 {n} を並べ替え",
  "swatch.reorderTitle": "ドラッグで並べ替え / ←→ キーで移動",
  "swatch.moved": "色を {n} 番目に移動",

  // FG/BG 役割セレクタ（ペア×検証）
  "role.pairLabel": "文字色と背景色",
  "role.pairHint":
    "コントラストは「文字色（FG）と背景色（BG）」の組み合わせで測定します。",
  "role.fgLabel": "文字色",
  "role.bgLabel": "背景色",
  "role.fg": "文字色（FG）を選択",
  "role.bg": "背景色（BG）を選択",
  "role.barRegion": "文字色と背景色（固定表示）",
  "role.barExpand": "文字色と背景色を展開",
  "role.barCollapse": "文字色と背景色を折りたたむ",

  // 初回コーチマーク（配色パレットの導線）
  "coach.title": "ここから操作",
  "coach.body": "色を選んで追加・編集できます",
  "coach.dismiss": "閉じる",

  // ヘルプ
  "help.aria": "{title} の説明",
  "help.guide": "目安 / Guide",

  // 参考資料
  "refs.aria": "{title} の参考資料",
  "refs.title": "参考資料",
  "refs.note": "リンクは外部サイトを新しいタブで開きます",
  "refs.viewAll": "すべての資料を見る",

  // 学習コンテンツ（/learn）
  "learn.open": "学習コンテンツを開く",
  "learn.title": "学習コンテンツ",
  "learn.lead":
    "色を定量的に扱うための背景知識と、検証に使える外部ツールのコレクション。",
  "learn.byTopic": "指標別リファレンス",
  "learn.articles": "記事・読み物",
  "learn.books": "書籍",
  "learn.tools": "ベンチツール",
  "learn.glossary": "用語集",
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

  // カード: 拡張色空間 / 知覚 / 不透明度 / ガマット（単色×検証）
  "card.spaces.title": "拡張色空間",
  "card.spaces.note": "クリックでコピー / CMYK* は ICC なしの近似値",
  "card.perception.title": "知覚明度・色温度",
  "card.perception.gray": "グレー等価",
  "card.perception.temp": "温度感",
  "card.perception.warm": "暖色",
  "card.perception.cool": "寒色",
  "card.perception.neutral": "中立",
  "card.alpha.title": "不透明度",
  "card.alpha.onWhite": "白の上",
  "card.alpha.onBlack": "黒の上",
  "card.gamut.title": "ガマット・出力適合",
  "card.gamut.inGamut": "域内",
  "card.gamut.websafe": "Web セーフ（216色）",
  "card.gamut.safe": "適合",
  "card.gamut.print": "印刷近似（CMYK 往復）",
  "card.gamut.nearest": "最寄りの Web セーフ:",

  // カード: APCA / 色差内訳（ペア×検証）
  "card.apca.title": "APCA コントラスト",
  "card.apca.body": "本文サイズに使用可（|Lc| ≥ 75）",
  "card.apca.large": "大きめの文字に使用可（|Lc| ≥ 60）",
  "card.apca.ui": "太字の大文字・UI 部品まで（|Lc| ≥ 45）",
  "card.apca.fail": "テキスト用途には不足（|Lc| < 45）",
  "card.apca.bodyShort": "本文目安",
  "card.dbreak.title": "色差の内訳",
  "card.dbreak.components": "成分差（FG → BG）",

  // カード: パレット統計・プレビュー（パレット×検証）
  "card.lsdist.title": "明度・彩度分布",
  "card.lsdist.lightness": "明度（OKLCH L）",
  "card.lsdist.saturation": "彩度（HSV S）",
  "card.warmcool.title": "暖寒バランス",
  "card.grayscale.title": "グレースケール耐性",
  "card.grayscale.ok": "グレー化しても全色を区別できます",
  "card.grayscale.collision": "{a} × {b} が潰れます（グレー後 ΔE {de}）",
  "card.cvdmatrix.title": "色覚識別性",
  "card.cvdmatrix.ok": "識別可",
  "card.cvdmatrix.count": "紛らわしいペア {n} 組",
  "card.redundancy.title": "冗長性検出",
  "card.redundancy.ok": "似すぎている色はありません（全ペア ΔE ≥ 10）",
  "card.roles.title": "役割カバレッジ",
  "card.roles.background": "背景",
  "card.roles.text": "テキスト",
  "card.roles.accent": "強調",
  "card.roles.surface": "中間面",
  "card.scheme.title": "調和スキーム判定",
  "card.scheme.tooFew": "有彩色が2色以上必要です",
  "card.scheme.note": "最も近い既知スキームとの合致度",
  "card.uipreview.title": "UI モックプレビュー",
  "card.uipreview.note":
    "並び順と FG/BG 指定で色を割当（背景=BG・テキスト=FG・以降が順に primary/accent）",
  "card.svgpreview.title": "SVG プレビュー",
  "card.svgpreview.aria": "パレットを適用した抽象図形のプレビュー",
  "card.chartpreview.title": "データビズプレビュー",
  "card.chartpreview.aria": "パレットを系列色に適用した棒グラフのプレビュー",

  // カード: 設計支援
  "card.partner.title": "相手色提案",
  "card.lsvar.title": "明度・彩度バリエーション",
  "card.lsvar.add": "バリエーション {label} {hex} をパレットに追加",
  "card.gradient.title": "2色間グラデーション",
  "card.gradient.space": "補間色空間",
  "card.gradient.add": "グラデーション {n}番 {hex} をパレットに追加",
  "card.mix.title": "色のミックス",
  "card.mix.add": "{mode} の結果 {hex} をパレットに追加",
  "card.nudge.title": "アクセシブル化ナッジ",
  "card.nudge.current": "現在のコントラスト比 {ratio}:1",
  "card.nudge.already": "{level} を満たしています",
  "card.nudge.applied": "FG を {hex} に補正しました（{ratio}:1）",
  "card.nudge.apply": "適用",
  "card.nudge.bestEffort": "最良値",
  "card.cvdsafe.title": "色覚セーフ提案",
  "card.cvdsafe.ok": "全色覚型で識別できます",
  "card.complement.title": "不足色の補完提案",
  "card.complement.tooFew": "有彩色が2色以上必要です",
  "card.complement.lead":
    "色相環上で最も広い隙間の中央に、パレットに馴染む明度・彩度の色を提案します。",
  "card.complement.label": "補完",
  "card.darklight.title": "ダーク/ライト変換",
  "card.darklight.applyAll": "一括置換",
  "card.darklight.applied": "明暗反転したパレットに置き換えました",
  "card.sort.title": "並べ替え・正規化",
  "card.sort.lead":
    "パレットの並びを整えます。均等化は順序を保ったまま明度を等間隔に再配置します。",
  "card.sort.byHue": "色相順",
  "card.sort.byLightness": "明度順",
  "card.sort.equalize": "明度を均等化",
  "card.sort.done": "並べ替えました",
  "card.sort.equalized": "明度ステップを均等化しました",
  "card.semroles.title": "セマンティックロール割当",
  "card.semroles.primary": "プライマリ",
  "card.semroles.neutral": "ニュートラル",
  "card.namesearch.title": "色名検索",
  "card.namesearch.placeholder": "例: 茜色 / crimson",
  "card.namesearch.hint": "辞書 {n} 色から名前で検索できます",
  "card.namesearch.none": "見つかりませんでした",
  "card.templates.title": "配色テンプレート",
  "card.templates.apply": "テンプレート「{name}」を適用",
  "card.templates.applied": "テンプレート「{name}」を適用しました",
  "card.templates.note": "適用はパレット全置換（共有 URL で元に戻せます）",
  "card.tokens.title": "デザイントークン出力",
  "card.tokens.format": "出力形式",
  "card.tokens.copy": "コピー",

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

  "nav.home": "Home",
  "nav.backHome": "Back to home",

  "settings.open": "Settings",
  "settings.title": "Settings",
  "settings.theme": "Theme",
  "settings.light": "Light",
  "settings.dark": "Dark",
  "settings.language": "Language",

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
  "swatch.selectTitle":
    "Click to select / double-click to edit / drag or ←→ to reorder",
  "swatch.remove": "Remove color {n}",
  "swatch.accent": "Set color {n} as accent",
  "swatch.accentTitle": "Set as accent (used as the UI accent color)",
  "swatch.reorder": "Reorder color {n}",
  "swatch.reorderTitle": "Drag to reorder / move with ←→ keys",
  "swatch.moved": "Moved color to position {n}",

  // FG/BG role selectors (pair × verify)
  "role.pairLabel": "Text & background",
  "role.pairHint":
    "Contrast is measured between the text (FG) and background (BG) colors.",
  "role.fgLabel": "Text",
  "role.bgLabel": "Background",
  "role.fg": "Select text color (FG)",
  "role.bg": "Select background color (BG)",
  "role.barRegion": "Text & background (pinned)",
  "role.barExpand": "Expand text & background",
  "role.barCollapse": "Collapse text & background",

  "coach.title": "Start here",
  "coach.body": "Pick, add, and edit colors",
  "coach.dismiss": "Dismiss",

  "help.aria": "About {title}",
  "help.guide": "Guide",

  "refs.aria": "References for {title}",
  "refs.title": "References",
  "refs.note": "Links open external sites in a new tab",
  "refs.viewAll": "View all references",

  "learn.open": "Open learning content",
  "learn.title": "Learning Content",
  "learn.lead":
    "Background knowledge for quantitative color work, plus external tools for verification.",
  "learn.byTopic": "References by Metric",
  "learn.articles": "Articles & Reading",
  "learn.books": "Books",
  "learn.tools": "Bench Tools",
  "learn.glossary": "Glossary",
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

  "card.spaces.title": "Extended Color Spaces",
  "card.spaces.note": "Click to copy / CMYK* is a naive approximation (no ICC)",
  "card.perception.title": "Perceived Brightness & Temperature",
  "card.perception.gray": "Gray equivalent",
  "card.perception.temp": "Temperature",
  "card.perception.warm": "Warm",
  "card.perception.cool": "Cool",
  "card.perception.neutral": "Neutral",
  "card.alpha.title": "Alpha / Opacity",
  "card.alpha.onWhite": "On white",
  "card.alpha.onBlack": "On black",
  "card.gamut.title": "Gamut & Output Fit",
  "card.gamut.inGamut": "In gamut",
  "card.gamut.websafe": "Web safe (216)",
  "card.gamut.safe": "Safe",
  "card.gamut.print": "Print approx. (CMYK round-trip)",
  "card.gamut.nearest": "Nearest web-safe:",

  "card.apca.title": "APCA Contrast",
  "card.apca.body": "Usable for body text (|Lc| ≥ 75)",
  "card.apca.large": "Usable for larger text (|Lc| ≥ 60)",
  "card.apca.ui": "Bold large text & UI components (|Lc| ≥ 45)",
  "card.apca.fail": "Insufficient for text (|Lc| < 45)",
  "card.apca.bodyShort": "body",
  "card.dbreak.title": "ΔE Breakdown",
  "card.dbreak.components": "Components (FG → BG)",

  "card.lsdist.title": "Lightness & Saturation",
  "card.lsdist.lightness": "Lightness (OKLCH L)",
  "card.lsdist.saturation": "Saturation (HSV S)",
  "card.warmcool.title": "Warm / Cool Balance",
  "card.grayscale.title": "Grayscale Robustness",
  "card.grayscale.ok": "All colors stay distinguishable in grayscale",
  "card.grayscale.collision": "{a} × {b} collapse (gray ΔE {de})",
  "card.cvdmatrix.title": "CVD Distinguishability",
  "card.cvdmatrix.ok": "Distinct",
  "card.cvdmatrix.count": "{n} confusable pair(s)",
  "card.redundancy.title": "Redundancy Detection",
  "card.redundancy.ok": "No overly similar colors (all pairs ΔE ≥ 10)",
  "card.roles.title": "Role Coverage",
  "card.roles.background": "Background",
  "card.roles.text": "Text",
  "card.roles.accent": "Accent",
  "card.roles.surface": "Surface",
  "card.scheme.title": "Scheme Match",
  "card.scheme.tooFew": "Needs at least 2 chromatic colors",
  "card.scheme.note": "Match score against the closest known scheme",
  "card.uipreview.title": "UI Mock Preview",
  "card.uipreview.note":
    "Colors follow palette order & FG/BG (background=BG, text=FG, then primary/accent)",
  "card.svgpreview.title": "SVG Preview",
  "card.svgpreview.aria": "Abstract shapes preview using the palette",
  "card.chartpreview.title": "Data Viz Preview",
  "card.chartpreview.aria":
    "Bar chart preview using the palette as series colors",

  "card.partner.title": "Partner Colors",
  "card.lsvar.title": "S/V Variations",
  "card.lsvar.add": "Add variation {label} {hex} to the palette",
  "card.gradient.title": "Two-Color Gradient",
  "card.gradient.space": "Interpolation space",
  "card.gradient.add": "Add gradient step {n} {hex} to the palette",
  "card.mix.title": "Color Mix",
  "card.mix.add": "Add {mode} result {hex} to the palette",
  "card.nudge.title": "Accessibility Nudge",
  "card.nudge.current": "Current contrast ratio {ratio}:1",
  "card.nudge.already": "Already meets {level}",
  "card.nudge.applied": "FG nudged to {hex} ({ratio}:1)",
  "card.nudge.apply": "Apply",
  "card.nudge.bestEffort": "best effort",
  "card.cvdsafe.title": "CVD-Safe Suggestion",
  "card.cvdsafe.ok": "Distinguishable for all color-vision types",
  "card.complement.title": "Gap-Fill Suggestion",
  "card.complement.tooFew": "Needs at least 2 chromatic colors",
  "card.complement.lead":
    "Proposes a color at the center of the widest hue gap, with lightness and chroma that fit the palette.",
  "card.complement.label": "FILL",
  "card.darklight.title": "Dark / Light Conversion",
  "card.darklight.applyAll": "Replace all",
  "card.darklight.applied":
    "Palette replaced with the lightness-inverted version",
  "card.sort.title": "Sort & Normalize",
  "card.sort.lead":
    "Tidy the palette order. Equalize respaces lightness evenly while keeping the order.",
  "card.sort.byHue": "By hue",
  "card.sort.byLightness": "By lightness",
  "card.sort.equalize": "Equalize lightness",
  "card.sort.done": "Palette reordered",
  "card.sort.equalized": "Lightness steps equalized",
  "card.semroles.title": "Semantic Roles",
  "card.semroles.primary": "Primary",
  "card.semroles.neutral": "Neutral",
  "card.namesearch.title": "Color Name Search",
  "card.namesearch.placeholder": "e.g. crimson / akane",
  "card.namesearch.hint": "Search {n} dictionary colors by name",
  "card.namesearch.none": "No matches",
  "card.templates.title": "Palette Templates",
  "card.templates.apply": "Apply template “{name}”",
  "card.templates.applied": "Applied template “{name}”",
  "card.templates.note":
    "Applying replaces the whole palette (undo via shared URL)",
  "card.tokens.title": "Design Token Export",
  "card.tokens.format": "Output format",
  "card.tokens.copy": "Copy",

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
