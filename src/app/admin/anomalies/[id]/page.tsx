import { notFound } from "next/navigation";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { getCompany } from "@/lib/queries";
import { updateAnomalyStatus } from "@/lib/actions/admin";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { StatusSelectForm } from "@/components/dashboard/status-select-form";
import { Button } from "@/components/ui/button";
import { formatDate, formatAmount } from "@/lib/utils";
import type { Anomaly } from "@/types";

const STATUS_OPTIONS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en-analyse", label: "En analyse" },
  { value: "action-requise", label: "Action requise" },
  { value: "en-correction", label: "En correction" },
  { value: "resolu", label: "Résolu" },
  { value: "cloture", label: "Clôturé" },
];

export default async function AdminAnomalyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snap = await adminDb.collection("anomalies").doc(id).get();
  if (!snap.exists) notFound();
  const anomaly = { id: snap.id, ...snap.data() } as Anomaly;
  const company = await getCompany(anomaly.companyId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {company ? <Link href={`/admin/clients/${company.id}`} className="hover:underline">{company.name}</Link> : "—"} — {anomaly.domain}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-navy-950">{anomaly.number}</h1>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={anomaly.riskLevel} />
          <StatusSelectForm
            action={updateAnomalyStatus}
            hiddenFields={{ anomalyId: anomaly.id }}
            name="status"
            defaultValue={anomaly.status}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-navy-950">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{anomaly.description}</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-navy-950">Constat</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{anomaly.observation}</p>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium text-navy-900">{formatDate(anomaly.date)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Montant</dt><dd className="font-medium text-navy-900">{anomaly.amountConcerned ? formatAmount(anomaly.amountConcerned) : "—"}</dd></div>
            </dl>
            <Button href={`/admin/recommandations?companyId=${anomaly.companyId}&anomalyId=${anomaly.id}`} variant="outline" size="sm" className="mt-4 w-full">
              Créer une recommandation
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
