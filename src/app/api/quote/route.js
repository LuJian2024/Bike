// import { NextResponse } from "next/server";
// import { z } from "zod";

// // 1. Шема за валидација на возило (DVLA Lookup)
// const lookupSchema = z.object({
//   registrationNumber: z
//     .string()
//     .min(1)
//     .max(10)
//     .transform((v) => v.replace(/\s+/g, "").toUpperCase()),
// });

// // 2. Шема за валидација на форма за понуда (Submit Quote)
// const submitSchema = z.object({
//   name: z.string().trim().min(2).max(80),
//   email: z.string().trim().email().max(160),
//   phone: z.string().trim().min(6).max(30),
//   postcode: z.string().trim().min(3).max(12),
//   registrationNumber: z.string().trim().min(1).max(10),
//   mileage: z.string().trim().min(1).max(12),
//   condition: z.enum(["Excellent", "Good", "Fair", "Poor", "Heavily damaged / Non-runner"]),
//   notes: z.string().trim().max(1000).optional().default(""),
//   vehicle: z
//     .object({
//       make: z.string().nullable().optional(),
//       model: z.string().nullable().optional(),
//       colour: z.string().nullable().optional(),
//       yearOfManufacture: z.number().nullable().optional(),
//       engineCapacity: z.number().nullable().optional(),
//       fuelType: z.string().nullable().optional(),
//       motStatus: z.string().nullable().optional(),
//       taxStatus: z.string().nullable().optional(),
//     })
//     .optional(),
// });

// // ГЛАВНА NEXT.JS ФУНКЦИЈА ЗА POST БАРАЊА
// export async function POST(request) {
//   try {
//     const body = await request.json();

//     if (body.name !== undefined) {
//       const parsed = submitSchema.safeParse(body);
//       if (!parsed.success) {
//         return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
//       }

//       const data = parsed.data;
//       const reg = data.registrationNumber.toUpperCase();
//       const v = data.vehicle ?? {};

//       const vehicleLines = [
//         v.make && `Make: ${v.make}`,
//         v.model && `Model: ${v.model}`,
//         v.yearOfManufacture && `Year: ${v.yearOfManufacture}`,
//         v.colour && `Colour: ${v.colour}`,
//         v.engineCapacity && `Engine: ${v.engineCapacity}cc`,
//         v.fuelType && `Fuel: ${v.fuelType}`,
//         v.motStatus && `MOT: ${v.motStatus}`,
//         v.taxStatus && `Tax: ${v.taxStatus}`,
//       ]
//         .filter(Boolean)
//         .join("\n");

//       const bodyText =
//         `New quote request from MotoBuy\n\n` +
//         `--- Contact ---\n` +
//         `Name: ${data.name}\n` +
//         `Email: ${data.email}\n` +
//         `Phone: ${data.phone}\n` +
//         `Postcode: ${data.postcode}\n\n` +
//         `--- Motorcycle ---\n` +
//         `Registration: ${reg}\n` +
//         `Mileage: ${data.mileage}\n` +
//         `Condition: ${data.condition}\n` +
//         (vehicleLines ? `\n${vehicleLines}\n` : "") +
//         (data.notes ? `\n--- Notes ---\n${data.notes}\n` : "");

//       const res = await fetch(
//         `${process.env.SUPABASE_URL}/functions/v1/send-transactional-email`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
//             Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY ?? ""}`,
//           },
//           body: JSON.stringify({
//             templateName: "quote-request",
//             recipientEmail: "julijana3uneva@gmail.com",
//             idempotencyKey: `${reg}-${data.email}-${Date.now()}`,
//             templateData: {
//               name: data.name,
//               email: data.email,
//               phone: data.phone,
//               postcode: data.postcode,
//               registration: reg,
//               mileage: data.mileage,
//               condition: data.condition,
//               notes: data.notes,
//               vehicleLines,
//               bodyText: bodyText,
//             },
//           }),
//         }
//       );

//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         console.error("Email send failed", res.status, txt);
//         return NextResponse.json({ ok: true, queued: false });
//       }

//       return NextResponse.json({ ok: true, queued: true });
//     }

//     // ВТОРА АКЦИЈА: Ако нема име, тогаш само се ПРЕБАРАУВА ВОЗИЛО (DVLA Lookup)
//     else {
//       const parsed = lookupSchema.safeParse(body);
//       if (!parsed.success) {
//         return NextResponse.json({ ok: false, error: "Invalid registration format." }, { status: 400 });
//       }

//       const { registrationNumber } = parsed.data;
//       const apiKey = process.env.DVLA_API_KEY;

//       if (!apiKey) {
//         return NextResponse.json({ ok: false, error: "Vehicle lookup is not configured." }, { status: 500 });
//       }

//       const res = await fetch(
//         "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
//         {
//           method: "POST",
//           headers: {
//             "x-api-key": apiKey,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ registrationNumber }),
//         }
//       );

//       if (res.status === 404) {
//         return NextResponse.json({ ok: false, error: "No vehicle found for that registration." }, { status: 404 });
//       }

//       if (!res.ok) {
//         return NextResponse.json({ ok: false, error: "Vehicle lookup failed. Please try again." }, { status: res.status });
//       }

//       const v = await res.json();

