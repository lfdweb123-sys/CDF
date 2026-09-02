import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { canManageMissions } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(2).max(300),
  type: z.enum(["diagnostic", "mensuel", "controle", "investigation", "terrain", "suivi"]),
  fileUrl: z.string().url(),
  confidential: z.boolean().default(false),
});

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session || !canManageMissions(session.role)) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Rapport invalide." }, { status: 400 });

  if (!parsed.data.fileUrl.includes(encodeURIComponent(`companies/${parsed.data.companyId}/reports`))) {
    return NextResponse.json({ error: "Chemin de fichier invalide." }, { status: 403 });
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const publishedBy = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  const docRef = await adminDb.collection("reports").add({
    companyId: parsed.data.companyId,
    type: parsed.data.type,
    title: parsed.data.title,
    fileUrl: parsed.data.fileUrl,
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
