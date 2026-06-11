import { NextResponse } from "next/server";
import { z } from "zod";

// 1. Шема за валидација на возило (DVLA Lookup)
const lookupSchema = z.object({
  registrationNumber: z
    .string()
    .min(1)
    .max(10)
    .transform((v) => v.replace(/\s+/g, "").toUpperCase()),
});

// 2. Шема за валидација на форма за понуда (Submit Quote)
const submitSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(6).max(30),
  postcode: z.string().trim().min(3).max(12),
  registrationNumber: z.string().trim().min(1).max(10),
  mileage: z.string().trim().min(1).max(12),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor", "Heavily damaged / Non-runner"]),
  notes: z.string().trim().max(1000).optional().default(""),
  vehicle: z
    .object({
      make: z.string().nullable().optional(),
      model: z.string().nullable().optional(),
      colour: z.string().nullable().optional(),
      yearOfManufacture: z.number().nullable().optional(),
      engineCapacity: z.number().nullable().optional(),
      fuelType: z.string().nullable().optional(),
      motStatus: z.string().nullable().optional(),
      taxStatus: z.string().nullable().optional(),
    })
    .optional(),
});

// ГЛАВНА NEXT.JS ФУНКЦИЈА ЗА POST БАРАЊА
export async function POST(request) {
  try {
    const body = await request.json();

    if (body.name !== undefined) {
      const parsed = submitSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
      }

      const data = parsed.data;
      const reg = data.registrationNumber.toUpperCase();
      const v = data.vehicle ?? {};
      
      const vehicleLines = [
        v.make && `Make: ${v.make}`,
        v.model && `Model: ${v.model}`,
        v.yearOfManufacture && `Year: ${v.yearOfManufacture}`,
        v.colour && `Colour: ${v.colour}`,
        v.engineCapacity && `Engine: ${v.engineCapacity}cc`,
        v.fuelType && `Fuel: ${v.fuelType}`,
        v.motStatus && `MOT: ${v.motStatus}`,
        v.taxStatus && `Tax: ${v.taxStatus}`,
      ]
        .filter(Boolean)
        .join("\n");

      const bodyText =
        `New quote request from MotoBuy\n\n` +
        `--- Contact ---\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone}\n` +
        `Postcode: ${data.postcode}\n\n` +
        `--- Motorcycle ---\n` +
        `Registration: ${reg}\n` +
        `Mileage: ${data.mileage}\n` +
        `Condition: ${data.condition}\n` +
        (vehicleLines ? `\n${vehicleLines}\n` : "") +
        (data.notes ? `\n--- Notes ---\n${data.notes}\n` : "");

      const res = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/send-transactional-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
            Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY ?? ""}`,
          },
          body: JSON.stringify({
            templateName: "quote-request",
            recipientEmail: "julijana3uneva@gmail.com",
            idempotencyKey: `${reg}-${data.email}-${Date.now()}`,
            templateData: {
              name: data.name,
              email: data.email,
              phone: data.phone,
              postcode: data.postcode,
              registration: reg,
              mileage: data.mileage,
              condition: data.condition,
              notes: data.notes,
              vehicleLines,
              bodyText: bodyText,
            },
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Email send failed", res.status, txt);
        return NextResponse.json({ ok: true, queued: false });
      }

      return NextResponse.json({ ok: true, queued: true });
    }

    // ВТОРА АКЦИЈА: Ако нема име, тогаш само се ПРЕБАРАУВА ВОЗИЛО (DVLA Lookup)
    else {
      const parsed = lookupSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "Invalid registration format." }, { status: 400 });
      }

      const { registrationNumber } = parsed.data;
      const apiKey = process.env.DVLA_API_KEY;
      
      if (!apiKey) {
        return NextResponse.json({ ok: false, error: "Vehicle lookup is not configured." }, { status: 500 });
      }

      const res = await fetch(
        "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationNumber }),
        }
      );

      if (res.status === 404) {
        return NextResponse.json({ ok: false, error: "No vehicle found for that registration." }, { status: 404 });
      }

      if (!res.ok) {
        return NextResponse.json({ ok: false, error: "Vehicle lookup failed. Please try again." }, { status: res.status });
      }

      const v = await res.json();
      
      return NextResponse.json({
        ok: true,
        vehicle: {
          registrationNumber: v.registrationNumber ?? registrationNumber,
          make: v.make ?? null,
          model: v.model ?? null,
          colour: v.colour ?? null,
          yearOfManufacture: v.yearOfManufacture ?? null,
          engineCapacity: v.engineCapacity ?? null,
          fuelType: v.fuelType ?? null,
          co2Emissions: v.co2Emissions ?? null,
          taxStatus: v.taxStatus ?? null,
          taxDueDate: v.taxDueDate ?? null,
          motStatus: v.motStatus ?? null,
          motExpiryDate: v.motExpiryDate ?? null,
          markedForExport: v.markedForExport ?? null,
          monthOfFirstRegistration: v.monthOfFirstRegistration ?? null,
          dateOfLastV5CIssued: v.dateOfLastV5CIssued ?? null,
          wheelplan: v.wheelplan ?? null,
          typeApproval: v.typeApproval ?? null,
          revenueWeight: v.revenueWeight ?? null,
        },
      });
    }

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ ok: false, error: "Server error occurred." }, { status: 500 });
  }
}