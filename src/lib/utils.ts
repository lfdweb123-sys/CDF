import type { RiskLevel } from "@/types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(
      new Date(iso)
    );
  } catch {
    return iso;
  }
}

export function formatAmount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  faible: "Faible",
  modere: "Modéré",
  eleve: "Élevé",
  critique: "Critique",
};

export function scoreBand(score: number): { label: string; level: RiskLevel } {
  if (score <= 20) return { label: "Faible", level: "faible" };
  if (score <= 40) return { label: "Modéré", level: "modere" };
  if (score <= 60) return { label: "À surveiller", level: "modere" };
  if (score <= 80) return { label: "Élevé", level: "eleve" };
  return { label: "Critique", level: "critique" };
}

export function riskLevelFromScore(score: number): RiskLevel {
  return scoreBand(score).level;
}

export function generateMissionReference(sequence: number, year = new Date().getFullYear()): string {
  return `CDF-${year}-${String(sequence).padStart(4, "0")}`;
}
