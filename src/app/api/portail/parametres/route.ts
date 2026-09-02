import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({ twoFactorEnabled: z.boolean() });

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  await adminDb.collection("users").doc(session.uid).update({ twoFactorEnabled: parsed.data.twoFactorEnabled });

  await logAudit({
    actorId: session.uid,
    actorName: session.email,
    actorRole: session.role,
    action: parsed.data.twoFactorEnabled ? "activation-2fa" : "desactivation-2fa",
    entity: "user",
    entityId: session.uid,
    companyId: session.companyId ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
