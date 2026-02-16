import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@/styles/holo-base.css";
import "@/styles/holo-rare.css";
import "@/styles/holo-leader.css";
import "@/styles/holo-super-rare.css";
import "@/styles/holo-secret-rare.css";
import "@/styles/holo-alt-art.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OP Pack Sim — One Piece TCG Pack Opening Simulator",
  description:
    "Open One Piece TCG booster packs with stunning holographic card effects. Free, no accounts, just fun.",
  keywords: ["One Piece", "TCG", "pack simulator", "card game", "holographic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
