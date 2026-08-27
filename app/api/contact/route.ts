import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  location?: unknown;
  subject?: unknown;
  message?: unknown;
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] as string,
  );

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const enquiry = {
      name: clean(body.name, 100),
      email: clean(body.email, 254),
      phone: clean(body.phone, 30),
      location: clean(body.location, 100),
      subject: clean(body.subject, 150),
      message: clean(body.message, 5000),
    };

    if (
      !enquiry.name ||
      !enquiry.phone ||
      !enquiry.subject ||
      !enquiry.message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)
    ) {
      return NextResponse.json(
        { error: "Invalid form submission." },
        { status: 400 },
      );
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL } =
      process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
      console.error("Contact form SMTP environment variables are missing.");
      return NextResponse.json(
        { error: "Mail service is not configured." },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: Number(SMTP_PORT || 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    const safe = Object.fromEntries(
      Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(value)]),
    );
    await transporter.sendMail({
      from: `Daniel Charles Evans website <${SMTP_USER}>`,
      to: CONTACT_TO_EMAIL || SMTP_USER,
      replyTo: enquiry.email,
      subject: `Website enquiry: ${enquiry.subject.replace(/[\r\n]/g, " ")}`,
      text: `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nLocation: ${enquiry.location}\n\n${enquiry.message}`,
      html: `<h2>New website enquiry</h2><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Location:</strong> ${safe.location}</p><p><strong>Subject:</strong> ${safe.subject}</p><p style="white-space:pre-wrap">${safe.message}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 500 },
    );
  }
}
