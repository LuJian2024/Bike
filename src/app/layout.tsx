import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner"; 


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
        url: "/favi-neon-4.png?v=2", 
        href: "/favi-neon-4.png?v=2",
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
      {/* <head>
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MKY5R3KVQJ"
          strategy="afterInteractive"
        />
       
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MKY5R3KVQJ');
          `}
        </Script>
      </head> */}
      <head>
  <Script id="ga-consent" strategy="beforeInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent','default',{ analytics_storage: 'denied' });
      try {
        if (localStorage.getItem('cookie-consent') === 'granted') {
          gtag('consent','update',{ analytics_storage: 'granted' });
        }
      } catch(e){}
    `}
  </Script>
  <Script src="https://www.googletagmanager.com/gtag/js?id=G-MKY5R3KVQJ" strategy="afterInteractive" />
  <Script id="google-analytics" strategy="afterInteractive">
    {`
      gtag('js', new Date());
      gtag('config', 'G-MKY5R3KVQJ', { anonymize_ip: true });
    `}
  </Script>
</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
         <CookieBanner />
      </body>
    </html>
  );
}
