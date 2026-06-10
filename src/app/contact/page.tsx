// import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuoteForm } from "@/components/QuoteForm";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Metadata } from "next";

// export const Route = createFileRoute("/contact")({
//   head: () => ({
//     meta: [
//       { title: "Contact MotoBuy — Get a Free Motorbike Quote" },
//       { name: "description", content: "Get in touch with MotoBuy for a free, no-obligation motorbike valuation. Call, email or use our online quote form — we respond fast." },
//       { property: "og:title", content: "Contact MotoBuy" },
//       { property: "og:description", content: "Get a free motorbike quote today." },
//     ],
//   }),
//   component: ContactPage,
// });
export const metadata: Metadata = {
  title: "Contact MotoBuy — Get a Free Motorbike Quote",
  description: "Get in touch with MotoBuy for a free, no-obligation motorbike valuation. Call, email or use our online quote form — we respond fast.",
  openGraph: {
    title: "Contact MotoBuy",
    description: "Get a free motorbike quote today.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Get in touch</p>
          <h1 className="mt-4 font-display text-6xl tracking-tight md:text-7xl">
            Talk to a <span className="text-gradient-blue">Buyer.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Quotes in 60 seconds, collection often the same day. Reach out however suits you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-8">
        <div className="space-y-6">
          <a href="tel:08001234567" className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/60">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide">Call us</h3>
              <p className="mt-1 text-2xl font-semibold text-primary">0800 123 4567</p>
              <p className="mt-1 text-sm text-muted-foreground">Fastest way to get a quote — usually under a minute.</p>
            </div>
          </a>

          <a href="mailto:hello@motobuy.co.uk" className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/60">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide">Email</h3>
              <p className="mt-1 text-lg text-foreground">hello@motobuy.co.uk</p>
              <p className="mt-1 text-sm text-muted-foreground">Send photos of your bike — we will come back with a price.</p>
            </div>
          </a>

          <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide">Opening Hours</h3>
              <p className="mt-1 text-sm text-muted-foreground">Mon–Fri: 8am – 8pm</p>
              <p className="text-sm text-muted-foreground">Sat–Sun: 9am – 6pm</p>
            </div>
          </div>

          <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide">Coverage</h3>
              <p className="mt-1 text-sm text-muted-foreground">Nationwide collection across mainland UK — every postcode covered.</p>
            </div>
          </div>
        </div>

        <div>
          <QuoteForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
