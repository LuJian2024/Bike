import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone, PoundSterling, Truck, FileText, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works — Sell Your Motorbike in 3 Steps | MotoBuy",
  description: "Selling your motorbike with MotoBuy takes minutes. Get a quote, accept the offer, and we collect — same day, for free, anywhere in the UK.",
  openGraph: {
    title: "How It Works | MotoBuy",
    description: "Sell your motorbike in three quick steps.",
  },
};

const steps = [
  { icon: Phone, title: "1. Get Your Quote", text: "Call us or use the online form with your reg. We give you an instant, no-obligation valuation based on live market data." },
  { icon: PoundSterling, title: "2. Accept the Offer", text: "If you're happy with the price, just say yes. No haggling games, no hidden deductions on collection day." },
  { icon: Truck, title: "3. Free Collection", text: "We come to your home or work — same day where possible. UK nationwide, no charge ever." },
  { icon: FileText, title: "4. Get Paid", text: "Instant bank transfer the moment our driver inspects the bike. We handle all DVLA paperwork for you." },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">The process</p>
          <h1 className="mt-4 font-display text-6xl tracking-tight md:text-7xl">
            From Quote to <span className="text-gradient-blue">Cash.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            No paperwork stress. No hagging. No driving across the country to a dealer.
            Here is how easy it is.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="space-y-6">
          {steps.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/60 md:flex-row md:items-center"
            >
              <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-3xl tracking-wide">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-primary/40 bg-primary/5 p-10 text-center md:p-16">
          <h2 className="font-display text-4xl tracking-wide md:text-5xl">Ready to start?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Most quotes happen in under 60 seconds. There is nothing to lose.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="tel:08001234567" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow">
              <Phone className="h-4 w-4" /> 0800 123 4567
            </a>
            <Link href="/contact" className="group inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 font-medium hover:border-primary">
              Get a quote online
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
