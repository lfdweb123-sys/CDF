import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { contactFormSchema } from "@/lib/validations/forms";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";
import { isRateLimited, clientIpFrom } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`contact:${clientIpFrom(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const parsed = contactFormSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide.", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  await adminDb.collection("contact_messages").add({ ...data, createdAt: new Date().toISOString() });

  await sendTransactionalEmail({
    to: [{ email: process.env.BREVO_SENDER_EMAIL ?? "" }],
    subject: `Nouveau message de contact — ${data.subject}`,
    htmlContent: baseEmailTemplate({
      title: "Nouveau message de contact",
      bodyHtml: `
        <p>De : ${data.name} — ${data.email}${data.phone ? ` — ${data.phone}` : ""}</p>
        <p>Sujet : ${data.subject}</p>
        <p>${data.message.replace(/\n/g, "<br/>")}</p>
      `,
    }),
    replyTo: { email: data.email, name: data.name },
  }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