//       return NextResponse.json({
//         ok: true,
//         vehicle: {
//           registrationNumber: v.registrationNumber ?? registrationNumber,
//           make: v.make ?? null,
//           model: v.model ?? null,
//           colour: v.colour ?? null,
//           yearOfManufacture: v.yearOfManufacture ?? null,
//           engineCapacity: v.engineCapacity ?? null,
//           fuelType: v.fuelType ?? null,
//           co2Emissions: v.co2Emissions ?? null,
//           taxStatus: v.taxStatus ?? null,
//           taxDueDate: v.taxDueDate ?? null,
//           motStatus: v.motStatus ?? null,
//           motExpiryDate: v.motExpiryDate ?? null,
//           markedForExport: v.markedForExport ?? null,
//           monthOfFirstRegistration: v.monthOfFirstRegistration ?? null,
//           dateOfLastV5CIssued: v.dateOfLastV5CIssued ?? null,
//           wheelplan: v.wheelplan ?? null,
//           typeApproval: v.typeApproval ?? null,
//           revenueWeight: v.revenueWeight ?? null,
//         },
//       });
//     }

//   } catch (err) {
//     console.error("API Error:", err);
//     return NextResponse.json({ ok: false, error: "Server error occurred." }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from 'resend';  // 👈 添加这个导入

// 初始化 Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
    console.log("Received body:", JSON.stringify(body, null, 2)); // 👈 添加这行

    if (body.name !== undefined) {
      const parsed = submitSchema.safeParse(body);
      if (!parsed.success) {
        console.log("Validation errors:", parsed.error.errors); // 👈 添加这行
        return NextResponse.json({
          ok: false,
          error: "Invalid form data.",
          details: parsed.error.errors  // 👈 返回具体错误 
        },
          { status: 400 });
      }

      const data = parsed.data;
      const reg = data.registrationNumber.toUpperCase();
      const v = data.vehicle ?? {};

      // 构建车辆信息 HTML
      const vehicleHtml = `
        <div style="margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0;">Vehicle Details:</h3>
          ${v.make ? `<p><strong>Make:</strong> ${v.make}</p>` : ''}
          ${v.model ? `<p><strong>Model:</strong> ${v.model}</p>` : ''}
          ${v.yearOfManufacture ? `<p><strong>Year:</strong> ${v.yearOfManufacture}</p>` : ''}
          ${v.colour ? `<p><strong>Colour:</strong> ${v.colour}</p>` : ''}
          ${v.engineCapacity ? `<p><strong>Engine:</strong> ${v.engineCapacity}cc</p>` : ''}
          ${v.fuelType ? `<p><strong>Fuel:</strong> ${v.fuelType}</p>` : ''}
          ${v.motStatus ? `<p><strong>MOT:</strong> ${v.motStatus}</p>` : ''}
          ${v.taxStatus ? `<p><strong>Tax:</strong> ${v.taxStatus}</p>` : ''}
        </div>
      `;

      // 👇 用 Resend 发送邮件
      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'MotoBuy <onboarding@resend.dev>', // 测试用，上线后改成你的域名
          // to: ['julijana3uneva@gmail.com'], // 公司邮箱
          to: ['jian.lu.ou@gmail.com'], // 公司邮箱
          subject: `【New Quote】${data.name} - ${reg}`,
          replyTo: data.email,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                h2 { color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px; }
                .info-block { margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
                .label { font-weight: bold; color: #555; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>🚗 New Quote Request</h2>
                
                <div class="info-block">
                  <h3>Customer Information:</h3>
                  <p><span class="label">Name:</span> ${data.name}</p>
                  <p><span class="label">Email:</span> ${data.email}</p>
                  <p><span class="label">Phone:</span> ${data.phone}</p>
                  <p><span class="label">Postcode:</span> ${data.postcode}</p>
                </div>

                <div class="info-block">
                  <h3>Motorcycle Information:</h3>
                  <p><span class="label">Registration:</span> ${reg}</p>
                  <p><span class="label">Mileage:</span> ${data.mileage}</p>
                  <p><span class="label">Condition:</span> ${data.condition}</p>
                </div>

                ${vehicleHtml}

                ${data.notes ? `
                <div class="info-block">
                  <h3>Additional Notes:</h3>
                  <p>${data.notes}</p>
                </div>
                ` : ''}

                <div class="info-block" style="background: #e8f4e8;">
                  <p style="margin: 0;">📞 <strong>Action Required:</strong> Please contact the customer within 30 minutes with a quote.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        if (emailError) {
          console.error("Resend email failed:", emailError);
          return NextResponse.json({ ok: true, queued: false, error: "Email sending failed" });
        }

        console.log("Email sent successfully:", emailData);

        // 可选：发送确认邮件给客户
        await sendCustomerConfirmation(data).catch(e => console.error("Customer email failed:", e));

        return NextResponse.json({ ok: true, queued: true });

      } catch (emailErr) {
        console.error("Email error:", emailErr);
        return NextResponse.json({ ok: true, queued: false, error: "Email service error" });
      }
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

// 添加客户确认邮件函数
async function sendCustomerConfirmation(data) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'MotoBuy <onboarding@resend.dev>',
    to: [data.email],
    subject: 'MotoBuy - We received your quote request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Thank you, ${data.name}!</h2>
        <p>We have received your quote request for vehicle <strong>${data.registrationNumber}</strong>.</p>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;">Our team will contact you within <strong>30 minutes</strong> with the best price for your motorcycle.</p>
        </div>
        
        <p>If you have any questions, call us: <strong>0800 123 4567</strong></p>
        
        <hr style="margin: 30px 0;" />
        <p style="color: #666; font-size: 12px;">MotoBuy Team</p>
      </div>
    `,
  });
}