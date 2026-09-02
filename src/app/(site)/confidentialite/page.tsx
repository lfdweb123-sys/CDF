import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Protection des données" title="Politique de confidentialité" />
      <section className="container-cdf py-16">
        <div className="prose-cdf mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-slate-700">
          <p>
            CDF traite les données personnelles et professionnelles qui lui sont confiées dans le cadre de
            ses missions de contrôle opérationnel, de prévention des pertes et de diagnostic, en tenant
            compte de la réglementation béninoise applicable en matière de protection des données à
            caractère personnel.
          </p>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Données collectées</h2>
            <p className="mt-2">
              CDF collecte uniquement les données nécessaires à la réalisation de ses missions : identité et
              coordonnées des responsables d&apos;entreprise, informations opérationnelles transmises dans le
              cadre d&apos;un diagnostic ou d&apos;une mission, et données de connexion à l&apos;espace client.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Minimisation et finalité</h2>
            <p className="mt-2">
              Chaque donnée collectée répond à une finalité précise, liée à l&apos;exécution d&apos;une mission ou
              à la gestion de l&apos;espace client. Aucune donnée n&apos;est collectée ou conservée au-delà de ce
              qui est nécessaire.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Isolation des données par entreprise</h2>
            <p className="mt-2">
              Les données de chaque entreprise cliente sont isolées de celles des autres clients. Aucun
              utilisateur d&apos;une entreprise ne peut accéder aux données d&apos;une autre entreprise.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Durée de conservation</h2>
            <p className="mt-2">
              Les durées de conservation sont définies par domaine de donnée et peuvent être configurées
              contractuellement avec chaque client. À l&apos;issue de cette durée, les données sont archivées
              ou supprimées selon les modalités convenues.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Droits des utilisateurs</h2>
            <p className="mt-2">
              Toute personne concernée peut demander l&apos;accès, la rectification ou la suppression de ses
              données dans les conditions prévues par la réglementation applicable, en écrivant à
              contact@cdf-controle.com.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-navy-950">Dispositifs sensibles</h2>
            <p className="mt-2">
              Toute fonctionnalité impliquant la vidéosurveillance, la biométrie, la géolocalisation ou la
              surveillance des salariés fait l&apos;objet d&apos;une validation juridique préalable et respecte les
              obligations réglementaires applicables avant toute mise en œuvre.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
