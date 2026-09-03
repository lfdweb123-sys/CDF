import type { Metadata } from "next";
import { listAllDocuments, listCompanies } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminDocumentUpload } from "@/components/dashboard/admin-document-upload";
import { formatDate } from "@/lib/utils";
import type { DocumentCategory } from "@/types";

export const metadata: Metadata = { title: "Documents" };

const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  rapports: "Rapports",
  contrats: "Contrats",
  procedures: "Procédures",
  justificatifs: "Justificatifs",
  photos: "Photos",
  factures: "Factures",
  controle: "Documents de contrôle",
};

export default async function AdminDocumentsPage() {
  const [documents, companies] = await Promise.all([listAllDocuments(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));
  const sorted = [...documents].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Documents</h1>
        <p className="mt-1 text-sm text-slate-500">Coffres documentaires de l&apos;ensemble des clients.</p>
      </div>

      <AdminDocumentUpload companies={companies} />

      {sorted.length === 0 ? (
        <EmptyState title="Aucun document" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Document</Th>
              <Th>Client</Th>
              <Th>Catégorie</Th>
              <Th>Auteur</Th>
              <Th>Date</Th>
            </tr>
          </Thead>
          <tbody>
            {sorted.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" className="font-medium text-navy-900 hover:underline">{d.name}</a>
                </Td>
                <Td>{companyName.get(d.companyId) ?? "—"}</Td>
                <Td><Badge>{CATEGORY_LABEL[d.category]}</Badge></Td>
                <Td>{d.author}</Td>
                <Td>{formatDate(d.uploadedAt)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
