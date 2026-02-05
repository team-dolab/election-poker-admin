import type { Metadata } from "next";
import { Noto_Sans_KR, Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const orbitron = Orbitron({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "대선 포커 - Election Poker",
  description: "DO:LAB 대선 포커 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${orbitron.variable} ${shareTechMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
