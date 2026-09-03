import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { listControls } from "@/lib/queries";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Contrôles" };

const RESULT_LABEL: Record<string, string> = { conforme: "Conforme", "non-conforme": "Non conforme", partiel: "Partiel" };

export default async function ControlsPage() {
  const session = await getSessionUser();
  const controls = await listControls(session!.companyId!);
  const realized = controls.filter((c) => c.status === "realise").sort((a, b) => (a.date < b.date ? 1 : -1));
  const scheduled = controls.filter((c) => c.status === "programme").sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Contrôles</h1>
        <p className="mt-1 text-sm text-slate-500">Contrôles réalisés et programmés par les équipes CDF.</p>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-navy-950">Contrôles programmés</h2>
        {scheduled.length === 0 ? (
          <EmptyState title="Aucun contrôle programmé" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Date</Th>
                <Th>Domaine</Th>
                <Th>Contrôleur</Th>
              </tr>
            </Thead>
            <tbody>
              {scheduled.map((c) => (
                <Tr key={c.id}>
                  <Td>{formatDate(c.date)}</Td>
                  <Td>{c.domain}</Td>
                  <Td>{c.controllerName}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-navy-950">Historique des contrôles réalisés</h2>
        {realized.length === 0 ? (
          <EmptyState title="Aucun contrôle réalisé pour le moment" />
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Date</Th>
                <Th>Domaine</Th>
                <Th>Contrôleur</Th>
                <Th>Résultat</Th>
                <Th>Score</Th>
                <Th>Anomalies</Th>
              </tr>
            </Thead>
            <tbody>
              {realized.map((c) => (
                <Tr key={c.id}>
                  <Td>{formatDate(c.date)}</Td>
                  <Td>{c.domain}</Td>
                  <Td>{c.controllerName}</Td>
                  <Td><Badge tone={c.result === "conforme" ? "navy" : "accent"}>{RESULT_LABEL[c.result]}</Badge></Td>
                  <Td>{c.score !== undefined ? `${c.score}/100` : "—"}</Td>
                  <Td>{c.anomaliesDetected}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
