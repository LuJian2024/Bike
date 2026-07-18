import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cash for Bikes UK | Sell My Bike · Same Day Collection",
  description: "Looking to sell your motorbike quickly? We buy any motorbike for cash in the UK. Get a free valuation and free same-day collection today!",
 icons: {
    icon: [
      {
        url: "/canva-re.png?v=2", 
        href: "/canva-re.png?v=2",
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
      <head>
        {/* 2. Овде го вчитуваме главното Google Analytics срипта-фајл со твоето ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MKY5R3KVQJ"
          strategy="afterInteractive"
        />
        {/* 3. Овде ја извршуваме иницијализацијата за Analytics */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MKY5R3KVQJ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
