import type { Metadata } from "next";
import { listAllRecommendations, listCompanies } from "@/lib/queries";
import { createRecommendation, updateRecommendationProgress } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RecommendationStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Recommandations" };

export default async function AdminRecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; anomalyId?: string }>;
}) {
  const { companyId, anomalyId } = await searchParams;
  const [recommendations, companies] = await Promise.all([listAllRecommendations(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));
  const sorted = [...recommendations].sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Recommandations</h1>
        <p className="mt-1 text-sm text-slate-500">Actions correctives proposées aux clients suite aux anomalies et contrôles.</p>
      </div>

      <Card className="p-6">
        <SectionHeading title="Nouvelle recommandation" />
        <form action={createRecommendation} className="mt-4 space-y-4">
          {anomalyId && <input type="hidden" name="anomalyId" value={anomalyId} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client" htmlFor="companyId">
              <Select id="companyId" name="companyId" required defaultValue={companyId ?? ""}>
                <option value="" disabled>Sélectionnez un client</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Responsable côté client" htmlFor="responsible">
              <Input id="responsible" name="responsible" placeholder="Ex. Directeur financier" required />
            </Field>
          </div>
          <Field label="Problème" htmlFor="problem">
            <Input id="problem" name="problem" placeholder="Ex. Absence de rapprochement quotidien de caisse" required />
          </Field>
          <Field label="Recommandation" htmlFor="action">
            <Textarea id="action" name="action" rows={3} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Priorité" htmlFor="priority">
              <Select id="priority" name="priority" defaultValue="normale">
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
              </Select>
            </Field>
            <Field label="Échéance" htmlFor="dueDate">
              <Input id="dueDate" name="dueDate" type="date" required />
            </Field>
          </div>
          <Button type="submit" size="sm">Créer la recommandation</Button>
        </form>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState title="Aucune recommandation" />
      ) : (
        <div className="space-y-4">
          {sorted.map((r) => (
            <Card key={r.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{companyName.get(r.companyId) ?? "—"} · échéance {formatDate(r.dueDate)}</p>
                  <p className="mt-1 text-sm font-semibold text-navy-950">{r.problem}</p>
                  <p className="mt-1 text-sm text-slate-600">{r.action}</p>
                </div>
                <RecommendationStatusBadge status={r.status} />
              </div>
              <form action={updateRecommendationProgress} className="mt-4 flex items-center gap-3">
                <input type="hidden" name="recommendationId" value={r.id} />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${r.progress}%` }} />
                </div>
                <Input name="progress" type="number" min={0} max={100} defaultValue={r.progress} className="w-20" />
                <Button type="submit" size="sm" variant="outline">Mettre à jour</Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
