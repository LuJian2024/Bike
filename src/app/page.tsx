"use client";
import Link from "next/link";
import { Wrench, ClipboardCheck, AlertTriangle, XCircle, Bike, Phone, Truck, PoundSterling, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import heroImg from "@/assets/hero-3.png";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuoteForm } from "@/components/QuoteForm";

export default function page() {
  return <Home />;
}

const bikeTypes = [
  { icon: Wrench, title: "Damaged", text: "Crash damage, vandalism, or wear and tear — we'll make an offer on any condition." },
  { icon: XCircle, title: "Non-Runners", text: "Engine won't start? Not roadworthy? No problem. Fair price, same-day collection." },
  { icon: AlertTriangle, title: "MOT Failures", text: "Has your bike failed its MOT? We'll buy it whether it has a valid MOT or not." },
  { icon: Bike, title: "Unwanted", text: "Upgrading or just done riding? Speak to us for a fair price and quick pickup." },
];

const steps = [
  { icon: Phone, title: "Get a Quote", text: "Call us or fill out the form with your reg — instant valuation." },
  { icon: PoundSterling, title: "Accept the Offer", text: "We pay the most. No hidden fees, no admin charges, no hassle." },
  { icon: Truck, title: "Free Collection", text: "We come to you, same day if possible — anywhere in the UK." },
];

const stats = [
  { value: "10,000+", label: "Bikes Bought" },
  { value: "24h", label: "Avg Collection" },
  { value: "£100M+", label: "Paid Out" },
  { value: "4.9★", label: "Customer Rating" },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <Image
  src={heroImg}
  alt="Close-up of a rusty vintage motorcycle engine with chrome exhaust"
  fill
  priority
  className="absolute inset-0 h-full w-full object-cover opacity-60"
/>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-32">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              UK Nationwide · Same-Day Collection
            </div>
            <h1 className="mt-6 break-words font-display text-5xl leading-none tracking-tight sm:text-6xl md:text-8xl">
              We Buy <br />
              <span className="text-gradient-blue">Any Motorbike.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              The fastest way to turn your bike into cash. Damaged, non-runner, MOT failed
              or just unwanted — we pay the most, and we collect for free.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
               <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow"
              >
                <ClipboardCheck className="h-4 w-4" />
                Get a Free Quote
              </Link>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground hover:text-primary"
              >
                How it works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> DVLA Registered
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Fast Payment
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" /> Free Collection
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full">
               <QuoteForm /> 
            </div>
          </div>
        </div>
      </section>

      {/* Highlight strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl text-primary md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* We Take Any Bike */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">What we buy</p>
          <h2 className="mt-3 font-display text-5xl md:text-6xl">We Will Take Any Bike</h2>
          <p className="mt-4 text-muted-foreground">
            Whatever the make, model or condition — if it is a motorbike, we want it.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bikeTypes.map((b) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/60 hover:shadow-glow"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl tracking-wide">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">How it works</p>
            <h2 className="mt-3 font-display text-5xl md:text-6xl">Cash in 3 Steps</h2>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-background p-8">
                <div className="absolute -top-5 left-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground shadow-glow">
                  {i + 1}
                </div>
                <s.icon className="mt-4 h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-2xl tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center md:px-8">
          <h2 className="font-display text-5xl tracking-tight md:text-7xl">
            Ready to <span className="text-gradient-blue">Sell?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Get a free, no-obligation quote in 60 seconds. Same-day collection available
            across the UK.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow"
            >
              <ClipboardCheck className="h-4 w-4" /> Get a Free Quote
            </Link>
            {/* <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 font-medium transition-colors hover:border-primary"
            >
              Get a quote online
            </Link> */}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
