"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How quickly can you collect my bike?", a: "In most cases we can collect the same day, especially within major UK cities. For more remote postcodes it's usually next day." },
  { q: "Will you buy a bike with no MOT?", a: "Absolutely. We buy bikes regardless of MOT status, including failures and bikes that have been off the road for years." },
  { q: "Do you buy damaged or Cat N / Cat S bikes?", a: "Yes — damaged, crashed, theft-recovered, Cat N, Cat S, Cat C, Cat D — we'll make a fair offer on any of them." },
  { q: "How do you pay?", a: "Instant bank transfer the moment our driver inspects the bike. Cash is also available on request." },
  { q: "Do I need to be the registered keeper?", a: "Usually yes, but we can sometimes help if you've recently inherited a bike or have other paperwork. Just give us a call." },
  { q: "Is collection really free?", a: "Yes, always. Anywhere in mainland UK. We never add charges for collection, paperwork or admin." },
  { q: "What documents do I need?", a: "V5C log book, MOT (if you have one), service history if available, and both keys if possible. Don't worry if anything is missing — we can usually still buy." },
  { q: "What happens to the V5?", a: "We notify the DVLA on your behalf as soon as the sale completes, so you're protected from any future liabilities." },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Questions</p>
          <h1 className="mt-4 font-display text-6xl tracking-tight md:text-7xl">
            Frequently <span className="text-gradient-blue">Asked.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Quick answers to the things people ask us most. Still stuck? Give us a ring.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 md:px-8">
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-xl border bg-card transition-all ${
                  isOpen ? "border-primary/60 shadow-glow" : "border-border"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-display text-lg tracking-wide md:text-xl">{f.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-primary" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-muted-foreground">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
