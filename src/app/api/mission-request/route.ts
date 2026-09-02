import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { missionRequestSchema } from "@/lib/validations/forms";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";
import { isRateLimited, clientIpFrom } from "@/lib/rate-limit";

const REQUEST_TYPE_LABEL: Record<string, string> = {
  diagnostic: "Diagnostic",
  investigation: "Investigation",
  "controle-ponctuel": "Contrôle ponctuel",
  "installation-systeme": "Installation d'un système",
  supervision: "Supervision",
  "controle-terrain": "Contrôle terrain",
  autre: "Autre",
};

export async function POST(request: Request) {
  if (isRateLimited(`mission-request:${clientIpFrom(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const parsed = missionRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide.", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const docRef = await adminDb.collection("prospect_requests").add({
    companyName: data.companyName,
    sector: data.sector,
    responsibleName: data.responsibleName,
    phone: data.phone,
    email: data.email,
    location: data.location,
    employeeCount: data.employeeCount ?? null,
    requestType: data.requestType,
    problemDescription: data.problemDescription,
    urgency: data.urgency,
    solutionSlug: data.solutionSlug ?? null,
    status: "nouveau",
    createdAt: new Date().toISOString(),
  });

  await sendTransactionalEmail({
    to: [{ email: data.email, name: data.responsibleName }],
    subject: "Votre demande de mission a bien été reçue — CDF",
    htmlContent: baseEmailTemplate({
      title: "Demande de mission reçue",
      bodyHtml: `
        <p>Bonjour ${data.responsibleName},</p>
        <p>Nous avons bien reçu votre demande de mission « ${REQUEST_TYPE_LABEL[data.requestType]} » pour ${data.companyName}.</p>
        <p>Un consultant CDF revient vers vous très prochainement pour préciser le périmètre et les prochaines étapes.</p>
      `,
    }),
  });

  await sendTransactionalEmail({
    to: [{ email: process.env.BREVO_SENDER_EMAIL ?? "" }],
    subject: `Nouvelle demande de mission — ${data.companyName}`,
    htmlContent: baseEmailTemplate({
      title: "Nouvelle demande de mission",
      bodyHtml: `
        <p>Type : ${REQUEST_TYPE_LABEL[data.requestType]}</p>
        <p>Entreprise : ${data.companyName} (${data.sector})</p>
        <p>Responsable : ${data.responsibleName} — ${data.phone} — ${data.email}</p>
        <p>Localisation : ${data.location}</p>
        <p>Urgence : ${data.urgency}</p>
        <p>Description : ${data.problemDescription}</p>
      `,
    }),
  }).catch(() => undefined);

  return NextResponse.json({ id: docRef.id });
}
