import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from 'resend';

const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // 3MB po slika

const lookupSchema = z.object({
  registrationNumber: z
    .string()
    .min(1)
    .max(10)
    .transform((v) => v.replace(/\s+/g, "").toUpperCase()),
});


const submitSchema = z.object({
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
  }).optional(),
  // changed
    images: z.array(z.string()).optional(),

});

// export async function POST(request) {
//   let body;
//   try {
//     body = await request.json();
//     console.log("Request received:", body.name ? `Form submission: ${body.name}` : `Vehicle lookup: ${body.registrationNumber}`);
//   } catch (err) {
//     return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
//   }

// changed
export async function POST(request) {
  let body;
  let attachments = []; // NEW: slikite gi polnime tuka ako ima multipart

  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      // NEW: multipart branch — form submission SO sliki
      const form = await request.formData();
      body = {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        postcode: form.get("postcode"),
        registrationNumber: form.get("registrationNumber"),
        mileage: form.get("mileage"),
        condition: form.get("condition"),
        notes: form.get("notes") || "",
        vehicle: form.get("vehicle") ? JSON.parse(form.get("vehicle")) : undefined,
      };

     const files = form.getAll("images")
  .filter((f) => f && typeof f === "object" && "arrayBuffer" in f)
  .slice(0, MAX_IMAGES);

for (const [i, file] of files.entries()) {
  if (file.size > MAX_IMAGE_BYTES) continue;

  const buf = Buffer.from(await file.arrayBuffer());

  const ext = (file.name || "").split('.').pop()?.toLowerCase();
  const contentTypeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
  };
  const contentType = file.type || contentTypeMap[ext] || 'application/octet-stream';

  attachments.push({
    filename: (file.name || `photo-${i + 1}.jpg`).replace(/[^a-z0-9._-]/gi, "_"),
    content: buf.toString("base64"),
    contentType,
  });
}

console.log(`Multipart form: ${body.name}, ${attachments.length} image(s)`);

    } else {
      // Postoen JSON branch — vehicle lookup ILI form bez sliki
      body = await request.json();
      console.log("Request received:", body.name ? `Form submission: ${body.name}` : `Vehicle lookup: ${body.registrationNumber}`);
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

// end changed

  // Vehicle lookup
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
          taxStatus: v.taxStatus ?? null,
          motStatus: v.motStatus ?? null,
        },
      });
    } catch (err) {
      console.error("DVLA API error:", err);
      return NextResponse.json({ ok: false, error: "Vehicle lookup failed." }, { status: 500 });
    }
  }

  // Form submission (send email)
  if (body.name) {
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.errors);
      return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
    }

    const data = parsed.data;
    const reg = data.registrationNumber.toUpperCase();

    // 👇 新增：如果前端没有提供 vehicle 信息，后端自动获取
    let vehicleData = data.vehicle;
    console.log("前端有没有提供data.vehicle", vehicleData);

    if (!vehicleData && reg) {
      console.log("后端自动获取车辆信息:", reg);
      try {
        const dvlaRes = await fetch(
          "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
          {
            method: "POST",
            headers: {
              "x-api-key": process.env.DVLA_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ registrationNumber: reg }),
          }
        );

        if (dvlaRes.ok) {
          const v = await dvlaRes.json();
          vehicleData = {
            make: v.make ?? null,
            model: v.model ?? null,
            colour: v.colour ?? null,
            yearOfManufacture: v.yearOfManufacture ?? null,
            engineCapacity: v.engineCapacity ?? null,
            fuelType: v.fuelType ?? null,
            taxStatus: v.taxStatus ?? null,
            motStatus: v.motStatus ?? null,
          };
          console.log("后端自动获取成功");
        }
      } catch (err) {
        console.error("后端自动获取失败:", err);
      }
    }

    const v = vehicleData ?? {};
    console.log("v", v);
    console.log("Preparing to send email to company...");

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Send email to company
        console.log('📤 SENDING company email. Attachments count:', attachments.length);
  if (attachments.length > 0) {
    console.log('📎 First attachment sample:', {
      filename: attachments[0].filename,
      contentType: attachments[0].contentType,
      hasContent: !!attachments[0].content,
      contentLength: attachments[0].content?.length,
    });
  }
  // end changed 
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'CashForBikes <noreply@cashforbikes.co.uk>',
      to: ['julijana3uneva@gmail.com'],
        //from: 'CashForBikes <onboarding@resend.dev>',
        // to: ['jian.lu.ou@gmail.com'],
        // to: ['Urbanmoto18@gmail.com'],
        subject: `[New Quote] ${data.name} - ${reg}`,
        replyTo: data.email,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Postcode:</strong> ${data.postcode}</p>
          <p><strong>Registration:</strong> ${reg}</p>
          <p><strong>Mileage:</strong> ${data.mileage}</p>
          <p><strong>Condition:</strong> ${data.condition}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          ${v.make ? `<p><strong>Make:</strong> ${v.make}</p>` : ''}
          ${v.model ? `<p><strong>Model:</strong> ${v.model}</p>` : ''}
          ${v.yearOfManufacture ? `<p><strong>Year:</strong> ${v.yearOfManufacture}</p>` : ''}
          ${v.colour ? `<p><strong>Colour:</strong> ${v.colour}</p>` : ''}
          ${v.engineCapacity ? `<p><strong>Engine:</strong> ${v.engineCapacity}cc</p>` : ''}
        ${attachments.length > 0 ? `<p><i>${attachments.length} photo(s) attached.</i></p>` : ''}
      `,
      ...(attachments.length > 0 ? { attachments } : {}),
    });
 // 🔍 LOG 2 — што вратил Resend
  console.log('📨 RESEND response data:', emailData);
  console.log('❌ RESEND response error:', emailError);

  if (emailError) {
    console.error('Email sending failed FULL:', JSON.stringify(emailError, null, 2));
    return NextResponse.json({ ok: false, error: emailError.message || 'Failed' }, { status: 500 });
  }

  console.log('✅ Company email sent, id:', emailData?.id);
  // end changed
   
      await resend.emails.send({
        from: 'CashForBikes <noreply@cashforbikes.co.uk>', // Use the same verified domain
        to: [data.email],
        subject: 'CashForBikes - We received your quote request',
        html: `
          <h2>Thank you for contacting CashForBikes!</h2>
          <p>We have received your quote request for vehicle <strong>${reg}</strong>.</p>
          <p>Our team will contact you within <strong>30 minutes</strong> with the best price for your motorcycle.</p>
          <p>If you have any questions, please call us: <strong>0800 123 4567</strong></p>
          <hr />
          <p style="color: #666; font-size: 12px;">CashForBikes Team</p>
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