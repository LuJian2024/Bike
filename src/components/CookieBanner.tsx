"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Ова ги дефинира global променливите за TypeScript да не плаче
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

// pri ev probl zameni so : 
// declare global {
//   interface Window {
//     gtag?: (...args: unknown[]) => void;
//     fbq?: (...args: unknown[]) => void;
//   }
// }

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setShow(true);
  }, []);

  const decide = (granted: boolean) => {
    localStorage.setItem("cookie-consent", granted ? "granted" : "denied");
    
    // Google Analytics Consent Update
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: granted ? "granted" : "denied",
        ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied",
      });
    }

    // Meta Pixel Consent Update
    if (typeof window !== "undefined" && window.fbq) {
      if (granted) {
        window.fbq("consent", "grant");
        window.fbq("track", "PageView");
      } else {
        window.fbq("consent", "revoke");
      }
    }

    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-neutral-700 bg-neutral-900/95 backdrop-blur px-4 py-4 text-sm text-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>
          We use cookies to analyse site traffic. You can accept or reject
          analytics cookies.{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => decide(false)}
            className="rounded-md border border-neutral-600 px-4 py-2 hover:bg-neutral-800"
          >
            Reject
          </button>
          <button
            onClick={() => decide(true)}
            className="rounded-md bg-white px-4 py-2 font-semibold text-neutral-900"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}