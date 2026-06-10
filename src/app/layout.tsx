import type { Metadata } from "next";
import { Archivo, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButton } from "@/components/ShareButton";
import { PaletteBar } from "@/components/PaletteBar";
import { StoreSync } from "@/components/StoreSync";
import { ColorPicker } from "@/components/ColorPicker";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Toast } from "@/components/Toast";
import { SplashScreen } from "@/components/SplashScreen";

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
};

// ペイント前に data-theme を確定（ちらつき防止）し、スプラッシュの表示可否も決める。
// スプラッシュは「このセッション初回」かつ「モーション低減でない」ときだけ。
const themeInit = `(function(){try{var t=localStorage.getItem('cff-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light';}catch(e){document.documentElement.dataset.theme='light';}try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm&&!sessionStorage.getItem('cff-splash-shown')){document.documentElement.dataset.splash='1';}}catch(e){}})();`;

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
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-bg text-text flex h-dvh flex-col overflow-hidden text-[14px] leading-[1.45]">
        <StoreSync />

        {/* ヘッダー（v2: 56px・ロゴブロック・REVラベル・ONLINE・SHARE） */}
        <header className="border-border-strong bg-surface z-5 flex h-14 flex-none items-center justify-between border-b pr-[18px]">
          <div className="flex h-full items-stretch">
            <div className="border-border flex items-center gap-[11px] border-r px-5">
              <span className="text-[19px] font-black tracking-[-0.04em]">
                CFF
              </span>
            </div>
            <div className="flex flex-col justify-center gap-px px-[18px]">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                Color Follows Function
              </span>
              <span className="text-text-3 font-mono text-[9px] tracking-[0.14em] uppercase">
                色彩定量解析 / REV 2.4
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="hidden items-center gap-[7px] sm:flex">
              <span className="bg-accent size-[7px] rounded-full" aria-hidden />
              <span className="text-text-2 font-mono text-[10px] tracking-[0.14em]">
                ONLINE
              </span>
            </div>
            <ShareButton />
            <ThemeToggle />
          </div>
        </header>

        <main className="cff-scroll bg-bg min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>

        <PaletteBar />

        <ColorPicker />
        <ConfirmDialog />
        <Toast />
        <SplashScreen />
      </body>
    </html>
  );
}
