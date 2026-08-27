import type { Metadata } from "next";
import {
  Archivo_Black,
  Space_Grotesk,
  JetBrains_Mono,
  Permanent_Marker,
  Noto_Sans_Telugu,
  DM_Mono,
  Bricolage_Grotesque,
} from "next/font/google";
import "./globals.css";
import Wordmark from "./components/Wordmark";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const label = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

const hand = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  weight: ["400", "600", "700"],
  subsets: ["telugu"],
  variable: "--font-telugu",
  display: "swap",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maeve Chen — Portfolio",
  description:
    "Maeve Chen — software engineer and video creator. Engineering case studies, creative work, and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${label.variable} ${hand.variable} ${bricolage.variable} ${telugu.variable} ${mono.variable}`}
    >
      <body className="font-body">
        <Wordmark />
        {children}
      </body>
    </html>
  );
}
