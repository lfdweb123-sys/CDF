"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";
import { canManagePlatform, canManageMissions, isCdfStaff } from "@/lib/auth/roles";
import { logAudit } from "@/lib/audit";
import { sendTransactionalEmail, baseEmailTemplate } from "@/lib/email/brevo";
import { generateMissionReference } from "@/lib/utils";
import { siteConfig } from "@/lib/data/site";
import type { Role } from "@/types";

async function requireStaff(): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session || !isCdfStaff(session.role)) {
    redirect("/connexion?next=/admin");
  }
  return session;
}

async function actorName(uid: string, fallback: string): Promise<string> {
  const snap = await adminDb.collection("users").doc(uid).get();
  return (snap.data()?.displayName as string | undefined) ?? fallback;
}

// ---------------------------------------------------------------------------
// Companies (tenants)
// ---------------------------------------------------------------------------

export async function createCompany(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const name = String(formData.get("name") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim();
  if (!name || !sector) throw new Error("Nom et secteur requis.");

  const docRef = await adminDb.collection("companies").add({
    name,
    sector,
    responsableName: String(formData.get("responsableName") ?? "") || null,
    responsableEmail: String(formData.get("responsableEmail") ?? "") || null,
    responsablePhone: String(formData.get("responsablePhone") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    employeeCount: Number(formData.get("employeeCount") ?? 0) || null,
    status: "actif",
    subscriptionPlan: null,
    riskScore: null,
    riskScoreHistory: [],
    createdAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-client",
    entity: "company",
    entityId: docRef.id,
  });

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${docRef.id}`);
}

export async function updateCompanyStatus(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const companyId = String(formData.get("companyId"));
  const status = String(formData.get("status"));

  await adminDb.collection("companies").doc(companyId).update({ status });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-statut-client",
    entity: "company",
    entityId: companyId,
    metadata: { status },
  });

  revalidatePath(`/admin/clients/${companyId}`);
  revalidatePath("/admin/clients");
}

export async function updateCompanyRiskScore(formData: FormData): Promise<void> {
  const session = await requireStaff();
  const companyId = String(formData.get("companyId"));
  const score = Number(formData.get("score"));
  if (Number.isNaN(score) || score < 0 || score > 100) throw new Error("Score invalide.");

  const companyRef = adminDb.collection("companies").doc(companyId);
  const snap = await companyRef.get();
  const history = (snap.data()?.riskScoreHistory as { date: string; score: number }[]) ?? [];
  const updatedHistory = [...history, { date: new Date().toISOString().slice(0, 10), score }];

  await companyRef.update({ riskScore: score, riskScoreHistory: updatedHistory });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "mise-a-jour-risk-score",
    entity: "company",
    entityId: companyId,
    metadata: { score },
  });

  revalidatePath(`/admin/clients/${companyId}`);
}

// ---------------------------------------------------------------------------
// Users (client + staff)
// ---------------------------------------------------------------------------

export async function createClientUser(formData: FormData): Promise<void> {
  const session = await requireStaff();
  const companyId = String(formData.get("companyId"));
  const email = String(formData.get("email") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const role = String(formData.get("role") ?? "CLIENT_VIEWER") as Role;

  if (!email || !displayName) throw new Error("Nom et email requis.");

  const userRecord = await adminAuth.createUser({ email, displayName, emailVerified: false });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role, companyId });

  await adminDb.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    displayName,
    role,
    companyId,
    active: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  });

  const resetLink = await adminAuth.generatePasswordResetLink(email, {
    url: `${siteConfig.url}/connexion`,
  });

  await sendTransactionalEmail({
    to: [{ email, name: displayName }],
    subject: "Votre accès à l'espace client CDF",
    htmlContent: baseEmailTemplate({
      title: "Bienvenue sur votre espace client CDF",
      bodyHtml: `
        <p>Bonjour ${displayName},</p>
        <p>Un accès à l'espace client CDF vient de vous être créé.</p>
        <p><a href="${resetLink}" style="color:#1d3f66;font-weight:600;">Définir mon mot de passe</a></p>
      `,
    }),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-utilisateur-client",
    entity: "user",
    entityId: userRecord.uid,
    companyId,
    metadata: { role },
  });

  revalidatePath(`/admin/clients/${companyId}`);
}

export async function createStaffUser(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const email = String(formData.get("email") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const role = String(formData.get("role") ?? "CONSULTANT_CDF") as Role;
  if (!email || !displayName) throw new Error("Nom et email requis.");

  const userRecord = await adminAuth.createUser({ email, displayName, emailVerified: false });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role, companyId: null });

  await adminDb.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid,
    email,
    displayName,
    role,
    companyId: null,
    active: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  });

  const resetLink = await adminAuth.generatePasswordResetLink(email, {
    url: `${siteConfig.url}/connexion`,
  });

  await sendTransactionalEmail({
    to: [{ email, name: displayName }],
    subject: "Votre accès à la plateforme CDF",
    htmlContent: baseEmailTemplate({
      title: "Bienvenue dans l'équipe CDF",
      bodyHtml: `
        <p>Bonjour ${displayName},</p>
        <p>Un accès au back-office CDF vient de vous être créé (rôle : ${role}).</p>
        <p><a href="${resetLink}" style="color:#1d3f66;font-weight:600;">Définir mon mot de passe</a></p>
      `,
    }),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-utilisateur-cdf",
    entity: "user",
    entityId: userRecord.uid,
    metadata: { role },
  });

  revalidatePath("/admin/controleurs");
}

export async function setUserActive(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const uid = String(formData.get("uid"));
  const active = formData.get("active") === "true";

  await adminAuth.updateUser(uid, { disabled: !active });
  await adminDb.collection("users").doc(uid).update({ active });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: active ? "activation-utilisateur" : "desactivation-utilisateur",
    entity: "user",
    entityId: uid,
  });

  revalidatePath("/admin/controleurs");
  revalidatePath("/admin/clients");
}

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------

export async function createMission(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const companyId = String(formData.get("companyId"));
  const type = String(formData.get("type"));
  const objectives = String(formData.get("objectives") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  const counterRef = adminDb.collection("counters").doc("missions");
  const reference = await adminDb.runTransaction(async (tx) => {
    const counterSnap = await tx.get(counterRef);
    const year = new Date().getFullYear();
    const current = counterSnap.exists && counterSnap.data()?.year === year ? counterSnap.data()?.count ?? 0 : 0;
    const next = current + 1;
    tx.set(counterRef, { year, count: next }, { merge: true });
    return generateMissionReference(next, year);
  });

  const docRef = await adminDb.collection("missions").add({
    reference,
    companyId,
    type,
    consultantId: session.uid,
    consultantName: await actorName(session.uid, session.email),
    startDate: startDate || null,
    endDate: endDate || null,
    status: "planifiee",
    objectives,
    deliverables: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-mission",
    entity: "mission",
    entityId: docRef.id,
    companyId,
    metadata: { reference },
  });

  revalidatePath("/admin/missions");
  redirect(`/admin/missions/${docRef.id}`);
}

export async function updateMissionStatus(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const missionId = String(formData.get("missionId"));
  const status = String(formData.get("status"));

  await adminDb.collection("missions").doc(missionId).update({ status, updatedAt: new Date().toISOString() });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-statut-mission",
    entity: "mission",
    entityId: missionId,
    metadata: { status },
  });

  revalidatePath(`/admin/missions/${missionId}`);
  revalidatePath("/admin/missions");
}

// ---------------------------------------------------------------------------
// Anomalies
// ---------------------------------------------------------------------------

export async function createAnomaly(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const companyId = String(formData.get("companyId"));
  const domain = String(formData.get("domain") ?? "");
  const riskLevel = String(formData.get("riskLevel") ?? "modere");
  const description = String(formData.get("description") ?? "");
  const observation = String(formData.get("observation") ?? "");
  const amount = Number(formData.get("amountConcerned") ?? 0);
  const missionId = String(formData.get("missionId") ?? "") || undefined;

  const countSnap = await adminDb.collection("anomalies").where("companyId", "==", companyId).count().get();
  const number = `AN-${new Date().getFullYear()}-${String(countSnap.data().count + 1).padStart(4, "0")}`;

  const docRef = await adminDb.collection("anomalies").add({
    number,
    companyId,
    missionId: missionId ?? null,
    date: new Date().toISOString().slice(0, 10),
    domain,
    riskLevel,
    description,
    observation,
    amountConcerned: amount || null,
    status: "nouveau",
    evidenceUrls: [],
    createdBy: session.uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await adminDb.collection("notifications").add({
    companyId,
    title: "Nouvelle anomalie identifiée",
    message: `Une nouvelle anomalie (${number}) a été publiée dans le domaine ${domain}.`,
    read: false,
    link: "/portail/anomalies",
    createdAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-anomalie",
    entity: "anomaly",
    entityId: docRef.id,
    companyId,
  });

  revalidatePath("/admin/anomalies");
  redirect(`/admin/anomalies/${docRef.id}`);
}

export async function updateAnomalyStatus(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const anomalyId = String(formData.get("anomalyId"));
  const status = String(formData.get("status"));

  await adminDb.collection("anomalies").doc(anomalyId).update({ status, updatedAt: new Date().toISOString() });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-statut-anomalie",
    entity: "anomaly",
    entityId: anomalyId,
    metadata: { status },
  });

  revalidatePath(`/admin/anomalies/${anomalyId}`);
  revalidatePath("/admin/anomalies");
}

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

export async function createRecommendation(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const companyId = String(formData.get("companyId"));
  const anomalyId = String(formData.get("anomalyId") ?? "") || undefined;
  const problem = String(formData.get("problem") ?? "");
  const action = String(formData.get("action") ?? "");
  const responsible = String(formData.get("responsible") ?? "");
  const priority = String(formData.get("priority") ?? "normale");
  const dueDate = String(formData.get("dueDate") ?? "");

  const docRef = await adminDb.collection("recommendations").add({
    companyId,
    anomalyId: anomalyId ?? null,
    problem,
    action,
    responsible,
    priority,
    dueDate,
    status: "a-faire",
    progress: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-recommandation",
    entity: "recommendation",
    entityId: docRef.id,
    companyId,
  });

  revalidatePath("/admin/recommandations");
}

export async function updateRecommendationProgress(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const recommendationId = String(formData.get("recommendationId"));
  const progress = Math.max(0, Math.min(100, Number(formData.get("progress") ?? 0)));
  const status = progress >= 100 ? "terminee" : progress > 0 ? "en-cours" : "a-faire";

  await adminDb.collection("recommendations").doc(recommendationId).update({ progress, status });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-avancement-recommandation",
    entity: "recommendation",
    entityId: recommendationId,
    metadata: { progress, status },
  });

  revalidatePath("/admin/recommandations");
}

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

export async function createControl(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManageMissions(session.role)) throw new Error("Permissions insuffisantes.");

  const companyId = String(formData.get("companyId"));
  const domain = String(formData.get("domain") ?? "");
  const date = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "programme");
  const result = String(formData.get("result") ?? "conforme");
  const score = formData.get("score") ? Number(formData.get("score")) : undefined;

  const docRef = await adminDb.collection("controls").add({
    companyId,
    domain,
    date,
    controllerName: await actorName(session.uid, session.email),
    status,
    result,
    score: score ?? null,
    anomaliesDetected: Number(formData.get("anomaliesDetected") ?? 0),
    recommendations: Number(formData.get("recommendations") ?? 0),
    createdAt: new Date().toISOString(),
  });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "creation-controle",
    entity: "control",
    entityId: docRef.id,
    companyId,
  });

  revalidatePath("/admin/controles");
}

// ---------------------------------------------------------------------------
// Prospects
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Content / CMS
// ---------------------------------------------------------------------------

export async function updatePricingPlans(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const planIds = ["diagnostic", "secure", "anti-leak", "watch"];
  const plans: Record<string, { priceLabel: string; billingNote: string }> = {};
  for (const id of planIds) {
    plans[id] = {
      priceLabel: String(formData.get(`${id}_priceLabel`) ?? ""),
      billingNote: String(formData.get(`${id}_billingNote`) ?? ""),
    };
  }

  await adminDb.collection("content").doc("pricing").set({ plans }, { merge: true });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-tarifs",
    entity: "content",
    entityId: "pricing",
  });

  revalidatePath("/admin/abonnements");
}

export async function updateContactContent(formData: FormData): Promise<void> {
  const session = await requireStaff();
  if (!canManagePlatform(session.role)) throw new Error("Permissions insuffisantes.");

  const contact = {
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
  };

  await adminDb.collection("content").doc("contact").set(contact, { merge: true });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-coordonnees",
    entity: "content",
    entityId: "contact",
  });

  revalidatePath("/admin/contenu");
}

export async function updateProspectStatus(formData: FormData): Promise<void> {
  const session = await requireStaff();
  const prospectId = String(formData.get("prospectId"));
  const status = String(formData.get("status"));

  await adminDb.collection("prospect_requests").doc(prospectId).update({ status });

  await logAudit({
    actorId: session.uid,
    actorName: await actorName(session.uid, session.email),
    actorRole: session.role,
    action: "modification-statut-prospect",
    entity: "prospect_request",
    entityId: prospectId,
    metadata: { status },
  });

  revalidatePath("/admin/prospects");
}
