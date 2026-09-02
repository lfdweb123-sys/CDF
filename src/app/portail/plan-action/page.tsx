import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { canWriteClientData } from "@/lib/auth/roles";
import { listRecommendations } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { RecommendationStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/table";
import { RecommendationComments } from "@/components/dashboard/recommendation-comments";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Plan d'action" };

export default async function ActionPlanPage() {
  const session = await getSessionUser();
  const recommendations = await listRecommendations(session!.companyId!);
  const sorted = [...recommendations].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  const canWrite = canWriteClientData(session!.role);

  const overallProgress = sorted.length
    ? Math.round(sorted.reduce((sum, r) => sum + r.progress, 0) / sorted.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Plan d&apos;action CDF</h1>
          <p className="mt-1 text-sm text-slate-500">Suivi de la mise en œuvre des recommandations CDF.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Avancement global</p>
          <p className="text-xl font-semibold text-navy-950">{overallProgress}%</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Aucune action en cours" />
      ) : (
        <div className="space-y-4">
          {sorted.map((r) => (
            <Card key={r.id} className="p-6">
              <div className="grid gap-4 lg:grid-cols-6 lg:items-center">
                <div className="lg:col-span-2">
                  <p className="text-xs text-slate-500">Problème / Action</p>
                  <p className="mt-0.5 text-sm font-medium text-navy-950">{r.problem}</p>
                  <p className="mt-1 text-xs text-slate-600">{r.action}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Responsable</p>
                  <p className="mt-0.5 text-sm text-navy-900">{r.responsible}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Priorité</p>
                  <p className="mt-0.5 text-sm capitalize text-navy-900">{r.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Échéance</p>
                  <p className="mt-0.5 text-sm text-navy-900">{formatDate(r.dueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Statut</p>
                  <div className="mt-1"><RecommendationStatusBadge status={r.status} /></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${r.progress}%` }} />
                </div>
              </div>
              <RecommendationComments recommendationId={r.id} initialComments={r.comments ?? []} canWrite={canWrite} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
