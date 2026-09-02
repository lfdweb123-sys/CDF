import { scoreBand } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export interface DiagnosticAnswers {
  sector: string;
  employeeCount: number;
  revenueRange: "moins-10m" | "10-50m" | "50-200m" | "plus-200m";
  outletsCount: number;
  hasStockManagement: boolean;
  hasCashManagement: boolean;
  hasMobileMoney: boolean;
  hasProcurement: boolean;
  hasVehicles: boolean;
  hasProjects: boolean;
  existingControls: "aucun" | "partiel" | "structure";
  mainDifficulties: string;
}

const EMPLOYEE_POINTS = (n: number) => (n <= 9 ? 4 : n <= 49 ? 9 : n <= 199 ? 14 : 18);
const OUTLET_POINTS = (n: number) => (n <= 1 ? 0 : n <= 5 ? 8 : 14);
const REVENUE_POINTS: Record<DiagnosticAnswers["revenueRange"], number> = {
  "moins-10m": 2,
  "10-50m": 5,
  "50-200m": 9,
  "plus-200m": 13,
};
const CONTROL_POINTS: Record<DiagnosticAnswers["existingControls"], number> = {
  aucun: 18,
  partiel: 9,
  structure: 0,
};
const DOMAIN_POINT = 6;

/**
 * Deterministic, server-computed score — the client never sets the score
 * itself, it only submits raw answers (see /api/diagnostic).
 * Result is explicitly presented as an indicative first assessment, not an
 * official audit (see the disclaimer shown alongside it in the UI).
 */
export function computeDiagnosticScore(answers: DiagnosticAnswers): { score: number; level: RiskLevel; label: string } {
  let score = 16; // base exposure common to any operating business

  score += EMPLOYEE_POINTS(answers.employeeCount);
  score += OUTLET_POINTS(answers.outletsCount);
  score += REVENUE_POINTS[answers.revenueRange];
  score += CONTROL_POINTS[answers.existingControls];

  const domainFlags = [
    answers.hasStockManagement,
    answers.hasCashManagement,
    answers.hasMobileMoney,
    answers.hasProcurement,
    answers.hasVehicles,
    answers.hasProjects,
  ];
  score += domainFlags.filter(Boolean).length * DOMAIN_POINT;

  score = Math.max(3, Math.min(97, Math.round(score)));
  const band = scoreBand(score);
  return { score, level: band.level, label: band.label };
}
