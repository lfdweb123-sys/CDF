import type { Metadata } from "next";
import { adminDb } from "@/lib/firebase/admin";
import { updateContactContent } from "@/lib/actions/admin";
import { Card, SectionHeading } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = { title: "Contenu du site" };

export default async function AdminContentPage() {
  const snap = await adminDb.collection("content").doc("contact").get();
  const contact = snap.exists ? (snap.data() as typeof siteConfig.contact) : siteConfig.contact;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Contenu du site</h1>
        <p className="mt-1 text-sm text-slate-500">Modifiez les coordonnées affichées sur le site public sans intervention technique.</p>
      </div>

      <Card className="p-6">
        <SectionHeading title="Coordonnées de contact" />
        <form action={updateContactContent} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Téléphone" htmlFor="phone"><Input id="phone" name="phone" defaultValue={contact.phone} /></Field>
            <Field label="WhatsApp" htmlFor="whatsapp"><Input id="whatsapp" name="whatsapp" defaultValue={contact.whatsapp} /></Field>
            <Field label="Email" htmlFor="email"><Input id="email" name="email" type="email" defaultValue={contact.email} /></Field>
            <Field label="Adresse" htmlFor="address"><Input id="address" name="address" defaultValue={contact.address} /></Field>
          </div>
          <Button type="submit" size="sm">Enregistrer</Button>
        </form>
      </Card>

      <Card className="p-6">
        <SectionHeading title="Services, secteurs, FAQ et témoignages" />
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Ces contenus sont actuellement gérés dans le code de la plateforme (fichiers de données versionnés) pour
          garantir leur cohérence avec les pages qui les consomment. Une édition complète depuis le back-office —
          sans intervention développeur — fait partie de la phase 2 de la plateforme.
        </p>
      </Card>
    </div>
  );
}
