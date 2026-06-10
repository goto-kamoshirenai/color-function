import type { Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Color Follows Function",
  description:
    "配色を感覚でなく数値で扱う、配色の検証・設計支援ツール。コントラスト比・色差・色覚シミュレーションなどで定量的に可視化する。",
};

// data-theme をペイント前に確定し、テーマ切替時のちらつきを防ぐ。
const themeInit = `(function(){try{var t=localStorage.getItem('cff-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-theme="light"
      className={`${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-bg text-text flex min-h-full flex-col">
        <header className="border-border flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-baseline gap-2">
            <span className="text-text font-mono text-sm tracking-widest">
              CFF
            </span>
            <span className="text-text-2 text-sm">Color Follows Function</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="cff-scroll flex-1 overflow-y-auto">{children}</main>

        {/* 配色パレットバー（常設）。S2 で実装。S0 は器のみ。 */}
        <footer className="border-border border-t px-4 py-3">
          <div className="text-text-3 flex items-center gap-2 text-xs">
            <span className="font-mono">PALETTE</span>
            <span
              className="bg-accent inline-block size-4 rounded-sm"
              aria-hidden
            />
            <span>パレットバー（S2 で実装）</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
