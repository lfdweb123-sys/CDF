import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { diagnosticFormSchema } from "@/lib/validations/forms";
import { computeDiagnosticScore } from "@/lib/diagnostic-scoring";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";
import { isRateLimited, clientIpFrom } from "@/lib/rate-limit";
import { RISK_LEVEL_LABEL } from "@/lib/utils";

export async function POST(request: Request) {
  if (isRateLimited(`diagnostic:${clientIpFrom(request)}`, 8, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const parsed = diagnosticFormSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide.", issues: parsed.error.issues }, { status: 400 });
  }

  const answers = parsed.data;
  const result = computeDiagnosticScore(answers);

  const docRef = await adminDb.collection("diagnostic_submissions").add({
    ...answers,
    score: result.score,
    scoreLevel: result.level,
    createdAt: new Date().toISOString(),
  });

  if (answers.contactEmail) {
    await sendTransactionalEmail({
      to: [{ email: answers.contactEmail }],
      subject: "Votre CDF Risk Score™ indicatif",
      htmlContent: baseEmailTemplate({
        title: "Votre première évaluation de risque",
        bodyHtml: `
          <p>Merci d'avoir complété le diagnostic en ligne CDF.</p>
          <p style="font-size:28px;font-weight:700;color:#0b1526;margin:16px 0 4px;">${result.score} / 100</p>
          <p style="margin:0 0 16px;color:#71798a;">Niveau : ${RISK_LEVEL_LABEL[result.level]}</p>
          <p>Ce résultat est une première évaluation <strong>indicative</strong> et ne constitue pas un audit officiel. Un consultant CDF peut vous proposer un diagnostic professionnel approfondi.</p>
        `,
      }),
    });
  }

  await sendTransactionalEmail({
    to: [{ email: process.env.BREVO_SENDER_EMAIL ?? "" }],
    subject: `Nouveau diagnostic en ligne — score ${result.score}/100 (${RISK_LEVEL_LABEL[result.level]})`,
    htmlContent: baseEmailTemplate({
      title: "Nouveau diagnostic en ligne complété",
      bodyHtml: `
        <p>Secteur : ${answers.sector}</p>
        <p>Entreprise : ${answers.companyName || "Non renseignée"}</p>
        <p>Contact : ${answers.contactEmail || "—"} / ${answers.contactPhone || "—"}</p>
        <p>Score : ${result.score}/100 — ${RISK_LEVEL_LABEL[result.level]}</p>
      `,
    }),
  }).catch(() => undefined);

  return NextResponse.json({
    id: docRef.id,
    score: result.score,
    level: result.level,
    label: result.label,
  });
}
