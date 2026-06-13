import type { Locale } from "@/lib/i18n/messages";

/** 指標ヘルプ文言（docs/10 §4・モック helpMap 準拠の13指標）。ja / en の2言語。 */
export type HelpEntry = { title: string; body: string; guide: string };

const HELP_JA = {
  usage: {
    title: "使い方",
    body:
      "スウォッチをクリックで選択します（ペアでは前景 FG に。背景 BG をクリックすると FG/BG が入れ替わります）。" +
      "ダブルクリックで編集、色の下のカラーコードはクリックでコピー、右上の × で削除、右下の塗りつぶしアイコンでその色を画面の差し色（アクセント）に指定できます。" +
      "下段の「単位」はどの粒度で見るか（単色 / ペア / パレット）、「観点」は目的（検証 = 診断 / 設計 = 配色づくり）を切り替え、組み合わせで表示カードが決まります。",
    guide: "FG=前景 / BG=背景 / 塗りつぶし=アクセント指定",
  },
  value: {
    title: "色値",
    body: "同じ色を RGB・HEX・HSL・HSV など複数の数値表現で表したものです。用途に応じて使い分けます。",
    guide: "HEX=#RRGGBB / RGB=0–255 / HSL・HSV=角度と%",
  },
  hsv: {
    title: "HSV（色相・彩度・明度）",
    body: "色相(Hue)で色味、彩度(Saturation)で鮮やかさ、明度(Value)で明るさを表す直感的な色空間です。",
    guide: "H 0–360° / S 0–100% / V 0–100%",
  },
  luminance: {
    title: "相対輝度",
    body: "人間が知覚する明るさを 0（黒）〜1（白）で表した値。コントラスト比計算の基礎になります。",
    guide: "0.0 = 黒  /  1.0 = 白",
  },
  wheel: {
    title: "色相環",
    body: "色相を円環状に配置した図。中心からの距離が鮮やかさ（彩度×明度）を表し、パレット各色の色相関係を一目で把握できます。黒・白・グレーは中心に集まります。",
    guide: "角度=色相 / 距離=鮮やかさ",
  },
  name: {
    title: "最寄り色名",
    body: "基準色から色差(ΔE)が最も小さい代表色名を表示します。色をことばで説明する際の手がかりになります。",
    guide: "ΔE が小さいほど名前に近い",
  },
  contrast: {
    title: "WCAG コントラスト比",
    body: "2色の相対輝度の比。文字の可読性基準として WCAG が定義しています。通常テキストは AA 4.5:1・AAA 7:1、大きな文字は AA 3:1・AAA 4.5:1 が目安です。",
    guide: "1:1（同一）〜 21:1（黒×白）",
  },
  deltae: {
    title: "色差 ΔE",
    body: "2色の知覚的な違いの大きさ。CIEDE2000 で算出し、小さいほど似ています。約2以下で人はほぼ区別できません。",
    guide: "ΔE<2 ほぼ同一 / >10 明確な差",
  },
  cvd: {
    title: "色覚シミュレーション",
    body: "P型・D型・T型それぞれの色覚での見え方を再現します。特定の色覚でも配色が区別できるかを確認できます。",
    guide: "P=赤系 / D=緑系 / T=青系の弱",
  },
  cmatrix: {
    title: "コントラスト比マトリクス",
    body: "パレット全色の総当たりコントラスト比。組み合わせとして使える色ペアを一覧で確認できます。太字が AA 合格です。",
    guide: "太枠・太字 = 4.5:1 以上",
  },
  dmatrix: {
    title: "色差 ΔE マトリクス",
    body: "パレット全色ペアの知覚的な色差。値が小さいペアは紛らわしく、区別しにくい組み合わせです。",
    guide: "小さい値ほど似ている色ペア",
  },
  huedist: {
    title: "色相分布",
    body: "パレット各色の色相を 0–360° の軸上に配置。色相が偏っていないか、バランスを確認できます。",
    guide: "点が散る=多彩 / 集まる=単調",
  },
  harmony: {
    title: "調和スキーム生成",
    body: "基準色の色相を回転させ、補色・類似色・トライアドなど色彩理論に基づく配色候補を生成します。",
    guide: "補色=180° / 類似=±30° / 三分=120°",
  },
  tone: {
    title: "トーン展開",
    body: "基準色を 500 として、明るい 50 から暗い 900 まで明度を段階変化させた色階調です（MUI 等のカラーパレットの流儀）。",
    guide: "50=最明 / 500=基準色 / 900=最暗",
  },
  hueshift: {
    title: "色相シフト",
    body: "基準色の明度・彩度を保ったまま、色相だけを OKLCH で段階回転した候補です。基準色とトーンが揃ったまま色味だけ変わるため、アクセントカラーの検討に向きます。",
    guide: "±30°=隣接色 / ±150°〜180°=補色寄り",
  },
  spaces: {
    title: "拡張色空間",
    body: "同じ色を OKLCH・OKLab・CIELAB・CIELCH・XYZ・xy 色度・HWB・CMYK で表した値です。知覚均等な空間（OKLCH/LAB）は色の調整、XYZ/xy は測色、CMYK は印刷の参考値（ICC なしの近似）に使えます。クリックでコピーできます。",
    guide: "OKLCH 推奨 / CMYK* は近似値",
  },
  perception: {
    title: "知覚明度・色温度",
    body: "人が感じる明るさの近似（HSP と OKLab の明度 L）、輝度を保った白黒等価色、暖色/寒色の傾きと相関色温度（CCT 近似）を表示します。",
    guide: "HSP・L 0–1 / CCT は黒体軌跡近傍で有効",
  },
  alpha: {
    title: "不透明度",
    body: "基準色に透明度（α）を掛けたときの見え方です。白背景・黒背景での合成結果と、市松模様の上での透け方を確認できます。",
    guide: "合成色 = 前景×α + 背景×(1−α)",
  },
  gamut: {
    title: "ガマット・出力適合",
    body: "色の再現域に関する判定です。HEX で表せる色は常に sRGB 域内（より広い P3/Rec.2020 にも収まる）。Web セーフは旧216色への適合、印刷はナイーブ CMYK 往復による劣化の目安です。",
    guide: "印刷 ΔE≥5 で要注意（近似）",
  },
  apca: {
    title: "APCA コントラスト",
    body: "WCAG 3 ドラフトで検討されている知覚ベースのコントラスト指標 Lc。明るい背景に暗い文字で正、逆で負になります。本文は |Lc|≥75、大きめの文字は ≥60 が目安です。",
    guide: "|Lc| 75=本文 / 60=大文字 / 45=太字大",
  },
  dbreak: {
    title: "色差の内訳",
    body: "ΔE00 に加え、旧式の ΔE76/ΔE94、OKLab 距離、そして明度差 ΔL*・彩度差 ΔC*・色相角差 Δh の成分内訳を表示します。どの成分が差を生んでいるかが分かります。",
    guide: "ΔL=明暗 / ΔC=鮮やかさ / Δh=色味",
  },
  lsdist: {
    title: "明度・彩度分布",
    body: "パレット各色を明度（OKLCH L）と彩度（HSV S）の軸に配置します。UI の階層に必要な明度レンジが揃っているか、鮮やかさの偏りがないかを確認できます。",
    guide: "明度が広い=階層を作りやすい",
  },
  warmcool: {
    title: "暖寒バランス",
    body: "各色を暖色・寒色・中立に分類し、配色全体の温度感の比率を表示します。低彩度の色は中立に分類されます。",
    guide: "暖=赤〜黄 / 寒=緑〜青 / 低彩度=中立",
  },
  grayscale: {
    title: "グレースケール耐性",
    body: "輝度を保ったまま脱色した見え方です。グレー化で区別がつかなくなるペアは、色のみで情報を伝えている可能性があります（白黒印刷・モノクロ表示の耐性）。",
    guide: "グレー後 ΔE<10 のペアを警告",
  },
  cvdmatrix: {
    title: "色覚識別性",
    body: "P型・D型・T型それぞれのシミュレーション後に、紛らわしくなる（ΔE00<10）色ペアを型ごとに列挙します。全型で 0 なら、どの色覚でもパレットを区別できます。",
    guide: "全型 0 ペア = 色覚セーフ",
  },
  redundancy: {
    title: "冗長性検出",
    body: "知覚的に似すぎて役割が重複している色ペア（ΔE00<10）を指摘します。パレットを絞る・差を広げる判断材料になります。",
    guide: "ΔE<10 = 役割が重複しがち",
  },
  roles: {
    title: "役割カバレッジ",
    body: "配色が UI に必要な段（背景・テキスト・強調・中間面）を備えているかのヒューリスティック判定です。テキストは背景候補に対する AA(4.5:1) で判定します。",
    guide: "4役が揃えば UI に展開しやすい",
  },
  scheme: {
    title: "調和スキーム判定",
    body: "パレットの色相構成を既知の調和スキーム（補色・類似色・トライアド等）と突き合わせ、最も近いスキームと合致度スコアを表示します。",
    guide: "100 = オフセットに完全一致",
  },
  uipreview: {
    title: "UI モックプレビュー",
    body: "パレットから背景・テキスト・プライマリ・アクセントを自動割当し、簡易 UI に適用した見え方です。実際の使用文脈での印象を確認できます。",
    guide: "割当はセマンティックロールと同じ規則",
  },
  svgpreview: {
    title: "SVG プレビュー",
    body: "抽象図形にパレットを順番に適用した見え方です。面積比や隣接時の印象を確認できます。",
    guide: "01=背景面 / 02 以降=図形",
  },
  chartpreview: {
    title: "データビズプレビュー",
    body: "棒グラフの系列色としてパレットを適用した見え方です。系列同士が識別できるか（凡例なしで追えるか）を確認できます。",
    guide: "隣接バーが見分けられるかに注目",
  },
  partner: {
    title: "相手色提案",
    body: "基準色に対して、調和ルール（補色・分裂補色・トライアド等）から導いた相手色候補を一覧します。クリックでパレットに追加できます。",
    guide: "ラベルは由来のスキーム名",
  },
  lsvar: {
    title: "明度・彩度バリエーション",
    body: "基準色の色相を保ったまま、彩度（S）と明度（V）を振った派生候補です。同系色の濃淡・くすみ違いを比較できます。",
    guide: "行=彩度 / 列=明度（BASE が中央）",
  },
  gradient: {
    title: "2色間グラデーション",
    body: "FG から BG への補間列です。補間に使う色空間で印象が変わります: sRGB は中間が濁りやすく、OKLab は知覚的に滑らか、HSV は色相経由で回ります。",
    guide: "迷ったら OKLab 補間",
  },
  mix: {
    title: "色のミックス",
    body: "FG と BG の合成結果です。MIX は 50/50 平均、MULTIPLY は重ねて暗く、SCREEN は光を重ねて明るく、OVERLAY は明暗を強調します。",
    guide: "CSS の mix-blend-mode と同じ式",
  },
  nudge: {
    title: "アクセシブル化ナッジ",
    body: "現在の FG/BG ペアが基準に満たない場合、FG の明度だけを調整して AA(4.5:1)・AAA(7:1) に届く最寄り色を提案します。「適用」で FG を置き換えます。",
    guide: "色相・彩度は保ったまま明度のみ調整",
  },
  cvdsafe: {
    title: "色覚セーフ提案",
    body: "いずれかの色覚型で紛らわしくなるペアを検出し、片方の明度を調整して全型で識別できる（ΔE00≥10）最寄り色を提案します。",
    guide: "明度差は全色覚型で保たれる",
  },
  complement: {
    title: "不足色の補完提案",
    body: "パレットの色相環上で最も広い隙間を見つけ、その中央の色相に中央値的な明度・彩度を持つ色を提案します。配色の偏りを埋める候補です。",
    guide: "最大ギャップの中央に1色提案",
  },
  darklight: {
    title: "ダーク/ライト変換",
    body: "各色の OKLCH 明度を反転して、明暗モード版のパレットを生成します。色相・彩度はおおむね保たれます。個別追加か、一括置換ができます。",
    guide: "L' ≈ 1.06 − L（0.12–0.97 に制限）",
  },
  sort: {
    title: "並べ替え・正規化",
    body: "パレットを色相順・明度順に並べ替えたり、明度ステップを均等化（順序を保って L を等間隔に再配置）できます。トーンスケールの整備に便利です。",
    guide: "均等化は3色以上で有効",
  },
  semroles: {
    title: "セマンティックロール割当",
    body: "背景・テキスト・プライマリ・アクセント・ニュートラルの役割をヒューリスティックに自動割当します。デザイントークン出力の名前にも使われます。",
    guide: "背景=明度の端 / テキスト=最高コントラスト",
  },
  namesearch: {
    title: "色名検索",
    body: "色名辞書（CSS named / JIS 慣用色名 / 和色）を名前で検索し、ヒットした色をパレットに追加できます。",
    guide: "部分一致 / 上位8件を表示",
  },
  templates: {
    title: "配色テンプレート",
    body: "用途別のテンプレートからパレットを置き換えて出発点にします。適用後は各カードで検証・調整してください。",
    guide: "適用はパレット全置換",
  },
  tokens: {
    title: "デザイントークン出力",
    body: "パレットを CSS カスタムプロパティ・Tailwind トークン・JSON として書き出します。名前はセマンティックロール割当に従います。",
    guide: "コピーしてそのまま貼り付け可能",
  },
} as const satisfies Record<string, HelpEntry>;

