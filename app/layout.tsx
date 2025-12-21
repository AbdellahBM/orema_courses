import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

/*
  This file defines the root layout of the application.
  It configures the Arabic font (Cairo), sets the document language to Arabic (RTL),
  and applies global styles. The favicon is set via icon.png in the app directory.
*/

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "جدولة حصص الدعم",
  description: "برنامج حصص الدعم - منظمة التجديد الطلابي",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
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
        className={`${cairo.variable} antialiased font-sans bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
