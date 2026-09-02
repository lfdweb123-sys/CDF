import type { Metadata } from "next";
import { listCompanies } from "@/lib/queries";
import { createAnomaly } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Déclarer une anomalie" };

export default async function NewAnomalyPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; missionId?: string }>;
}) {
  const { companyId, missionId } = await searchParams;
  const companies = await listCompanies();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Déclarer une anomalie</h1>
        <p className="mt-1 text-sm text-slate-500">
          Utilisez des formulations factuelles : écart, irrégularité constatée, point nécessitant vérification.
          Une anomalie n&apos;est jamais présentée comme une fraude sans preuve établie.
        </p>
      </div>

      <Card className="p-6">
        <form action={createAnomaly} className="space-y-5">
          {missionId && <input type="hidden" name="missionId" value={missionId} />}
          <Field label="Client" htmlFor="companyId">
            <Select id="companyId" name="companyId" required defaultValue={companyId ?? ""}>
              <option value="" disabled>Sélectionnez un client</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Domaine" htmlFor="domain">
              <Input id="domain" name="domain" placeholder="Ex. Caisse, Stocks, Achats..." required />
            </Field>
            <Field label="Niveau de risque" htmlFor="riskLevel">
              <Select id="riskLevel" name="riskLevel" defaultValue="modere">
                <option value="faible">Faible</option>
                <option value="modere">Modéré</option>
                <option value="eleve">Élevé</option>
                <option value="critique">Critique</option>
              </Select>
            </Field>
          </div>
          <Field label="Description" htmlFor="description">
            <Textarea id="description" name="description" rows={3} required />
          </Field>
          <Field label="Constat" htmlFor="observation">
            <Textarea id="observation" name="observation" rows={3} required />
          </Field>
          <Field label="Montant concerné (FCFA)" htmlFor="amountConcerned" hint="Optionnel">
            <Input id="amountConcerned" name="amountConcerned" type="number" min={0} />
          </Field>
          <Button type="submit">Publier l&apos;anomalie</Button>
        </form>
      </Card>
    </div>
  );
}
