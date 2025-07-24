import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // ensure Node runtime (not Edge) for Nodemailer
export const dynamic = "force-dynamic";

type Body = {
  first: string;
  last: string;
  attending: "yes" | "no";
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body.first || !body.last || !body.attending) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const attendingText =
      body.attending === "yes"
        ? "Pranoj me Kënaqësi (YES)"
        : "Refuzoj me Keqardhje (NO)";

    const html = `
      <h2>RSVP i ri</h2>
      <p><strong>Emri:</strong> ${body.first} ${body.last}</p>
      <p><strong>Pjesëmarrja:</strong> ${attendingText}</p>
      <p><strong>Orari:</strong> 19:00</p>
    `;

    const text = `
Emri: ${body.first} ${body.last}
Pjesëmarrja: ${attendingText}
Orari: 19:00
`.trim();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.RSVP_FROM, // your Gmail address
        pass: process.env.RSVP_PASS, // your Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"Wedding RSVP" <${process.env.RSVP_FROM}>`,
      to: "haxhirajpaliantia@gmail.com",
      subject: `RSVP - ${body.first} ${body.last}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
