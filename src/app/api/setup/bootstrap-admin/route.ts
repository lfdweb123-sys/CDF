import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";
import { siteConfig } from "@/lib/data/site";
import { logAudit } from "@/lib/audit";
import { isRateLimited, clientIpFrom } from "@/lib/rate-limit";

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(2).max(150),
});

/**
 * One-time, fully web-based bootstrap for the very first SUPER_ADMIN_CDF
 * account — no local script or CLI access required. Guarded two ways:
 *  1. A secret ADMIN_SETUP_TOKEN, known only to the site owner (set as a
 *     Vercel env var, never committed).
 *  2. Even with a valid token, this refuses to run a second time once any
 *     SUPER_ADMIN_CDF account already exists — so it is safe to leave this
 *     route deployed rather than needing to remove it after first use
 *     (removing ADMIN_SETUP_TOKEN afterwards is still recommended).
 */
export async function POST(request: Request) {
  if (isRateLimited(`bootstrap-admin:${clientIpFrom(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });
  }

  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  if (!setupToken) {
    return NextResponse.json(
      { error: "L'amorçage n'est pas configuré sur ce déploiement (ADMIN_SETUP_TOKEN manquant)." },
      { status: 503 }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  if (parsed.data.token !== setupToken) {
    return NextResponse.json({ error: "Jeton d'amorçage incorrect." }, { status: 403 });
  }

  const existingAdmins = await adminDb.collection("users").where("role", "==", "SUPER_ADMIN_CDF").limit(1).get();
  if (!existingAdmins.empty) {
    return NextResponse.json(
      { error: "Un administrateur existe déjà. Utilisez le back-office pour créer d'autres comptes." },
      { status: 409 }
    );
  }

  const { email, displayName } = parsed.data;

  const userRecord = await adminAuth.createUser({ email, displayName, emailVerified: false });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role: "SUPER_ADMIN_CDF", companyId: null });

  await adminDb.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    displayName,
    role: "SUPER_ADMIN_CDF",
    companyId: null,
    active: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  });

  const resetLink = await adminAuth.generatePasswordResetLink(email, {
    url: `${siteConfig.url}/connexion`,
  });

  await sendTransactionalEmail({
    to: [{ email, name: displayName }],
    subject: "Votre accès administrateur CDF",
    htmlContent: baseEmailTemplate({
      title: "Compte administrateur CDF créé",
      bodyHtml: `
        <p>Bonjour ${displayName},</p>
        <p>Votre compte Super Administrateur CDF vient d'être créé.</p>
        <p><a href="${resetLink}" style="color:#1d3f66;font-weight:600;">Définir mon mot de passe</a></p>
        <p>Vous pourrez ensuite créer les autres comptes de l'équipe et de vos clients depuis le back-office.</p>
      `,
    }),
  });

  await logAudit({
    actorId: userRecord.uid,
    actorName: displayName,
    actorRole: "SUPER_ADMIN_CDF",
    action: "amorcage-premier-administrateur",
    entity: "user",
    entityId: userRecord.uid,
  });

  return NextResponse.json({ ok: true });
}
