import type { Metadata } from "next";
import { createCompany } from "@/lib/actions/admin";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sectors } from "@/lib/data/sectors";

export const metadata: Metadata = { title: "Nouveau client" };

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Nouveau client</h1>
        <p className="mt-1 text-sm text-slate-500">Créez la fiche entreprise avant d&apos;y rattacher des utilisateurs et des missions.</p>
      </div>

      <Card className="p-6">
        <form action={createCompany} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom de l'entreprise" htmlFor="name">
              <Input id="name" name="name" required />
            </Field>
            <Field label="Secteur" htmlFor="sector">
              <Select id="sector" name="sector" required defaultValue="">
                <option value="" disabled>Sélectionnez un secteur</option>
                {sectors.map((s) => (
                  <option key={s.slug} value={s.name}>{s.name}</option>
                ))}
                <option value="Autre">Autre</option>
              </Select>
            </Field>
            <Field label="Nom du responsable" htmlFor="responsableName" hint="Optionnel">
              <Input id="responsableName" name="responsableName" />
            </Field>
            <Field label="Email du responsable" htmlFor="responsableEmail" hint="Optionnel">
              <Input id="responsableEmail" name="responsableEmail" type="email" />
            </Field>
            <Field label="Téléphone" htmlFor="responsablePhone" hint="Optionnel">
              <Input id="responsablePhone" name="responsablePhone" type="tel" />
            </Field>
            <Field label="Localisation" htmlFor="location" hint="Optionnel">
              <Input id="location" name="location" />
            </Field>
            <Field label="Nombre d'employés" htmlFor="employeeCount" hint="Optionnel">
              <Input id="employeeCount" name="employeeCount" type="number" min={0} />
            </Field>
          </div>
          <Button type="submit">Créer le client</Button>
        </form>
      </Card>
    </div>
  );
}
