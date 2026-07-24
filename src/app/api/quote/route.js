import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const MAX_IMAGES = 10;

const lookupSchema = z.object({
  registrationNumber: z.string().min(1).max(10)
    .transform((v) => v.replace(/\s+/g, "").toUpperCase()),
});

const submitSchema = z.object({
  model: z.string().trim().max(80).optional().nullable(),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(1).max(30),
  postcode: z.string().trim().min(1).max(12),
  registrationNumber: z.string().trim().min(1).max(10),
  mileage: z.string().trim().min(1).max(12),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor", "Heavily damaged / Non-runner"]),
  notes: z.string().trim().max(1000).optional().default(""),
  vehicle: z.object({
    registrationNumber: z.string().optional(),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    colour: z.string().nullable().optional(),
    yearOfManufacture: z.number().nullable().optional(),
    engineCapacity: z.number().nullable().optional(),
    fuelType: z.string().nullable().optional(),
    motStatus: z.string().nullable().optional(),
    taxStatus: z.string().nullable().optional(),
    monthOfFirstRegistration: z.string().nullable().optional(),
    dateOfLastV5CIssued: z.string().nullable().optional(),
  }).optional(),
  images: z.array(z.object({
    name: z.string().max(120),
    dataUrl: z.string().max(3_000_000),
  })).max(MAX_IMAGES).optional().default([]),
});

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // --- Vehicle lookup ---
  if (body.registrationNumber && !body.name) {
    const parsed = lookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid registration format." }, { status: 400 });
    }
    const { registrationNumber } = parsed.data;
    const apiKey = process.env.DVLA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Vehicle lookup is not configured." }, { status: 500 });
    }
    try {
      const res = await fetch(
        "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
        {
          method: "POST",
          headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
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
          taxStatus: v.taxStatus ?? null,
          motStatus: v.motStatus ?? null,
          monthOfFirstRegistration: v.monthOfFirstRegistration ?? null,
          dateOfLastV5CIssued: v.dateOfLastV5CIssued ?? null,
        },
      });
    } catch (err) {
      console.error("DVLA API error:", err);
      return NextResponse.json({ ok: false, error: "Vehicle lookup failed." }, { status: 500 });
    }
  }

  // --- Form submission ---
  if (body.name) {
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.errors);
      return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
    }
    const data = parsed.data;
    const reg = data.registrationNumber.toUpperCase();

    // Build attachments from base64 data URLs
    const attachments = (data.images ?? []).map((img, i) => {
      const match = img.dataUrl.match(/^data:(image\/[-+.\w]+);base64,(.+)$/);
      const contentType = match?.[1] ?? "image/jpeg";
      const base64 = match?.[2] ?? img.dataUrl.replace(/^data:[^,]+,/, "");
      const filename = (img.name || `photo-${i + 1}.jpg`).replace(/[^a-z0-9._-]/gi, "_");
      return { filename, content: base64, contentType };
    });

    const v = data.vehicle ?? {};
    const html = `
      <h2>New Quote Request — Cash For Bikes</h2>
      <h3>Contact</h3>
      <p><b>Name:</b> ${esc(data.name)}<br>
      <b>Phone:</b> ${esc(data.phone)}<br>
      <b>Email:</b> ${esc(data.email)}<br>
      <b>Postcode:</b> ${esc(data.postcode)}</p>
      <h3>Motorcycle</h3>
      <p><b>Registration:</b> ${esc(reg)}<br>
      <b>Mileage:</b> ${esc(data.mileage)}<br>
      ${data.model ? `<b>Model (user):</b> ${esc(data.model)}<br>` : ""}
      <b>Condition:</b> ${esc(data.condition)}</p>
      ${v.make || v.model || v.yearOfManufacture ? `
        <h3>DVLA Details</h3>
        <p>
          ${v.make ? `<b>Make:</b> ${esc(v.make)}<br>` : ""}
          ${v.model ? `<b>Model:</b> ${esc(v.model)}<br>` : ""}
          ${v.yearOfManufacture ? `<b>Year:</b> ${v.yearOfManufacture}<br>` : ""}
          ${v.colour ? `<b>Colour:</b> ${esc(v.colour)}<br>` : ""}
          ${v.engineCapacity ? `<b>Engine:</b> ${v.engineCapacity}cc<br>` : ""}
          ${v.fuelType ? `<b>Fuel:</b> ${esc(v.fuelType)}<br>` : ""}
          ${v.motStatus ? `<b>MOT:</b> ${esc(v.motStatus)}<br>` : ""}
          ${v.taxStatus ? `<b>Tax:</b> ${esc(v.taxStatus)}<br>` : ""}
          ${v.monthOfFirstRegistration ? `<b>First Registration:</b> ${esc(v.monthOfFirstRegistration)}<br>` : ""}
          ${v.dateOfLastV5CIssued ? `<b>Last V5C Issued:</b> ${esc(v.dateOfLastV5CIssued)}` : ""}
        </p>` : ""}
      ${data.notes ? `<h3>Notes</h3><p>${esc(data.notes)}</p>` : ""}
      ${attachments.length ? `<p><i>${attachments.length} photo(s) attached.</i></p>` : ""}
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "CashForBikes <noreply@cashforbikes.co.uk>",
         to: ["julijana3uneva@gmail.com"],
        // to: ['Urbanmoto18@gmail.com'],
        replyTo: data.email,
        subject: `[New Quote] ${data.name} - ${reg}${attachments.length ? ` (${attachments.length} photo${attachments.length > 1 ? "s" : ""})` : ""}`,
        html,
        ...(attachments.length ? { attachments } : {}),
      });

      if (emailError) {
        console.error("Resend error:", JSON.stringify(emailError, null, 2));
        return NextResponse.json({ ok: false, error: emailError.message || "Failed" }, { status: 500 });
      }
      console.log("✅ Company email sent:", emailData?.id);

      // Confirmation to customer
      await resend.emails.send({
        from: "CashForBikes <noreply@cashforbikes.co.uk>",
        to: [data.email],
        subject: "CashForBikes - We received your quote request",
        html: `
          <h2>Thank you for contacting CashForBikes!</h2>
          <p>We have received your quote request for vehicle <b>${esc(reg)}</b>.</p>
          <p>Our team will contact you as soon as possible with a free, no-obligation quote.</p>
          <p>— CashForBikes Team</p>
        `,
      });

      return NextResponse.json({ ok: true, queued: true });
    } catch (err) {
      console.error("Email sending error:", err);
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
}
