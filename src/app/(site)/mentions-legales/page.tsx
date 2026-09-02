import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalNoticePage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <section className="container-cdf py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="text-base font-semibold text-navy-950">Éditeur du site</h2>
            <p className="mt-2">
              CDF — Cabinet de Contrôle Opérationnel &amp; Prévention des Pertes. Contact :{" "}
              {siteConfig.contact.email} — {siteConfig.contact.phone} — {siteConfig.contact.address}.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-950">Activité</h2>
            <p className="mt-2">
              CDF exerce une activité de conseil en contrôle opérationnel, prévention des pertes, gestion des
              risques et sécurisation des processus. CDF n&apos;exerce aucune activité de sécurité privée ou de
              surveillance au sens de la réglementation applicable à ces professions.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-950">Hébergement</h2>
            <p className="mt-2">
              La plateforme est hébergée sur une infrastructure cloud (Vercel) et s&apos;appuie sur les services
              Firebase (Google) pour l&apos;authentification, la base de données et le stockage.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-950">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble des contenus de ce site (textes, logo, méthodologies, CDF Risk Score™) est la
              propriété de CDF et ne peut être reproduit sans autorisation préalable.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
