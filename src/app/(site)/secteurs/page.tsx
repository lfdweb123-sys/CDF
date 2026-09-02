import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { sectors } from "@/lib/data/sectors";

export const metadata: Metadata = {
  title: "Secteurs d'intervention",
  description: "CDF intervient auprès des restaurants, du commerce, de la distribution, du BTP, du transport et de nombreux autres secteurs.",
};

export default function SectorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Secteurs"
        title="Des solutions adaptées à la réalité de votre secteur"
        description="Chaque secteur présente ses propres zones de risque. Voici comment CDF adapte son approche."
      />
      <section className="container-cdf py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/secteurs/${sector.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md hover:shadow-navy-900/5"
            >
              <h2 className="text-base font-semibold text-navy-950">{sector.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{sector.frequentProblems[0]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:gap-2 transition-all">
                Voir le secteur <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
