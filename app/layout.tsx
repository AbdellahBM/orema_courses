import type { Metadata, Viewport } from "next";
import { Cairo, Changa, El_Messiri, Rubik, Amiri } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

/*
  This file defines the root layout of the application.
  It configures the Arabic font (Cairo), sets the document language to Arabic (RTL),
  and applies global styles.
  It also includes Vercel Analytics and Speed Insights for monitoring and performance tracking.
*/

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

const changa = Changa({
  subsets: ["arabic"],
  variable: "--font-changa",
  weight: ["400", "500", "600", "700", "800"],
});

const elMessiri = El_Messiri({
  subsets: ["arabic"],
  variable: "--font-el-messiri",
  weight: ["400", "500", "600", "700"],
});

const rubik = Rubik({
  subsets: ["arabic"],
  variable: "--font-rubik",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "جدولة حصص الدعم",
  description: "برنامج حصص الدعم - منظمة التجديد الطلابي",
};

export const viewport: Viewport = {
  themeColor: "#0f4c81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${changa.variable} ${elMessiri.variable} ${rubik.variable} ${amiri.variable} antialiased font-sans bg-slate-50 text-slate-900`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
