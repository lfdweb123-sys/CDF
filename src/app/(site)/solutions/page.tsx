import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { LayersIllustration } from "@/components/site/illustrations";
import { Badge } from "@/components/ui/badge";
import { solutions } from "@/lib/data/solutions";

export const metadata: Metadata = {
  title: "Solutions par domaine",
  description:
    "Cash Control, Stock Guard, Procurement Control, Restaurant Control et les autres solutions CDF, dédiées à chaque domaine opérationnel.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Une solution dédiée à chaque domaine opérationnel"
        description="Chaque solution CDF cible un domaine précis de votre entreprise, avec ses propres risques, contrôles et indicateurs de suivi."
        illustration={<LayersIllustration />}
      />
      <section className="container-cdf py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md hover:shadow-navy-900/5"
            >
              <Badge tone="navy" className="w-fit">{solution.domain}</Badge>
              <h2 className="mt-3 text-base font-semibold text-navy-950">{solution.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{solution.problem}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:gap-2 transition-all">
                Voir la solution <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
