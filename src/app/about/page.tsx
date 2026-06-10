import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShieldCheck, Users, Award, MapPin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MotoBuy — UK's Trusted Motorbike Buyer",
  description: "MotoBuy is the UK's leading buyer of used and damaged motorbikes. Family-run, DVLA registered, paying the best prices nationwide.",
  openGraph: {
    title: "About MotoBuy",
    description: "Family-run, DVLA registered, paying the best prices nationwide.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">About us</p>
          <h1 className="mt-4 font-display text-6xl tracking-tight md:text-7xl">
            Riders Buying <span className="text-gradient-blue">From Riders.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            MotoBuy was founded by lifelong bikers who got tired of seeing mates ripped off when
            selling their bikes. We pay fair, honest prices for every motorbike — running or not.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "DVLA Registered", text: "Fully compliant motor trader. Your paperwork handled correctly, every time." },
            { icon: Users, title: "10,000+ Riders", text: "Thousands of bikers across the UK have sold to us — and would do it again." },
            { icon: Award, title: "Best Prices", text: "Live market data means we consistently beat dealer trade-in valuations." },
            { icon: MapPin, title: "UK Nationwide", text: "From Cornwall to Glasgow, our drivers collect anywhere in the UK." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <c.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl tracking-wide">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 rounded-3xl border border-border bg-card p-10 md:grid-cols-2 md:p-16">
          <div>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">Our Story</h2>
            <p className="mt-4 text-muted-foreground">
              MotoBuy started in a garage in 2015 with one ex-courier, one old Transit, and a
              stubborn belief that selling a motorbike should not be painful.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today we are a team of buyers, valuers and drivers covering every postcode in the
              UK — but the principle has not changed. Fair price, fast collection, no nonsense.
            </p>
          </div>
          <div>
            <h2 className="font-display text-4xl tracking-wide md:text-5xl">Our Promise</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li>· No hidden fees, no admin charges, no last-minute price drops.</li>
              <li>· Same-day payment via instant bank transfer.</li>
              <li>· We collect for free — you do not need to deliver.</li>
              <li>· DVLA notification handled by us, properly.</li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
