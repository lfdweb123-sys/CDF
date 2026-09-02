import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canWriteClientData } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  name: z.string().min(1).max(300),
  fileUrl: z.string().url(),
  category: z.enum(["rapports", "contrats", "procedures", "justificatifs", "photos", "factures", "controle"]),
});

// The file itself is uploaded client-side directly to Firebase Storage (under
// companies/{companyId}/documents/**, enforced by storage.rules); this route
// only registers the resulting metadata as a Firestore document, server-side,
// so every upload is attributed and audit-logged.
export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !session.companyId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!canWriteClientData(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Document invalide." }, { status: 400 });

  if (!parsed.data.fileUrl.includes(encodeURIComponent(`companies/${session.companyId}/documents`))) {
    return NextResponse.json({ error: "Chemin de fichier invalide pour ce compte." }, { status: 403 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const author = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const docRef = await adminDb.collection("documents").add({
    companyId: session.companyId,
    category: parsed.data.category,
    name: parsed.data.name,
    fileUrl: parsed.data.fileUrl,
    version: 1,
    author,
    uploadedAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: author,
    actorRole: session.role,
    action: "televersement-document",
    entity: "document",
    entityId: docRef.id,
    companyId: session.companyId,
  });

  return NextResponse.json({ id: docRef.id });
}
