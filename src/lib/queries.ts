import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type {
  Anomaly,
  Company,
  Control,
  Recommendation,
  Report,
  CdfDocument,
  Mission,
  Notification,
  ProspectRequest,
} from "@/types";

async function listByCompany<T>(collection: string, companyId: string): Promise<T[]> {
  const snap = await adminDb.collection(collection).where("companyId", "==", companyId).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function getCompany(companyId: string): Promise<Company | null> {
  const snap = await adminDb.collection("companies").doc(companyId).get();
  return snap.exists ? ({ id: snap.id, ...snap.data() } as Company) : null;
}

export async function listCompanies(): Promise<Company[]> {
  const snap = await adminDb.collection("companies").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Company);
}

export const listAnomalies = (companyId: string) => listByCompany<Anomaly>("anomalies", companyId);
export const listRecommendations = (companyId: string) => listByCompany<Recommendation>("recommendations", companyId);
export const listReports = (companyId: string) => listByCompany<Report>("reports", companyId);
export const listControls = (companyId: string) => listByCompany<Control>("controls", companyId);
export const listDocuments = (companyId: string) => listByCompany<CdfDocument>("documents", companyId);
export const listMissions = (companyId: string) => listByCompany<Mission>("missions", companyId);

export async function listAllMissions(): Promise<Mission[]> {
  const snap = await adminDb.collection("missions").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Mission);
}

export async function listNotifications(userId: string, companyId?: string | null): Promise<Notification[]> {
  const snap = await adminDb.collection("notifications").where("userId", "==", userId).get();
  const userNotifs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  if (!companyId) return userNotifs;
  const companySnap = await adminDb.collection("notifications").where("companyId", "==", companyId).get();
  const companyNotifs = companySnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  const merged = [...userNotifs, ...companyNotifs];
  return merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listProspects(): Promise<ProspectRequest[]> {
  const snap = await adminDb.collection("prospect_requests").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ProspectRequest);
}

export interface DashboardStats {
  anomaliesOpen: number;
  anomaliesCritical: number;
  anomaliesResolved: number;
  controlsDone: number;
  controlsScheduled: number;
  recommendationsInProgress: number;
  recommendationsDone: number;
  actionPlanProgress: number; // 0-100
  domainRisk: { domain: string; level: Anomaly["riskLevel"] }[];
}

const RISK_RANK: Record<Anomaly["riskLevel"], number> = { faible: 0, modere: 1, eleve: 2, critique: 3 };
const RISK_FROM_RANK: Anomaly["riskLevel"][] = ["faible", "modere", "eleve", "critique"];

export function computeDashboardStats(anomalies: Anomaly[], controls: Control[], recommendations: Recommendation[]): DashboardStats {
  const anomaliesOpen = anomalies.filter((a) => a.status !== "resolu" && a.status !== "cloture").length;
  const anomaliesCritical = anomalies.filter((a) => a.riskLevel === "critique" && a.status !== "cloture").length;
  const anomaliesResolved = anomalies.filter((a) => a.status === "resolu" || a.status === "cloture").length;

  const controlsDone = controls.filter((c) => c.status === "realise").length;
  const controlsScheduled = controls.filter((c) => c.status === "programme").length;

  const recommendationsInProgress = recommendations.filter((r) => r.status !== "terminee").length;
  const recommendationsDone = recommendations.filter((r) => r.status === "terminee").length;
  const actionPlanProgress = recommendations.length
    ? Math.round(recommendations.reduce((sum, r) => sum + r.progress, 0) / recommendations.length)
    : 0;

  const domainMap = new Map<string, number>();
  for (const a of anomalies) {
    if (a.status === "cloture") continue;
    const current = domainMap.get(a.domain) ?? 0;
    domainMap.set(a.domain, Math.max(current, RISK_RANK[a.riskLevel]));
  }
  const domainRisk = Array.from(domainMap.entries()).map(([domain, rank]) => ({
    domain,
    level: RISK_FROM_RANK[rank],
  }));

  return {
    anomaliesOpen,
    anomaliesCritical,
    anomaliesResolved,
    controlsDone,
    controlsScheduled,
    recommendationsInProgress,
    recommendationsDone,
    actionPlanProgress,
    domainRisk,
  };
}
