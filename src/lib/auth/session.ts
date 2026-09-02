import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { AppUser, Role } from "@/types";

export const SESSION_COOKIE_NAME = "cdf_session";
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export interface SessionUser {
  uid: string;
  email: string;
  role: Role;
  companyId: string | null;
}

/**
 * Verifies the httpOnly session cookie server-side (Firebase Admin), revocation-aware.
 * Returns null when there is no valid session — callers redirect as appropriate.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = decoded.role as Role | undefined;
    const companyId = (decoded.companyId as string | null | undefined) ?? null;
    if (!role) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role, companyId };
  } catch {
    return null;
  }
}

export async function getFullSessionUser(): Promise<AppUser | null> {
  const session = await getSessionUser();
  if (!session) return null;
  const snap = await adminDb.collection("users").doc(session.uid).get();
  if (!snap.exists) return null;
  return { uid: snap.id, ...(snap.data() as Omit<AppUser, "uid">) };
}
