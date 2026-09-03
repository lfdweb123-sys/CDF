import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardCheck, ListChecks, TrendingDown, TrendingUp, Minus, ArrowRight, FileText } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getCompany, listAnomalies, listControls, listRecommendations, listReports, computeDashboardStats } from "@/lib/queries";
import { StatCard, Card, SectionHeading } from "@/components/ui/card";
import { RiskBadge, RiskDot } from "@/components/ui/badge";
import { RiskScoreChart } from "@/components/dashboard/risk-score-chart";
import { scoreBand, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function ClientDashboardPage() {
  const session = await getSessionUser();
  const companyId = session!.companyId!;

  const [company, anomalies, controls, recommendations, reports] = await Promise.all([
    getCompany(companyId),
    listAnomalies(companyId),
    listControls(companyId),
    listRecommendations(companyId),
    listReports(companyId),
  ]);

  const stats = computeDashboardStats(anomalies, controls, recommendations);
  const score = company?.riskScore ?? null;
  const band = score !== null ? scoreBand(score) : null;
  const history = company?.riskScoreHistory ?? [];
  const previousScore = history.length >= 2 ? history[history.length - 2].score : null;
  const delta = score !== null && previousScore !== null ? previousScore - score : null;

  const latestReport = [...reports].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))[0];
  const nextControl = controls
    .filter((c) => c.status === "programme")
    .sort((a, b) => (a.date > b.date ? 1 : -1))[0];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{company?.name ?? "Votre entreprise"}</p>
        <h1 className="mt-1 text-2xl font-semibold text-navy-950">Tableau de bord</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">CDF Risk Score™</p>
          {score !== null && band ? (
            <>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-semibold text-navy-950">{score}</span>
                <span className="mb-1.5 text-base text-slate-400">/ 100</span>
              </div>
              <RiskBadge level={band.level} className="mt-3" />
              {delta !== null && delta !== 0 && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  {delta > 0 ? (
                    <TrendingDown className="h-3.5 w-3.5 text-risk-low" strokeWidth={2} />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5 text-risk-critical" strokeWidth={2} />
                  )}
                  {delta > 0 ? `${delta} points de moins` : `${Math.abs(delta)} points de plus`} que la mission précédente
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Votre CDF Risk Score™ sera disponible après votre première mission de diagnostic.
            </p>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Évolution du score</p>
          <div className="mt-3">
            <RiskScoreChart history={history} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Anomalies ouvertes" value={stats.anomaliesOpen} icon={AlertTriangle} tone={stats.anomaliesOpen > 0 ? "warning" : "positive"} />
        <StatCard label="Anomalies critiques" value={stats.anomaliesCritical} icon={AlertTriangle} tone={stats.anomaliesCritical > 0 ? "critical" : "positive"} />
        <StatCard label="Contrôles réalisés" value={stats.controlsDone} icon={ClipboardCheck} hint={`${stats.controlsScheduled} programmé(s)`} />
        <StatCard label="Plan d'action" value={`${stats.actionPlanProgress} %`} icon={ListChecks} hint="terminé" tone={stats.actionPlanProgress >= 70 ? "positive" : "neutral"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <SectionHeading title="Principaux risques" />
          <div className="mt-4 space-y-2.5">
            {stats.domainRisk.length === 0 && <p className="text-sm text-slate-500">Aucune anomalie ouverte actuellement.</p>}
            {stats.domainRisk.map((d) => (
              <div key={d.domain} className="flex items-center justify-between rounded-md border border-slate-200 px-3.5 py-2.5 text-sm">
                <span className="text-navy-900">{d.domain}</span>
                <RiskDot level={d.level} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-1">
          <SectionHeading title="Dernier rapport" />
          {latestReport ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-navy-950">{latestReport.title}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(latestReport.publishedAt)}</p>
              <Link href="/portail/rapports" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:gap-2 transition-all">
                <FileText className="h-4 w-4" strokeWidth={1.75} />
                Consulter <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Aucun rapport publié pour le moment.</p>
          )}
        </Card>

        <Card className="p-6 lg:col-span-1">
          <SectionHeading title="Prochain contrôle" />
          {nextControl ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-navy-950">{nextControl.domain}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(nextControl.date)}</p>
              <Link href="/portail/controles" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:gap-2 transition-all">
                Voir le calendrier <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
              <Minus className="h-4 w-4" strokeWidth={1.75} />
              Aucun contrôle programmé actuellement.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
