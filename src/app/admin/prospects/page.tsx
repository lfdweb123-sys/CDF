import type { Metadata } from "next";
import { listProspects } from "@/lib/queries";
import { updateProspectStatus } from "@/lib/actions/admin";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusSelectForm } from "@/components/dashboard/status-select-form";
import { formatDate } from "@/lib/utils";

const PROSPECT_STATUS_OPTIONS = [
  { value: "nouveau", label: "Nouveau" },
  { value: "contacte", label: "Contacté" },
  { value: "qualifie", label: "Qualifié" },
  { value: "converti", label: "Converti" },
  { value: "rejete", label: "Rejeté" },
];

export const metadata: Metadata = { title: "Prospects" };

const REQUEST_TYPE_LABEL: Record<string, string> = {
  diagnostic: "Diagnostic",
  investigation: "Investigation",
  "controle-ponctuel": "Contrôle ponctuel",
  "installation-systeme": "Installation d'un système",
  supervision: "Supervision",
  "controle-terrain": "Contrôle terrain",
  autre: "Autre",
};

export default async function ProspectsPage() {
  const prospects = await listProspects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Prospects</h1>
        <p className="mt-1 text-sm text-slate-500">Demandes de mission reçues depuis le site public.</p>
      </div>

      {prospects.length === 0 ? (
        <EmptyState title="Aucune demande reçue" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Entreprise</Th>
              <Th>Type</Th>
              <Th>Contact</Th>
              <Th>Urgence</Th>
              <Th>Reçu le</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {prospects.map((p) => (
              <Tr key={p.id}>
                <Td>
                  <p className="font-medium text-navy-950">{p.companyName}</p>
                  <p className="text-xs text-slate-500">{p.sector}</p>
                </Td>
                <Td>{REQUEST_TYPE_LABEL[p.requestType] ?? p.requestType}</Td>
                <Td>
                  <p>{p.responsibleName}</p>
                  <p className="text-xs text-slate-500">{p.phone} · {p.email}</p>
                </Td>
                <Td><Badge tone={p.urgency === "urgente" ? "accent" : "neutral"} className="capitalize">{p.urgency}</Badge></Td>
                <Td>{formatDate(p.createdAt)}</Td>
                <Td>
                  <StatusSelectForm
                    action={updateProspectStatus}
                    hiddenFields={{ prospectId: p.id }}
                    name="status"
                    defaultValue={p.status}
                    options={PROSPECT_STATUS_OPTIONS}
                  />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
