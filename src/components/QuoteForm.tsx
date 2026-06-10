"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <h3 className="font-display text-2xl text-primary">Thanks — we will be in touch!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          One of our buyers will call you within 30 minutes with a free, no-obligation quote.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className={`rounded-2xl border border-border bg-card p-6 shadow-card ${compact ? "" : "md:p-8"}`}
    >
      <h3 className="font-display text-2xl tracking-wide">Get Your Free Quote</h3>
      <p className="mt-1 text-sm text-muted-foreground">Enter your reg — we will call you back fast.</p>

      <div className="mt-5 space-y-3">
        <input
          required
          placeholder="REGISTRATION"
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-center font-display text-2xl uppercase tracking-widest placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            placeholder="Your name"
            className="rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            className="rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <input
          placeholder="Postcode"
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
        />

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow"
        >
          Get My Quote
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Do not know the reg?{" "}
          <a href="/contact" className="text-primary underline">Use the long form</a>
        </p>
      </div>
    </form>
  );
}
