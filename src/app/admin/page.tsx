import type { Metadata } from "next";
import { Building2, Briefcase, AlertTriangle, ClipboardCheck, Users, Clock } from "lucide-react";
import { listCompanies, listAllMissions, listAllAnomalies, listAllControls, listProspects } from "@/lib/queries";
import { StatCard, Card, SectionHeading } from "@/components/ui/card";
import { MissionStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Tableau de bord CDF" };

export default async function AdminDashboardPage() {
  const [companies, missions, anomalies, controls, prospects] = await Promise.all([
    listCompanies(),
    listAllMissions(),
    listAllAnomalies(),
    listAllControls(),
    listProspects(),
  ]);

  const activeClients = companies.filter((c) => c.status === "actif").length;
  const activeMissions = missions.filter((m) => !["cloturee", "prospect"].includes(m.status)).length;
  const completedMissions = missions.filter((m) => m.status === "cloturee").length;
  const anomaliesOpen = anomalies.filter((a) => a.status !== "resolu" && a.status !== "cloture").length;
  const anomaliesCritical = anomalies.filter((a) => a.riskLevel === "critique" && a.status !== "cloture").length;
  const now = new Date();
  const controlsThisMonth = controls.filter((c) => {
    const d = new Date(c.date);
    return c.status === "realise" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const newProspects = prospects.filter((p) => p.status === "nouveau").length;
  const avgRiskScore = companies.filter((c) => c.riskScore !== null).length
    ? Math.round(
        companies.reduce((sum, c) => sum + (c.riskScore ?? 0), 0) / companies.filter((c) => c.riskScore !== null).length
      )
    : null;

  const recentMissions = [...missions].slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Vue d&apos;ensemble CDF</h1>
        <p className="mt-1 text-sm text-slate-500">Activité de l&apos;ensemble du portefeuille clients.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clients actifs" value={activeClients} icon={Building2} hint={`${companies.length} au total`} />
        <StatCard label="Missions en cours" value={activeMissions} icon={Briefcase} hint={`${completedMissions} clôturées`} />
        <StatCard label="Anomalies ouvertes" value={anomaliesOpen} icon={AlertTriangle} tone={anomaliesOpen > 0 ? "warning" : "positive"} />
        <StatCard label="Anomalies critiques" value={anomaliesCritical} icon={AlertTriangle} tone={anomaliesCritical > 0 ? "critical" : "positive"} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Contrôles ce mois-ci" value={controlsThisMonth} icon={ClipboardCheck} />
        <StatCard label="Nouveaux prospects" value={newProspects} icon={Users} hint={`${prospects.length} au total`} />
        <StatCard label="Risk Score moyen" value={avgRiskScore !== null ? `${avgRiskScore}/100` : "—"} icon={Clock} />
        <StatCard label="Missions au total" value={missions.length} icon={Briefcase} />
      </div>

      <Card className="p-6">
        <SectionHeading title="Missions récentes" />
        {recentMissions.length === 0 ? (
          <div className="mt-4"><EmptyState title="Aucune mission créée" /></div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {recentMissions.map((m) => (
              <Link key={m.id} href={`/admin/missions/${m.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50/60">
                <div>
                  <p className="text-sm font-medium text-navy-950">{m.reference}</p>
                  <p className="text-xs text-slate-500">{formatDate(m.createdAt)}</p>
                </div>
                <MissionStatusBadge status={m.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
