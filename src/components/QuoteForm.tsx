import { useState } from "react";
// import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
// import { lookupVehicle, submitQuote } from "@/app/api/quote/route.js";

type Vehicle = {
  registrationNumber: string;
  make: string | null;
  model: string | null;
  color: string | null;
  yearOfManufacture: number | null;
  engineCapacity: number | null;
  fuelType: string | null;
  motStatus: string | null;
  taxStatus: string | null;
};

const CONDITIONS = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Heavily damaged / Non-runner",
] as const;

export function QuoteForm({ compact = false }: { compact?: boolean }) {
//   const lookupFn = useServerFn(lookupVehicle);
//   const submitFn = useServerFn(submitQuote);

  const [reg, setReg] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [mileage, setMileage] = useState("");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number] | "">("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

 async function handleLookup() {
    setLookupError(null);
    setVehicle(null);
    if (!reg.trim()) return;
    setLookupLoading(true);
    try {
      // ПОПРАВЕНО: Наместо lookupVehicle(...), правиме чист fetch до нашето API
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: reg }),
      });
      
      const res = await response.json();
      if (res.ok) setVehicle(res.vehicle);
      else setLookupError(res.error || "Lookup failed. Please try again.");
    } catch {
      setLookupError("Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!condition) {
      setSubmitError("Please select the bike's condition.");
      return;
    }
    setSubmitting(true);
    try {
      // ПОПРАВЕНО: Наместо submitQuote(...), и тука правиме fetch до истото API
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          postcode,
          registrationNumber: reg,
          mileage,
          condition,
          notes,
          vehicle: vehicle ?? undefined,
        }),
      });

      const res = await response.json();
      if (res.ok) setSubmitted(true);
      else setSubmitError(res.error || "Something went wrong. Please try again.");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-2xl text-primary">We have got your details!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          One of our buyers will contact you as soon as possible with a free, no-obligation
          quote.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 font-display text-2xl text-primary">We have got your details!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          One of our buyers will contact you as soon as possible with a free, no-obligation
          quote.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-border bg-card p-6 shadow-card ${compact ? "" : "md:p-8"}`}
    >
      <h3 className="font-display text-2xl tracking-wide">Get Your Free Quote</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your reg — we will fetch the bikes details automatically.
      </p>

      <div className="mt-5 space-y-4">
        {/* Registration + lookup */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Registration *
          </label>
          <div className="flex gap-2">
            <input
              required
              value={reg}
              onChange={(e) => setReg(e.target.value.toUpperCase())}
              placeholder="AB12 CDE"
              className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-center font-display text-2xl uppercase tracking-widest placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={handleLookup}
              disabled={lookupLoading || !reg.trim()}
              className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
            >
              {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look up"}
            </button>
          </div>
          {lookupError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {lookupError}
            </p>
          )}
        </div>

        {/* Vehicle details card */}
        {vehicle && (
          <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
              We found your bike
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {vehicle.make && <Row label="Make" value={vehicle.make} />}
              {vehicle.yearOfManufacture && (
                <Row label="Year" value={String(vehicle.yearOfManufacture)} />
              )}
              {vehicle.colour && <Row label="Colour" value={vehicle.colour} />}
              {vehicle.engineCapacity && (
                <Row label="Engine" value={`${vehicle.engineCapacity}cc`} />
              )}
              {vehicle.fuelType && <Row label="Fuel" value={vehicle.fuelType} />}
              {vehicle.motStatus && <Row label="MOT" value={vehicle.motStatus} />}
              {vehicle.taxStatus && <Row label="Tax" value={vehicle.taxStatus} />}
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Mileage *"
            required
            value={mileage}
            onChange={setMileage}
            placeholder="e.g. 12,450"
          />
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Condition *
            </label>
            <select
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value as (typeof CONDITIONS)[number])}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select…</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Your name *" required value={name} onChange={setName} />
          <Field
            label="Phone *"
            required
            type="tel"
            value={phone}
            onChange={setPhone}
          />
          <Field
            label="Email *"
            required
            type="email"
            value={email}
            onChange={setEmail}
          />
          <Field label="Postcode *" required value={postcode} onChange={setPostcode} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Anything we should know? (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Modifications, service history, damage…"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {submitError && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Get My Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          We will contact you as soon as possible — usually within 30 minutes.
        </p>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
