import type { Metadata } from "next";
import { ClipboardCheck, Radar, ShieldCheck, Eye, Target, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "À propos",
  description: "CDF est un cabinet spécialisé dans le contrôle opérationnel, la prévention des pertes et la sécurisation des processus.",
};

const pillars = [
  { icon: ClipboardCheck, title: "Contrôle opérationnel", description: "Mise en place de procédures et de points de contrôle adaptés à votre organisation." },
  { icon: ShieldCheck, title: "Prévention des pertes", description: "Identification structurée des zones de vulnérabilité avant qu'elles ne se traduisent en pertes." },
  { icon: Target, title: "Gestion des risques", description: "Mesure et suivi du niveau de risque opérationnel dans la durée." },
  { icon: Radar, title: "Investigation d'anomalies", description: "Analyse factuelle et rigoureuse des irrégularités constatées." },
  { icon: Users, title: "Sécurisation des processus", description: "Conception de mécanismes durables, portés par vos équipes." },
  { icon: Eye, title: "Supervision", description: "Suivi continu des opérations pour mesurer l'évolution réelle du risque." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos de CDF"
        title="Un cabinet de contrôle opérationnel, pas une police privée"
        description="CDF accompagne les dirigeants dans la structuration de leurs processus de contrôle interne — avec méthode, discrétion et rigueur professionnelle."
      />

      <section className="container-cdf py-16">
        <div className="max-w-3xl">
          <SectionHeading title="Notre positionnement" />
          <p className="mt-5 text-sm leading-relaxed text-slate-700">
            CDF est un cabinet spécialisé dans le contrôle opérationnel, la prévention des pertes, la
            gestion des risques, la sécurisation des processus, l&apos;investigation d&apos;anomalies et la
            supervision. Notre travail porte sur les systèmes et les processus de l&apos;entreprise — pas sur
            la surveillance individuelle des collaborateurs.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            CDF ne se présente pas comme un service capable de « détecter tous les voleurs ». Notre rôle
            est d&apos;aider les dirigeants à voir clairement où se situent leurs vulnérabilités
            opérationnelles, puis à mettre en place les mécanismes de contrôle qui réduisent durablement le
            risque de pertes.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white">
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-navy-950">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
