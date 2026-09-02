import { NextResponse } from "next/server";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase/admin";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";

const schema = z.object({ email: z.string().email() });

// Always returns 200 (even for an unknown email) to avoid leaking which
// addresses are registered — standard practice for password-reset endpoints.
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  try {
    const link = await adminAuth.generatePasswordResetLink(parsed.data.email, {
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/connexion`,
    });

    await sendTransactionalEmail({
      to: [{ email: parsed.data.email }],
      subject: "Réinitialisation de votre mot de passe CDF",
      htmlContent: baseEmailTemplate({
        title: "Réinitialisation de votre mot de passe",
        bodyHtml: `
          <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre espace CDF.</p>
          <p><a href="${link}" style="color:#1d3f66;font-weight:600;">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email — votre mot de passe restera inchangé.</p>
        `,
      }),
    });
  } catch (error) {
    // auth/user-not-found is expected traffic on this endpoint; log anything else.
    if (!(error as { code?: string })?.code?.includes("user-not-found")) {
      console.error("[auth/forgot-password] failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}
