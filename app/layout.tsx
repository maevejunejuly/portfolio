import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import {
  Archivo_Black,
  Noto_Sans_Telugu,
  DM_Mono,
  Bricolage_Grotesque,
  Roboto,
  STIX_Two_Text,
} from "next/font/google";
import "./globals.css";
import Wordmark from "./components/Wordmark";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const scoutie = localFont({
  src: [
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Scoutie_Sans/static/ScoutieSans-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-body",
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

const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const math = STIX_Two_Text({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-math",
  display: "swap",
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maeve Chen",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${scoutie.variable} ${bricolage.variable} ${telugu.variable} ${mono.variable} ${roboto.variable} ${math.variable}`}
    >
      <body className="font-body">
        <div className="isolate">
          <Suspense fallback={null}>
            <Wordmark />
          </Suspense>
          {children}
        </div>
      </body>
    </html>
  );
}
