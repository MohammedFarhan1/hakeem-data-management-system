import type { Metadata } from "next";
import { Sora, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans"
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "HDMS",
  description: "Hakeem Data Management System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${sourceSerif.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
