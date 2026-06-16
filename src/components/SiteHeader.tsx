"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
<Link href="/" className="flex items-center font-sans font-black text-xl uppercase tracking-tight gap-1">
  <span className="text-foreground">CASH</span>
  <span className="bg-primary text-primary-foreground px-1.5 py-0.5 text-base rounded font-black tracking-normal">FOR</span>
  <span className="text-foreground">BIKES</span>
</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${usePathname() === n.to ? "text-primary font-bold" : "text-muted-foreground"}`}
              // className="text-sm font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground md:flex"
        >
          <ClipboardCheck className="h-4 w-4" />
          Get a Quote
        </Link>

        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="flex flex-col px-4 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                // className="py-3 text-sm font-medium uppercase tracking-wide text-muted-foreground"
                className={`py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${usePathname() === n.to ? "text-primary font-bold" : "text-muted-foreground"}`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <ClipboardCheck className="h-4 w-4" /> Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
