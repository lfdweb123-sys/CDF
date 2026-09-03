import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { listRecommendations } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { RecommendationStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Recommandations" };

export default async function RecommendationsPage() {
  const session = await getSessionUser();
  const recommendations = await listRecommendations(session!.companyId!);
  const sorted = [...recommendations].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Recommandations</h1>
        <p className="mt-1 text-sm text-slate-500">Actions correctives proposées par CDF suite aux anomalies et contrôles réalisés.</p>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Aucune recommandation en cours" />
      ) : (
        <div className="space-y-4">
          {sorted.map((r) => (
            <Card key={r.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Problème</p>
                  <p className="mt-1 text-sm font-semibold text-navy-950">{r.problem}</p>
                </div>
                <RecommendationStatusBadge status={r.status} />
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Recommandation</p>
                <p className="mt-1 text-sm text-slate-700">{r.action}</p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Responsable</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-900">{r.responsible}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Échéance</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-900">{formatDate(r.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priorité</p>
                  <p className="mt-0.5 text-sm font-medium capitalize text-navy-900">{r.priority}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Progression</span>
                  <span>{r.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${r.progress}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
