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
  title: "Sell My Bike | Cash for Bikes UK · Same Day Collection",
  description: "Looking to sell your motorbike quickly? We buy any motorbike for cash in the UK. Get a free valuation and free same-day collection today!",
 icons: {
    icon: [
      {
        url: "/image.png?v=2", 
        href: "/image.png?v=2",
        sizes: "32x32", 
        type: "image/png",
      }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
