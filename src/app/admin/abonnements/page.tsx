import type { Metadata } from "next";
import { getPricingPlans } from "@/lib/content";
import { updatePricingPlans } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Abonnements" };

export default async function AdminSubscriptionsPage() {
  const plans = await getPricingPlans();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Abonnements CDF</h1>
        <p className="mt-1 text-sm text-slate-500">
          Les libellés tarifaires affichés côté commercial sont administrables ici — aucune modification de code n&apos;est nécessaire.
        </p>
      </div>

      <Card className="p-6">
        <SectionHeading title="Niveaux d'offre" />
        <form action={updatePricingPlans} className="mt-4 space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-semibold text-navy-950">{plan.name}</p>
              <p className="text-xs text-slate-500">{plan.tagline}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Libellé du prix" htmlFor={`${plan.id}_priceLabel`}>
                  <Input id={`${plan.id}_priceLabel`} name={`${plan.id}_priceLabel`} defaultValue={plan.priceLabel} />
                </Field>
                <Field label="Note de facturation" htmlFor={`${plan.id}_billingNote`}>
                  <Input id={`${plan.id}_billingNote`} name={`${plan.id}_billingNote`} defaultValue={plan.billingNote} />
                </Field>
              </div>
            </div>
          ))}
          <Button type="submit" size="sm">Enregistrer les tarifs</Button>
        </form>
      </Card>
    </div>
  );
}
