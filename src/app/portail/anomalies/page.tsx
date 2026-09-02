import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { listAnomalies } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { RiskBadge } from "@/components/ui/badge";
import { AnomalyStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatAmount } from "@/lib/utils";

export const metadata: Metadata = { title: "Anomalies" };

export default async function AnomaliesPage() {
  const session = await getSessionUser();
  const anomalies = await listAnomalies(session!.companyId!);
  const sorted = [...anomalies].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Anomalies</h1>
        <p className="mt-1 text-sm text-slate-500">
          Écarts et irrégularités constatées lors des missions et contrôles CDF. Une anomalie n&apos;est
          jamais qualifiée de fraude sans preuve établie.
        </p>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Aucune anomalie enregistrée" description="Les anomalies identifiées lors de vos missions CDF apparaîtront ici." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>N°</Th>
              <Th>Date</Th>
              <Th>Domaine</Th>
              <Th>Risque</Th>
              <Th>Montant concerné</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {sorted.map((a) => (
              <Tr key={a.id}>
                <Td>
                  <Link href={`/portail/anomalies/${a.id}`} className="font-medium text-navy-900 hover:underline">
                    {a.number}
                  </Link>
                </Td>
                <Td>{formatDate(a.date)}</Td>
                <Td>{a.domain}</Td>
                <Td><RiskBadge level={a.riskLevel} /></Td>
                <Td>{a.amountConcerned ? formatAmount(a.amountConcerned) : "—"}</Td>
                <Td><AnomalyStatusBadge status={a.status} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
