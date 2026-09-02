import type { Metadata } from "next";
import { listCompanies } from "@/lib/queries";
import { createMission } from "@/lib/actions/admin";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Nouvelle mission" };

const MISSION_TYPES = [
  { value: "diagnostic", label: "Diagnostic" },
  { value: "investigation", label: "Investigation" },
  { value: "controle-ponctuel", label: "Contrôle ponctuel" },
  { value: "installation-systeme", label: "Installation d'un système" },
  { value: "supervision", label: "Supervision" },
  { value: "controle-terrain", label: "Contrôle terrain" },
  { value: "autre", label: "Autre" },
];

export default async function NewMissionPage() {
  const companies = await listCompanies();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Nouvelle mission</h1>
        <p className="mt-1 text-sm text-slate-500">La référence CDF-{new Date().getFullYear()}-XXXX est générée automatiquement.</p>
      </div>

      <Card className="p-6">
        <form action={createMission} className="space-y-5">
          <Field label="Client" htmlFor="companyId">
            <Select id="companyId" name="companyId" required defaultValue="">
              <option value="" disabled>Sélectionnez un client</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Type de mission" htmlFor="type">
            <Select id="type" name="type" defaultValue="diagnostic">
              {MISSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date de début" htmlFor="startDate" hint="Optionnel">
              <Input id="startDate" name="startDate" type="date" />
            </Field>
            <Field label="Date de fin" htmlFor="endDate" hint="Optionnel">
              <Input id="endDate" name="endDate" type="date" />
            </Field>
          </div>
          <Field label="Objectifs de la mission" htmlFor="objectives" hint="Optionnel">
            <Textarea id="objectives" name="objectives" rows={4} />
          </Field>
          <Button type="submit">Créer la mission</Button>
        </form>
      </Card>
    </div>
  );
}
