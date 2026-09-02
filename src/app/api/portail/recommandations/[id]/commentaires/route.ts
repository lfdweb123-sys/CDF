import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canWriteClientData } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({ text: z.string().min(1).max(2000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!canWriteClientData(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Commentaire invalide." }, { status: 400 });

  const docRef = adminDb.collection("recommendations").doc(id);
  const snap = await docRef.get();
  if (!snap.exists || snap.data()?.companyId !== session.companyId) {
    return NextResponse.json({ error: "Recommandation introuvable." }, { status: 404 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const authorName = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const comment = { authorName, text: parsed.data.text, createdAt: new Date().toISOString() };
  await docRef.update({
    comments: [...(snap.data()?.comments ?? []), comment],
  });

  await logAudit({
    actorId: session.uid,
    actorName: authorName,
    actorRole: session.role,
    action: "ajout-commentaire",
    entity: "recommendation",
    entityId: id,
    companyId: session.companyId ?? undefined,
  });

  return NextResponse.json({ ok: true, comment });
}
