// app/api/send/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // Nodemailer needs Node runtime
export const dynamic = "force-dynamic";

type Attendee = {
  first: string;
  last: string;
  attending: "yes" | "no";
};

type RsvpBody = {
  time?: string;
  attendees: Attendee[];
};

function normalize(s: unknown) {
  return (typeof s === "string" ? s : "").trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<RsvpBody> | null;

    if (!body || !Array.isArray(body.attendees)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Clean & validate attendees
    const raw = body.attendees.slice(0, 5); // cap at 5 to match your UI
    const attendees: Attendee[] = raw.map((a) => ({
      first: normalize(a?.first),
      last: normalize(a?.last),
      attending: (a?.attending === "no" ? "no" : "yes") as "yes" | "no",
    }));

    // Reject if any half-filled rows exist
    const halfFilled = attendees.find(
      (a) => (a.first && !a.last) || (!a.first && a.last)
    );
    if (halfFilled) {
      return NextResponse.json(
        { error: "Each provided guest must include both first and last name." },
        { status: 400 }
      );
    }

    // Keep only fully filled rows
    const filled = attendees.filter((a) => a.first && a.last);

    if (filled.length === 0) {
      return NextResponse.json(
        { error: "At least one guest must be provided." },
        { status: 400 }
      );
    }

    const time = normalize(body.time) || "19:00";

    const yesCount = filled.filter((a) => a.attending === "yes").length;
    const noCount = filled.length - yesCount;

    const attendingText = (a: Attendee) =>
      a.attending === "yes"
        ? "Po — Pranoj me Kënaqësi (YES)"
        : "Jo — Refuzoj me Keqardhje (NO)";

    // Build email content
    const listHtml = filled
      .map(
        (a, i) =>
          `<li><strong>${i + 1}.</strong> <strong>${escapeHtml(
            a.first
          )} ${escapeHtml(a.last)}</strong> — ${attendingText(a)}</li>`
      )
      .join("");

    const html = `
      <h2>RSVP i ri</h2>
      <p><strong>Orari:</strong> ${escapeHtml(time)}</p>
      <p><strong>Totali i të ftuarve:</strong> ${
        filled.length
      } (Po: ${yesCount}, Jo: ${noCount})</p>
      <ol>
        ${listHtml}
      </ol>
    `;

    const listText = filled
      .map(
        (a, i) =>
          `${i + 1}. ${a.first} ${a.last} — ${
            a.attending === "yes"
              ? "Po — Pranoj me Kënaqësi (YES)"
              : "Jo — Refuzoj me Keqardhje (NO)"
          }`
      )
      .join("\n");

    const text = `
RSVP i ri
Orari: ${time}
Totali i të ftuarve: ${filled.length} (Po: ${yesCount}, Jo: ${noCount})

${listText}
`.trim();

    // Transport (Gmail with App Password)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.RSVP_FROM, // e.g. "mehmetdheantia@gmail.com"
        pass: process.env.RSVP_PASS, // 16-char Gmail App Password
      },
    });

    // Optional: verify connection (useful while debugging)
    // await transporter.verify();

    const subjectLeadNames = filled
      .slice(0, 2)
      .map((a) => `${a.first} ${a.last}`)
      .join(", ");
    const subjectSuffix = filled.length > 2 ? ` +${filled.length - 2}` : "";
    const subject = `RSVP — ${filled.length} person(a) — ${subjectLeadNames}${subjectSuffix}`;

    await transporter.sendMail({
      from: `"Wedding RSVP" <${process.env.RSVP_FROM}>`,
      to: "haxhirajpaliantia@gmail.com",
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}

/** Very small HTML escape helper to avoid broken markup */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
