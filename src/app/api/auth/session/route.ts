import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { logAudit } from "@/lib/audit";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/session";
import type { Role } from "@/types";

/**
 * Exchanges a freshly-obtained Firebase ID token (client SDK sign-in) for an
 * httpOnly session cookie. The ID token itself never touches a cookie —
 * only this short-lived server exchange sees it.
 */
export async function POST(request: Request) {
  const { idToken } = await request.json().catch(() => ({ idToken: null }));
  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "idToken manquant" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.role) {
      return NextResponse.json(
        { error: "Ce compte n'a pas encore de rôle assigné. Contactez votre administrateur CDF." },
        { status: 403 }
      );
    }

    const userRecord = await adminAuth.getUser(decoded.uid);
    if (userRecord.disabled) {
      return NextResponse.json({ error: "Ce compte a été désactivé." }, { status: 403 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({
      role: decoded.role as Role,
      companyId: (decoded.companyId as string | null) ?? null,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    await logAudit({
      actorId: decoded.uid,
      actorName: decoded.name ?? decoded.email ?? decoded.uid,
      actorRole: decoded.role as Role,
      action: "connexion",
      entity: "session",
      entityId: decoded.uid,
      companyId: (decoded.companyId as string | null) ?? undefined,
    });

    return response;
  } catch (error) {
    console.error("[auth/session] failed", error);
    return NextResponse.json({ error: "Session invalide ou expirée." }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return response;
}
