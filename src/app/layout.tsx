import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Juniper Snow Report",
  description:
    "View snowfall and temperature for Colorado ski resorts on the Ikon pass.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7407628109466644'
        crossOrigin='anonymous'
      ></script>
      <body suppressHydrationWarning={true} className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
