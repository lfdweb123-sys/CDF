import { Badge } from "@/components/ui/badge";
import type { AnomalyStatus, RecommendationStatus, MissionStatus, ProspectRequest } from "@/types";

const ANOMALY_STATUS: Record<AnomalyStatus, { label: string; tone: "neutral" | "navy" | "accent" }> = {
  nouveau: { label: "Nouveau", tone: "accent" },
  "en-analyse": { label: "En analyse", tone: "navy" },
  "action-requise": { label: "Action requise", tone: "accent" },
  "en-correction": { label: "En correction", tone: "navy" },
  resolu: { label: "Résolu", tone: "neutral" },
  cloture: { label: "Clôturé", tone: "neutral" },
};

export function AnomalyStatusBadge({ status }: { status: AnomalyStatus }) {
  const cfg = ANOMALY_STATUS[status];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const RECO_STATUS: Record<RecommendationStatus, { label: string; tone: "neutral" | "navy" | "accent" }> = {
  "a-faire": { label: "À faire", tone: "neutral" },
  "en-cours": { label: "En cours", tone: "navy" },
  "en-retard": { label: "En retard", tone: "accent" },
  terminee: { label: "Terminée", tone: "neutral" },
};

export function RecommendationStatusBadge({ status }: { status: RecommendationStatus }) {
  const cfg = RECO_STATUS[status];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

const MISSION_STATUS: Record<MissionStatus, string> = {
  prospect: "Prospect",
  planifiee: "Planifiée",
  "en-cours": "En cours",
  "en-analyse": "En analyse",
  "rapport-preparation": "Rapport en préparation",
  "rapport-livre": "Rapport livré",
  suivi: "Suivi",
  cloturee: "Clôturée",
};

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return <Badge tone="navy">{MISSION_STATUS[status]}</Badge>;
}

const PROSPECT_STATUS: Record<ProspectRequest["status"], string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  qualifie: "Qualifié",
  converti: "Converti",
  rejete: "Rejeté",
};

export function ProspectStatusBadge({ status }: { status: ProspectRequest["status"] }) {
  return <Badge tone={status === "converti" ? "navy" : "neutral"}>{PROSPECT_STATUS[status]}</Badge>;
}
