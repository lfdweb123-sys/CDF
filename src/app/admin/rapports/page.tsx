import type { Metadata } from "next";
import { listAllReports, listCompanies } from "@/lib/queries";
import { Card, SectionHeading } from "@/components/ui/card";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminReportUpload } from "@/components/dashboard/admin-report-upload";
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

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const [reports, companies] = await Promise.all([listAllReports(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));
  const sorted = [...reports].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Rapports</h1>
        <p className="mt-1 text-sm text-slate-500">Publiez les rapports de mission pour vos clients.</p>
      </div>

      <Card className="p-6">
        <SectionHeading title="Publier un rapport" />
        <div className="mt-4">
          <AdminReportUpload companies={companies} defaultCompanyId={companyId} />
        </div>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState title="Aucun rapport publié" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Rapport</Th>
              <Th>Client</Th>
              <Th>Type</Th>
              <Th>Publié le</Th>
              <Th>Confidentiel</Th>
            </tr>
          </Thead>
          <tbody>
            {sorted.map((r) => (
              <Tr key={r.id}>
                <Td className="font-medium text-navy-950">{r.title}</Td>
                <Td>{companyName.get(r.companyId) ?? "—"}</Td>
                <Td><Badge tone="navy">{TYPE_LABEL[r.type]}</Badge></Td>
                <Td>{formatDate(r.publishedAt)}</Td>
                <Td>{r.confidential ? <Badge tone="accent">Confidentiel</Badge> : "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
