import { notFound } from "next/navigation";
import { FileText, Image as ImageIcon } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/badge";
import { AnomalyStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatAmount } from "@/lib/utils";
import type { Anomaly } from "@/types";

export default async function AnomalyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSessionUser();

  const snap = await adminDb.collection("anomalies").doc(id).get();
  if (!snap.exists) notFound();
  const anomaly = { id: snap.id, ...snap.data() } as Anomaly;

  if (anomaly.companyId !== session!.companyId) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Anomalie {anomaly.number}</p>
          <h1 className="mt-1 text-2xl font-semibold text-navy-950">{anomaly.domain}</h1>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={anomaly.riskLevel} />
          <AnomalyStatusBadge status={anomaly.status} />
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
          {anomaly.evidenceUrls.length > 0 && (
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-navy-950">Pièces justificatives</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {anomaly.evidenceUrls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-navy-900 hover:border-navy-300"
                  >
                    {url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                    )}
                    Pièce {i + 1}
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-navy-950">Détails</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Date</dt>
                <dd className="font-medium text-navy-900">{formatDate(anomaly.date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Montant concerné</dt>
                <dd className="font-medium text-navy-900">{anomaly.amountConcerned ? formatAmount(anomaly.amountConcerned) : "—"}</dd>
              </div>
            </dl>
          </Card>
          <div className="rounded-lg border border-accent-100 bg-accent-100/40 p-4 text-xs leading-relaxed text-navy-800">
            Cette anomalie est présentée comme un écart ou une irrégularité constatée. Elle ne peut être
            qualifiée de fraude qu&apos;au terme d&apos;une analyse fondée sur des preuves, selon le cadre
            juridique applicable.
          </div>
        </div>
      </div>
    </div>
  );
}
