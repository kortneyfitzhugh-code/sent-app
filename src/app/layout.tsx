import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sent — Born in prayer. Built for purpose.",
  description:
    "An apostolic church planting and ministry formation platform for Spirit-led builders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${syne.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-void text-bone">{children}</body>
    </html>
  );
}