type HelpKey = keyof typeof HELP_JA;

const HELP_EN: Record<HelpKey, HelpEntry> = {
  usage: {
    title: "How to Use",
    body:
      "Click a swatch to select it (in Pair mode it becomes the foreground FG; clicking the background BG swaps FG/BG). " +
      "Double-click to edit, click the color code below a swatch to copy it, remove with the × at the top right, and use the fill icon at the bottom right to make that color the UI accent. " +
      "In the bottom row, Unit sets the granularity (Single / Pair / Palette) and View sets the goal (Verify = diagnose / Design = build a scheme); their combination decides which cards are shown.",
    guide: "FG=foreground / BG=background / fill=set accent",
  },
  value: {
    title: "Color Value",
    body: "The same color expressed in multiple numeric notations such as RGB, HEX, HSL, and HSV. Use whichever fits the task.",
    guide: "HEX=#RRGGBB / RGB=0–255 / HSL·HSV=angle and %",
  },
  hsv: {
    title: "HSV (Hue · Saturation · Value)",
    body: "An intuitive color space: Hue for the color tone, Saturation for vividness, and Value for brightness.",
    guide: "H 0–360° / S 0–100% / V 0–100%",
  },
  luminance: {
    title: "Relative Luminance",
    body: "Perceived brightness expressed from 0 (black) to 1 (white). It is the basis of contrast ratio calculations.",
    guide: "0.0 = black  /  1.0 = white",
  },
  wheel: {
    title: "Hue Wheel",
    body: "Hues arranged in a circle. Distance from the center shows chroma (saturation × value), giving an at-a-glance view of hue relationships in the palette. Black, white, and grays gather at the center.",
    guide: "angle=hue / radius=chroma",
  },
  name: {
    title: "Nearest Color Name",
    body: "Shows the named color with the smallest color difference (ΔE) from the reference color — a handy way to describe a color in words.",
    guide: "smaller ΔE = closer to the name",
  },
  contrast: {
    title: "WCAG Contrast Ratio",
    body: "The ratio of two colors' relative luminance, defined by WCAG as a text readability criterion. Aim for AA 4.5:1 / AAA 7:1 for normal text and AA 3:1 / AAA 4.5:1 for large text.",
    guide: "1:1 (identical) – 21:1 (black × white)",
  },
  deltae: {
    title: "Color Difference ΔE",
    body: "The perceptual difference between two colors, computed with CIEDE2000. Smaller means more similar; below about 2 most people cannot tell them apart.",
    guide: "ΔE<2 nearly identical / >10 clearly different",
  },
  cvd: {
    title: "Color Vision Simulation",
    body: "Simulates how colors appear with protan, deutan, and tritan color vision, so you can check the scheme stays distinguishable.",
    guide: "P=red / D=green / T=blue weakness",
  },
  cmatrix: {
    title: "Contrast Ratio Matrix",
    body: "Pairwise contrast ratios across the whole palette — a quick overview of which color pairs are usable together. Bold means AA pass.",
    guide: "bold frame & text = 4.5:1 or higher",
  },
  dmatrix: {
    title: "ΔE Difference Matrix",
    body: "Perceptual color differences for every palette pair. Pairs with small values are confusably similar and hard to distinguish.",
    guide: "smaller value = more similar pair",
  },
  huedist: {
    title: "Hue Distribution",
    body: "Each palette color placed on a 0–360° hue axis, showing whether hues are skewed or balanced.",
    guide: "spread dots=varied / clustered=monotone",
  },
  harmony: {
    title: "Harmony Schemes",
    body: "Rotates the base color's hue to generate scheme candidates based on color theory: complementary, analogous, triadic, and more.",
    guide: "complementary=180° / analogous=±30° / triadic=120°",
  },
  tone: {
    title: "Tone Scale",
    body: "A tonal scale in the style of MUI-like color palettes: the base color sits at 500, stepping lighter to 50 and darker to 900.",
    guide: "50=lightest / 500=base / 900=darkest",
  },
  hueshift: {
    title: "Hue Shift",
    body: "Candidates that rotate only the hue in OKLCH while keeping the base color's lightness and chroma. The tone stays consistent while the hue changes, which makes this useful for exploring accent colors.",
    guide: "±30°=adjacent / ±150°–180°=near-complementary",
  },
  spaces: {
    title: "Extended Color Spaces",
    body: "The same color in OKLCH, OKLab, CIELAB, CIELCH, XYZ, xy chromaticity, HWB, and CMYK. Perceptually uniform spaces (OKLCH/LAB) suit color adjustment, XYZ/xy suit colorimetry, and CMYK is a print reference (naive, no ICC). Click a value to copy it.",
    guide: "OKLCH recommended / CMYK* is approximate",
  },
  perception: {
    title: "Perceived Brightness & Temperature",
    body: "Approximations of perceived brightness (HSP and OKLab lightness L), a luminance-preserving grayscale equivalent, and the warm/cool tendency with an approximate correlated color temperature (CCT).",
    guide: "HSP·L 0–1 / CCT valid near the blackbody locus",
  },
  alpha: {
    title: "Alpha / Opacity",
    body: "How the base color looks with transparency applied: composited results on white and black, plus see-through behavior over a checkerboard.",
    guide: "result = fg×α + bg×(1−α)",
  },
  gamut: {
    title: "Gamut & Output Fit",
    body: "Checks related to color reproduction. Any HEX color is inside sRGB (and the wider P3/Rec.2020). Web-safe checks the legacy 216 palette; print shows degradation from a naive CMYK round-trip.",
    guide: "print ΔE≥5 deserves caution (approx.)",
  },
  apca: {
    title: "APCA Contrast",
    body: "The perceptual contrast metric Lc explored for WCAG 3 drafts. Positive for dark text on light backgrounds, negative for the reverse. Aim for |Lc|≥75 for body text and ≥60 for larger text.",
    guide: "|Lc| 75=body / 60=large / 45=bold large",
  },
  dbreak: {
    title: "ΔE Breakdown",
    body: "Alongside ΔE00, shows the legacy ΔE76/ΔE94, OKLab distance, and the component breakdown of lightness ΔL*, chroma ΔC*, and hue angle Δh — revealing which component drives the difference.",
    guide: "ΔL=light–dark / ΔC=vividness / Δh=hue",
  },
  lsdist: {
    title: "Lightness & Saturation Distribution",
    body: "Palette colors placed on lightness (OKLCH L) and saturation (HSV S) axes. Check whether the lightness range covers UI hierarchy needs and whether vividness is skewed.",
    guide: "wide lightness range = easier hierarchy",
  },
  warmcool: {
    title: "Warm / Cool Balance",
    body: "Classifies each color as warm, cool, or neutral and shows the overall temperature ratio. Low-chroma colors count as neutral.",
    guide: "warm=red–yellow / cool=green–blue / low-chroma=neutral",
  },
  grayscale: {
    title: "Grayscale Robustness",
    body: "A luminance-preserving desaturated view. Pairs that become indistinguishable in gray likely rely on color alone to convey information (think B/W printing or monochrome displays).",
    guide: "warns on pairs with ΔE<10 after graying",
  },
  cvdmatrix: {
    title: "CVD Distinguishability",
    body: "Lists pairs that become confusable (ΔE00<10) after protan, deutan, and tritan simulation, per type. Zero pairs across all types means the palette stays distinguishable for everyone.",
    guide: "0 pairs in all types = CVD safe",
  },
  redundancy: {
    title: "Redundancy Detection",
    body: "Flags color pairs that are perceptually too similar (ΔE00<10) and thus duplicate each other's role — useful for trimming or spreading the palette.",
    guide: "ΔE<10 = likely redundant roles",
  },
  roles: {
    title: "Role Coverage",
    body: "A heuristic check that the palette covers the tiers a UI needs: background, text, accent, and a middle surface. Text is judged by AA (4.5:1) against the background candidate.",
    guide: "all 4 roles = ready for UI use",
  },
  scheme: {
    title: "Scheme Match",
    body: "Compares the palette's hue structure against known harmony schemes (complementary, analogous, triadic, …) and shows the closest scheme with a match score.",
    guide: "100 = exact offset match",
  },
  uipreview: {
    title: "UI Mock Preview",
    body: "Automatically assigns background, text, primary, and accent from the palette and applies them to a miniature UI — a quick feel for the scheme in context.",
    guide: "same assignment rule as Semantic Roles",
  },
  svgpreview: {
    title: "SVG Preview",
    body: "The palette applied in order to abstract shapes — check area balance and how colors read side by side.",
    guide: "01=background / 02+=shapes",
  },
  chartpreview: {
    title: "Data Viz Preview",
    body: "The palette applied as chart series colors. Check that series remain tellable apart without a legend.",
    guide: "watch adjacent bars for separability",
  },
  partner: {
    title: "Partner Colors",
    body: "Partner candidates for the base color derived from harmony rules (complementary, split-complementary, triadic, …). Click to add to the palette.",
    guide: "labels show the source scheme",
  },
  lsvar: {
    title: "S/V Variations",
    body: "Derivatives that vary saturation (S) and value (V) while keeping the base hue — compare lighter, darker, and muted versions of the same color.",
    guide: "rows=saturation / columns=value (BASE centered)",
  },
  gradient: {
    title: "Two-Color Gradient",
    body: "Interpolation steps from FG to BG. The interpolation space changes the result: sRGB can muddy the middle, OKLab stays perceptually smooth, HSV travels around the hue wheel.",
    guide: "when unsure, pick OKLab",
  },
  mix: {
    title: "Color Mix",
    body: "Composites of FG and BG: MIX is a 50/50 average, MULTIPLY darkens, SCREEN lightens, OVERLAY boosts contrast.",
    guide: "same math as CSS mix-blend-mode",
  },
  nudge: {
    title: "Accessibility Nudge",
    body: "When the current FG/BG pair misses the bar, proposes the nearest FG adjusted in lightness only to reach AA (4.5:1) and AAA (7:1). Apply replaces the FG.",
    guide: "hue and chroma stay, only lightness moves",
  },
  cvdsafe: {
    title: "CVD-Safe Suggestion",
    body: "Detects pairs that turn confusable under any color-vision type and proposes the nearest lightness adjustment that keeps them apart (ΔE00≥10) for all types.",
    guide: "lightness differences survive all CVD types",
  },
  complement: {
    title: "Gap-Fill Suggestion",
    body: "Finds the widest gap on the palette's hue wheel and proposes a color at its center with the palette's median lightness and chroma — a candidate to balance the scheme.",
    guide: "one color at the largest gap's center",
  },
  darklight: {
    title: "Dark / Light Conversion",
    body: "Generates the opposite-mode palette by inverting each color's OKLCH lightness while roughly preserving hue and chroma. Add individually or replace all at once.",
    guide: "L' ≈ 1.06 − L (clamped 0.12–0.97)",
  },
  sort: {
    title: "Sort & Normalize",
    body: "Reorder the palette by hue or lightness, or equalize lightness steps (respacing L evenly while keeping order) — handy for building tonal scales.",
    guide: "equalize needs 3+ colors",
  },
  semroles: {
    title: "Semantic Role Assignment",
    body: "Heuristically assigns background, text, primary, accent, and neutral roles. The same names are used in the design token export.",
    guide: "background=lightness extreme / text=highest contrast",
  },
  namesearch: {
    title: "Color Name Search",
    body: "Search the color name dictionaries (CSS named / JIS / Japanese traditional) by name and add hits to the palette.",
    guide: "substring match / top 8 results",
  },
  templates: {
    title: "Palette Templates",
    body: "Replace the palette with a purpose-built template as a starting point, then verify and refine with the other cards.",
    guide: "applying replaces the whole palette",
  },
  tokens: {
    title: "Design Token Export",
    body: "Exports the palette as CSS custom properties, Tailwind tokens, or JSON. Names follow the semantic role assignment.",
    guide: "copy and paste as-is",
  },
};

export const HELP: Record<Locale, Record<string, HelpEntry>> = {
  ja: HELP_JA,
  en: HELP_EN,
};
