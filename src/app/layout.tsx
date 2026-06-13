import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { PaletteBar } from "@/components/PaletteBar";
import { StoreSync } from "@/components/StoreSync";
import { ColorPicker } from "@/components/ColorPicker";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Toast } from "@/components/Toast";
import { SplashScreen } from "@/components/SplashScreen";
import { FirstRunHint } from "@/components/FirstRunHint";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Color Follows Function",
  description:
    "配色を感覚でなく数値で扱う、配色の検証・設計支援ツール。コントラスト比・色差・色覚シミュレーションなどで定量的に可視化する。",
  applicationName: "Color Follows Function",
  // ホーム画面追加時の表示（マニフェストは app/manifest.ts）
  appleWebApp: { capable: true, title: "CFF", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  // アプリのテーマは data-theme 切替のため、OS 設定に応じた近似値を返す
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161618" },
  ],
};

// ペイント前に data-theme を確定（ちらつき防止）し、スプラッシュの表示可否も決める。
// スプラッシュは「このセッション初回」かつ「モーション低減でない」ときだけ。
// 言語も同様に確定: localStorage（手動切替の保持値）→ ブラウザ言語（ja 以外は en）。
// URL ハッシュに共有パレット（#p=）がある場合は、復元完了までスウォッチ列を隠す
// フラグを立てる（SSR の既定5色が一瞬見えるのを防ぐ。解除は StoreSync）。
const themeInit = `(function(){try{var t=localStorage.getItem('cff-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light';}catch(e){document.documentElement.dataset.theme='light';}try{var l=null;try{l=localStorage.getItem('cff-lang');}catch(e){}if(l!=='ja'&&l!=='en'){l=((navigator.language||'').toLowerCase().indexOf('ja')===0)?'ja':'en';}document.documentElement.lang=l;}catch(e){}try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm&&!sessionStorage.getItem('cff-splash-shown')){document.documentElement.dataset.splash='1';}}catch(e){}try{if(location.hash.indexOf('#p=')===0){document.documentElement.dataset.paletteRestore='1';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-theme="light"
      className={`${archivo.variable} ${geistMono.variable} ${notoJp.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-bg text-text flex h-dvh flex-col overflow-hidden text-[14px] leading-[1.45]">
        <StoreSync />

        <AppHeader />

        <main className="cff-scroll bg-bg min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        <PaletteBar />

        <ColorPicker />
        <ConfirmDialog />
        <Toast />
        <SplashScreen />
        <FirstRunHint />
      </body>
    </html>
  );
}
