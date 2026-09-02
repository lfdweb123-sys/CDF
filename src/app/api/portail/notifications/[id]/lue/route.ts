import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { id } = await params;
  const docRef = adminDb.collection("notifications").doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return NextResponse.json({ error: "Introuvable." }, { status: 404 });

  const data = snap.data();
  const belongsToUser = data?.userId === session.uid;
  const belongsToCompany = session.companyId && data?.companyId === session.companyId;
  if (!belongsToUser && !belongsToCompany) {
    return NextResponse.json({ error: "Permissions insuffisantes." }, { status: 403 });
  }

  await docRef.update({ read: true });
  return NextResponse.json({ ok: true });
}
