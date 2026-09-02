import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canWriteClientData } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";
import { MAX_INLINE_FILE_BYTES, base64ByteSize, buildDataUri, humanFileSize } from "@/lib/file-upload";

const schema = z.object({
  name: z.string().min(1).max(300),
  mimeType: z.string().min(1).max(200),
  data: z.string().min(1),
  category: z.enum(["rapports", "contrats", "procedures", "justificatifs", "photos", "factures", "controle"]),
});

// Files are never uploaded to Firebase Storage (not used anywhere in this
// app — see src/lib/firebase/client.ts) — the browser reads the file as
// base64 (src/lib/file-upload.ts) and posts it here, where it's stored
// inline as a Firestore field, server-side, so every upload is attributed
// and audit-logged.
export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !session.companyId) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  if (!canWriteClientData(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Document invalide." }, { status: 400 });

  if (base64ByteSize(parsed.data.data) > MAX_INLINE_FILE_BYTES) {
    return NextResponse.json({ error: `Fichier trop volumineux (${humanFileSize(MAX_INLINE_FILE_BYTES)} maximum).` }, { status: 413 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const author = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const docRef = await adminDb.collection("documents").add({
    companyId: session.companyId,
    category: parsed.data.category,
    name: parsed.data.name,
    fileUrl: buildDataUri(parsed.data.data, parsed.data.mimeType),
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
