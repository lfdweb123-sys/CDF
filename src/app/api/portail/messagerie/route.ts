import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { isClientRole } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({ text: z.string().min(1).max(4000) });

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !isClientRole(session.role) || !session.companyId) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Message invalide." }, { status: 400 });

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const authorName = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const message = {
    companyId: session.companyId,
    text: parsed.data.text,
    authorId: session.uid,
    authorName,
    authorRole: session.role,
    createdAt: new Date().toISOString(),
  };

  const docRef = await adminDb.collection("messages").add(message);

  await logAudit({
    actorId: session.uid,
    actorName: authorName,
    actorRole: session.role,
    action: "envoi-message",
    entity: "message",
    entityId: docRef.id,
    companyId: session.companyId,
  });

  return NextResponse.json({ ok: true, message: { id: docRef.id, ...message } });
}
