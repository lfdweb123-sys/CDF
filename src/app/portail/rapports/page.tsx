import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { listReports } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Rapports" };

const TYPE_LABEL: Record<string, string> = {
  diagnostic: "Diagnostic",
  mensuel: "Mensuel",
  controle: "Contrôle",
  investigation: "Investigation",
  terrain: "Terrain",
  suivi: "Suivi",
};

export default async function ReportsPage() {
  const session = await getSessionUser();
  const reports = await listReports(session!.companyId!);
  // Confidential reports are only visible to CLIENT_ADMIN / CLIENT_MANAGER (not CLIENT_VIEWER).
  const visibleReports = reports.filter((r) => !r.confidential || session!.role !== "CLIENT_VIEWER");
  const sorted = [...visibleReports].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Rapports</h1>
        <p className="mt-1 text-sm text-slate-500">Rapports publiés par CDF pour votre entreprise.</p>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Aucun rapport publié" description="Vos rapports de diagnostic, de contrôle et de suivi apparaîtront ici." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Rapport</Th>
              <Th>Type</Th>
              <Th>Date de publication</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {sorted.map((r) => (
              <Tr key={r.id}>
                <Td>
                  <span className="flex items-center gap-2 font-medium text-navy-950">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                    {r.title}
                  </span>
                </Td>
                <Td><Badge tone="navy">{TYPE_LABEL[r.type]}</Badge></Td>
                <Td>{formatDate(r.publishedAt)}</Td>
                <Td>
                  <a href={r.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:underline">
                    <Download className="h-3.5 w-3.5" strokeWidth={2} />
                    Télécharger
                  </a>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
