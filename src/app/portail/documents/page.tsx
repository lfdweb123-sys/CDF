import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { canWriteClientData } from "@/lib/auth/roles";
import { listDocuments } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "@/components/dashboard/document-upload";
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

export default async function DocumentsPage() {
  const session = await getSessionUser();
  const documents = await listDocuments(session!.companyId!);
  const sorted = [...documents].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Coffre documentaire</h1>
        <p className="mt-1 text-sm text-slate-500">Documents partagés entre votre entreprise et CDF, classés par catégorie.</p>
      </div>

      {canWriteClientData(session!.role) && <DocumentUpload />}

      {sorted.length === 0 ? (
        <EmptyState title="Aucun document" description="Les documents de vos missions et les pièces que vous téléversez apparaîtront ici." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Document</Th>
              <Th>Catégorie</Th>
              <Th>Auteur</Th>
              <Th>Date</Th>
              <Th>Version</Th>
              <Th />
            </tr>
          </Thead>
          <tbody>
            {sorted.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <span className="flex items-center gap-2 font-medium text-navy-950">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
                    {d.name}
                  </span>
                </Td>
                <Td><Badge>{CATEGORY_LABEL[d.category]}</Badge></Td>
                <Td>{d.author}</Td>
                <Td>{formatDate(d.uploadedAt)}</Td>
                <Td>v{d.version}</Td>
                <Td>
                  <a href={d.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:underline">
                    <Download className="h-3.5 w-3.5" strokeWidth={2} />
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
