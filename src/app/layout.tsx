import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matrix IDE",
  description: "Write your Matrix Games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
    <head>
      <meta http-equiv="origin-trial"
            content="ApeWRfu4Lz/GIPdN5doSKsJU9DwOXTUZ11p3AtMru6+GVFAekymps+nQ053CY6yN6T4WlgTaLzdGrP5tGZiiSgUAAAB6eyJvcmlnaW4iOiJodHRwczovL21hdHJpeC50aW0tYXJub2xkLmRlOjQ0MyIsImZlYXR1cmUiOiJQcml2YXRlTmV0d29ya0FjY2Vzc05vblNlY3VyZUNvbnRleHRzQWxsb3dlZCIsImV4cGlyeSI6MTc0MjI1NjAwMH0="/>

      <script async type="text/javascript" src="overwritePrint.js"></script>
      <script async type="text/javascript" src="index.js"></script>

    </head>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
