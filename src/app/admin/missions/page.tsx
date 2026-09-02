import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllMissions, listCompanies } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { MissionStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Missions" };

export default async function AdminMissionsPage() {
  const [missions, companies] = await Promise.all([listAllMissions(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Missions</h1>
          <p className="mt-1 text-sm text-slate-500">{missions.length} mission(s) au total.</p>
        </div>
        <Button href="/admin/missions/nouvelle" size="sm">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Nouvelle mission
        </Button>
      </div>

      {missions.length === 0 ? (
        <EmptyState title="Aucune mission" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Référence</Th>
              <Th>Client</Th>
              <Th>Type</Th>
              <Th>Consultant</Th>
              <Th>Créée le</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {missions.map((m) => (
              <Tr key={m.id}>
                <Td><Link href={`/admin/missions/${m.id}`} className="font-medium text-navy-900 hover:underline">{m.reference}</Link></Td>
                <Td>{companyName.get(m.companyId) ?? "—"}</Td>
                <Td className="capitalize">{m.type.replace(/-/g, " ")}</Td>
                <Td>{m.consultantName ?? "—"}</Td>
                <Td>{formatDate(m.createdAt)}</Td>
                <Td><MissionStatusBadge status={m.status} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
