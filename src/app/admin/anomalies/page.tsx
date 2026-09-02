import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllAnomalies, listCompanies } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { RiskBadge } from "@/components/ui/badge";
import { AnomalyStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Anomalies" };

export default async function AdminAnomaliesPage() {
  const [anomalies, companies] = await Promise.all([listAllAnomalies(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Anomalies</h1>
          <p className="mt-1 text-sm text-slate-500">Écarts et irrégularités constatés, tous clients confondus.</p>
        </div>
        <Button href="/admin/anomalies/nouvelle" size="sm">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Déclarer une anomalie
        </Button>
      </div>

      {anomalies.length === 0 ? (
        <EmptyState title="Aucune anomalie" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>N°</Th>
              <Th>Client</Th>
              <Th>Domaine</Th>
              <Th>Risque</Th>
              <Th>Date</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {anomalies.map((a) => (
              <Tr key={a.id}>
                <Td><Link href={`/admin/anomalies/${a.id}`} className="font-medium text-navy-900 hover:underline">{a.number}</Link></Td>
                <Td>{companyName.get(a.companyId) ?? "—"}</Td>
                <Td>{a.domain}</Td>
                <Td><RiskBadge level={a.riskLevel} /></Td>
                <Td>{formatDate(a.date)}</Td>
                <Td><AnomalyStatusBadge status={a.status} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
