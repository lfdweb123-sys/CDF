import { notFound } from "next/navigation";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { getCompany } from "@/lib/queries";
import { updateMissionStatus } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { StatusSelectForm } from "@/components/dashboard/status-select-form";
import { formatDate } from "@/lib/utils";
import type { Mission } from "@/types";

const STATUS_OPTIONS = [
  { value: "prospect", label: "Prospect" },
  { value: "planifiee", label: "Planifiée" },
  { value: "en-cours", label: "En cours" },
  { value: "en-analyse", label: "En analyse" },
  { value: "rapport-preparation", label: "Rapport en préparation" },
  { value: "rapport-livre", label: "Rapport livré" },
  { value: "suivi", label: "Suivi" },
  { value: "cloturee", label: "Clôturée" },
];

export default async function AdminMissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snap = await adminDb.collection("missions").doc(id).get();
  if (!snap.exists) notFound();
  const mission = { id: snap.id, ...snap.data() } as Mission;
  const company = await getCompany(mission.companyId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {company ? <Link href={`/admin/clients/${company.id}`} className="hover:underline">{company.name}</Link> : "—"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-navy-950">{mission.reference}</h1>
        </div>
        <StatusSelectForm
          action={updateMissionStatus}
          hiddenFields={{ missionId: mission.id }}
          name="status"
          defaultValue={mission.status}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <SectionHeading title="Détails de la mission" />
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-500">Type</dt><dd className="mt-0.5 font-medium capitalize text-navy-900">{mission.type.replace(/-/g, " ")}</dd></div>
            <div><dt className="text-slate-500">Consultant</dt><dd className="mt-0.5 font-medium text-navy-900">{mission.consultantName ?? "—"}</dd></div>
            <div><dt className="text-slate-500">Date de début</dt><dd className="mt-0.5 font-medium text-navy-900">{mission.startDate ? formatDate(mission.startDate) : "—"}</dd></div>
            <div><dt className="text-slate-500">Date de fin</dt><dd className="mt-0.5 font-medium text-navy-900">{mission.endDate ? formatDate(mission.endDate) : "—"}</dd></div>
          </dl>
          {mission.objectives && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Objectifs</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{mission.objectives}</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <SectionHeading title="Actions rapides" />
          <div className="mt-4 space-y-2 text-sm">
            <Link href={`/admin/anomalies/nouvelle?missionId=${mission.id}&companyId=${mission.companyId}`} className="block rounded-md border border-slate-200 px-3 py-2 font-medium text-navy-900 hover:border-navy-300">
              Déclarer une anomalie
            </Link>
            <Link href={`/admin/rapports?missionId=${mission.id}&companyId=${mission.companyId}`} className="block rounded-md border border-slate-200 px-3 py-2 font-medium text-navy-900 hover:border-navy-300">
              Publier un rapport
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
