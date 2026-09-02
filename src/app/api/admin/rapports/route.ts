import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canManageMissions } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";
import { MAX_INLINE_FILE_BYTES, base64ByteSize, buildDataUri, humanFileSize } from "@/lib/file-upload";

const schema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(2).max(300),
  type: z.enum(["diagnostic", "mensuel", "controle", "investigation", "terrain", "suivi"]),
  mimeType: z.string().min(1).max(200),
  data: z.string().min(1),
  confidential: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !canManageMissions(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Rapport invalide." }, { status: 400 });

  if (base64ByteSize(parsed.data.data) > MAX_INLINE_FILE_BYTES) {
    return NextResponse.json({ error: `Fichier trop volumineux (${humanFileSize(MAX_INLINE_FILE_BYTES)} maximum).` }, { status: 413 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const publishedBy = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const docRef = await adminDb.collection("reports").add({
    companyId: parsed.data.companyId,
    type: parsed.data.type,
    title: parsed.data.title,
    fileUrl: buildDataUri(parsed.data.data, parsed.data.mimeType),
    confidential: parsed.data.confidential,
    publishedAt: new Date().toISOString(),
    publishedBy,
  });

  await adminDb.collection("notifications").add({
    companyId: parsed.data.companyId,
    title: "Nouveau rapport disponible",
    message: `Le rapport « ${parsed.data.title} » vient d'être publié.`,
    read: false,
    link: "/portail/rapports",
    createdAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: publishedBy,
    actorRole: session.role,
    action: "publication-rapport",
    entity: "report",
    entityId: docRef.id,
    companyId: parsed.data.companyId,
  });

  return NextResponse.json({ id: docRef.id });
}
