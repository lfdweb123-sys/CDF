// Core domain types shared across the CDF platform.
// Firestore is schemaless — these types are the contract the app code relies on.

export type Role =
  | "SUPER_ADMIN_CDF"
  | "ADMIN_CDF"
  | "CONSULTANT_CDF"
  | "CONTROLEUR_TERRAIN"
  | "CLIENT_ADMIN"
  | "CLIENT_MANAGER"
  | "CLIENT_VIEWER";

export const CDF_ROLES: Role[] = [
  "SUPER_ADMIN_CDF",
  "ADMIN_CDF",
  "CONSULTANT_CDF",
  "CONTROLEUR_TERRAIN",
];

export const CLIENT_ROLES: Role[] = ["CLIENT_ADMIN", "CLIENT_MANAGER", "CLIENT_VIEWER"];

export type RiskLevel = "faible" | "modere" | "eleve" | "critique";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  companyId: string | null; // null for CDF staff
  active: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  logoUrl?: string;
  responsableName?: string;
  responsableEmail?: string;
  responsablePhone?: string;
  location?: string;
  employeeCount?: number;
  status: "actif" | "suspendu" | "prospect";
  subscriptionPlan: "diagnostic" | "secure" | "anti-leak" | "watch" | null;
  riskScore: number | null;
  riskScoreHistory: { date: string; score: number }[];
  createdAt: string;
}

export type MissionType =
  | "diagnostic"
  | "investigation"
  | "controle-ponctuel"
  | "installation-systeme"
  | "supervision"
  | "controle-terrain"
  | "autre";

export type MissionStatus =
  | "prospect"
  | "planifiee"
  | "en-cours"
  | "en-analyse"
  | "rapport-preparation"
  | "rapport-livre"
  | "suivi"
  | "cloturee";

export interface Mission {
  id: string;
  reference: string; // CDF-2026-0001
  companyId: string;
  type: MissionType;
  consultantId?: string;
  consultantName?: string;
  startDate?: string;
  endDate?: string;
  status: MissionStatus;
  objectives?: string;
  deliverables?: string;
  createdAt: string;
  updatedAt: string;
}

export type AnomalyStatus =
  | "nouveau"
  | "en-analyse"
  | "action-requise"
  | "en-correction"
  | "resolu"
  | "cloture";

export interface Anomaly {
  id: string;
  number: string;
  companyId: string;
  missionId?: string;
  date: string;
  domain: string;
  riskLevel: RiskLevel;
  description: string;
  observation: string;
  amountConcerned?: number;
  status: AnomalyStatus;
  evidenceUrls: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RecommendationStatus = "a-faire" | "en-cours" | "en-retard" | "terminee";

export interface Recommendation {
  id: string;
  companyId: string;
  anomalyId?: string;
  problem: string;
  action: string;
  responsible: string;
  priority: "basse" | "normale" | "haute";
  dueDate: string;
  status: RecommendationStatus;
  progress: number; // 0-100
  comments: { authorName: string; text: string; createdAt: string }[];
  createdAt: string;
}

export type ReportType =
  | "diagnostic"
  | "mensuel"
  | "controle"
  | "investigation"
  | "terrain"
  | "suivi";

export interface Report {
  id: string;
  companyId: string;
  type: ReportType;
  title: string;
  period?: string;
  fileUrl: string;
  confidential: boolean;
  publishedAt: string;
  publishedBy: string;
}

export type DocumentCategory =
  | "rapports"
  | "contrats"
  | "procedures"
  | "justificatifs"
  | "photos"
  | "factures"
  | "controle";

export interface CdfDocument {
  id: string;
  companyId: string;
  category: DocumentCategory;
  name: string;
  fileUrl: string;
  version: number;
  author: string;
  uploadedAt: string;
}

export interface Control {
  id: string;
  companyId: string;
  missionId?: string;
  date: string;
  controllerName: string;
  domain: string;
  result: "conforme" | "non-conforme" | "partiel";
  score?: number;
  anomaliesDetected: number;
  recommendations: number;
  status: "programme" | "realise";
  createdAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  companyId?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type ProspectRequestType =
  | "diagnostic"
  | "investigation"
  | "controle-ponctuel"
  | "installation-systeme"
  | "supervision"
  | "controle-terrain"
  | "autre";

export interface ProspectRequest {
  id: string;
  companyName: string;
  sector: string;
  responsibleName: string;
  phone: string;
  email: string;
  location: string;
  employeeCount?: number;
  problemDescription: string;
  requestType: ProspectRequestType;
  urgency: "faible" | "normale" | "urgente";
  status: "nouveau" | "contacte" | "qualifie" | "converti" | "rejete";
  createdAt: string;
}

export interface DiagnosticSubmission {
  id: string;
  companyName?: string;
  sector: string;
  employeeCount: number;
  revenueRange: string;
  outletsCount: number;
  hasStockManagement: boolean;
  hasCashManagement: boolean;
  hasMobileMoney: boolean;
  hasProcurement: boolean;
  hasVehicles: boolean;
  hasProjects: boolean;
  existingControls: string;
  mainDifficulties: string;
  contactEmail?: string;
  contactPhone?: string;
  score: number;
  scoreLevel: RiskLevel;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO date
  type: "controle" | "mission" | "echeance";
  title: string;
  subtitle: string;
  status: string;
  href?: string;
}

export interface Message {
  id: string;
  companyId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entity: string;
  entityId: string;
  companyId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
