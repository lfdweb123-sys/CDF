import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listCompanies } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scoreBand } from "@/lib/utils";

export const metadata: Metadata = { title: "Clients" };

const STATUS_LABEL: Record<string, string> = { actif: "Actif", suspendu: "Suspendu", prospect: "Prospect" };

export default async function AdminClientsPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">{companies.length} entreprise(s) enregistrée(s).</p>
        </div>
        <Button href="/admin/clients/nouveau" size="sm">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Nouveau client
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyState title="Aucun client" description="Créez votre premier client pour commencer à suivre ses missions et anomalies." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Entreprise</Th>
              <Th>Secteur</Th>
              <Th>Risk Score</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {companies.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <Link href={`/admin/clients/${c.id}`} className="font-medium text-navy-900 hover:underline">
                    {c.name}
                  </Link>
                </Td>
                <Td>{c.sector}</Td>
                <Td>{c.riskScore !== null ? `${c.riskScore}/100 — ${scoreBand(c.riskScore).label}` : "—"}</Td>
                <Td><Badge tone={c.status === "actif" ? "navy" : "neutral"}>{STATUS_LABEL[c.status]}</Badge></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
