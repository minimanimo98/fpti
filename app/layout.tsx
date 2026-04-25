import type { Metadata } from "next";
import { Black_Han_Sans, Noto_Sans_KR, Space_Mono, Archivo_Black } from "next/font/google";
import "./globals.css";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FPTI - 친구가 보는 나의 인성",
  description: "친구들한테 물어봤습니다. 당신 인성 몇 점인지. MBTI는 내가 보는 나, FPTI는 친구가 보는 나.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${blackHanSans.variable} ${notoSansKR.variable} ${spaceMono.variable} ${archivoBlack.variable}`}
        style={{ fontFamily: 'var(--font-noto), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}