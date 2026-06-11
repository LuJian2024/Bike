import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl tracking-wider">
            <span>MOTO</span>
            <span className="rounded bg-primary px-2 py-0.5 text-primary-foreground">BUY</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            We buy any motorbike across the UK. Fast, fair, free same-day collection.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm uppercase tracking-widest text-primary">Pages</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/how-it-works" className="hover:text-primary">How It Works</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm uppercase tracking-widest text-primary">We Buy</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Damaged Bikes</li>
            <li>Non-Runners</li>
            <li>MOT Failures</li>
            <li>Unwanted Bikes</li>
            <li>Cat N / Cat S</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm uppercase tracking-widest text-primary">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /><span>0800 123 4567</span></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /><span>hello@motobuy.co.uk</span></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>Nationwide collection, UK</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} MotoBuy. All rights reserved.</span>
      </div>
    </footer>
  );
}
