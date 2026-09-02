import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canManageMissions } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(1).max(300),
  fileUrl: z.string().url(),
  category: z.enum(["rapports", "contrats", "procedures", "justificatifs", "photos", "factures", "controle"]),
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !canManageMissions(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Document invalide." }, { status: 400 });

  if (!parsed.data.fileUrl.includes(encodeURIComponent(`companies/${parsed.data.companyId}/documents`))) {
    return NextResponse.json({ error: "Chemin de fichier invalide." }, { status: 403 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const author = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const docRef = await adminDb.collection("documents").add({
    companyId: parsed.data.companyId,
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
    companyId: parsed.data.companyId,
  });

  return NextResponse.json({ id: docRef.id });
}
