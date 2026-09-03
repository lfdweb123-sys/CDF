import type { Metadata } from "next";
import { listAllControls, listCompanies } from "@/lib/queries";
import { createControl } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Contrôles" };

const RESULT_LABEL: Record<string, string> = { conforme: "Conforme", "non-conforme": "Non conforme", partiel: "Partiel" };

export default async function AdminControlsPage() {
  const [controls, companies] = await Promise.all([listAllControls(), listCompanies()]);
  const companyName = new Map(companies.map((c) => [c.id, c.name]));
  const sorted = [...controls].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Contrôles</h1>
        <p className="mt-1 text-sm text-slate-500">Programmation et suivi des contrôles réalisés par les équipes CDF.</p>
      </div>

      <Card className="p-6">
        <SectionHeading title="Programmer / enregistrer un contrôle" />
        <form action={createControl} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client" htmlFor="companyId">
              <Select id="companyId" name="companyId" required defaultValue="">
                <option value="" disabled>Sélectionnez un client</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Domaine" htmlFor="domain">
              <Input id="domain" name="domain" placeholder="Ex. Caisse, Stocks..." required />
            </Field>
            <Field label="Date" htmlFor="date">
              <Input id="date" name="date" type="date" required />
            </Field>
            <Field label="Statut" htmlFor="status">
              <Select id="status" name="status" defaultValue="programme">
                <option value="programme">Programmé</option>
                <option value="realise">Réalisé</option>
              </Select>
            </Field>
            <Field label="Résultat" htmlFor="result" hint="Si contrôle réalisé">
              <Select id="result" name="result" defaultValue="conforme">
                <option value="conforme">Conforme</option>
                <option value="non-conforme">Non conforme</option>
                <option value="partiel">Partiel</option>
              </Select>
            </Field>
            <Field label="Score (/100)" htmlFor="score" hint="Optionnel">
              <Input id="score" name="score" type="number" min={0} max={100} />
            </Field>
            <Field label="Anomalies détectées" htmlFor="anomaliesDetected" hint="Optionnel">
              <Input id="anomaliesDetected" name="anomaliesDetected" type="number" min={0} defaultValue={0} />
            </Field>
            <Field label="Recommandations émises" htmlFor="recommendations" hint="Optionnel">
              <Input id="recommendations" name="recommendations" type="number" min={0} defaultValue={0} />
            </Field>
          </div>
          <Button type="submit" size="sm">Enregistrer</Button>
        </form>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState title="Aucun contrôle enregistré" />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Date</Th>
              <Th>Client</Th>
              <Th>Domaine</Th>
              <Th>Contrôleur</Th>
              <Th>Résultat</Th>
              <Th>Score</Th>
              <Th>Statut</Th>
            </tr>
          </Thead>
          <tbody>
            {sorted.map((c) => (
              <Tr key={c.id}>
                <Td>{formatDate(c.date)}</Td>
                <Td>{companyName.get(c.companyId) ?? "—"}</Td>
                <Td>{c.domain}</Td>
                <Td>{c.controllerName}</Td>
                <Td><Badge tone={c.result === "conforme" ? "navy" : "accent"}>{RESULT_LABEL[c.result]}</Badge></Td>
                <Td>{c.score !== undefined && c.score !== null ? `${c.score}/100` : "—"}</Td>
                <Td><Badge>{c.status === "realise" ? "Réalisé" : "Programmé"}</Badge></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
