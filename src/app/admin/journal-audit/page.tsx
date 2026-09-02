import type { Metadata } from "next";
import { listAuditLogs } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Journal d'audit" };

export default async function AuditLogPage() {
  const logs = await listAuditLogs(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Journal d&apos;audit</h1>
        <p className="mt-1 text-sm text-slate-500">
          Qui a fait quoi, quand, et sur quelle donnée. Journal en écriture seule — aucune interface
          d&apos;administration ne permet de le modifier ou de le supprimer.
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState title="Aucun événement enregistré" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Date</Th>
              <Th>Utilisateur</Th>
              <Th>Rôle</Th>
              <Th>Action</Th>
              <Th>Entité</Th>
            </tr>
          </Thead>
          <tbody>
            {logs.map((l) => (
              <Tr key={l.id}>
                <Td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleString("fr-FR")}</Td>
                <Td>{l.actorName}</Td>
                <Td>{l.actorRole}</Td>
                <Td>{l.action}</Td>
                <Td className="font-mono text-xs">{l.entity}/{l.entityId}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
