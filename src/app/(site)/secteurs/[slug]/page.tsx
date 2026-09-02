import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, Wrench, Target } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { NetworkNodesIllustration } from "@/components/site/illustrations";
import { Button } from "@/components/ui/button";
import { sectors, getSectorBySlug } from "@/lib/data/sectors";
import { solutions } from "@/lib/data/solutions";

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};
  return { title: sector.name, description: sector.frequentProblems.join(" ") };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  const relatedSolutions = solutions.filter((s) => sector.solutions.includes(s.name));

  return (
    <>
      <PageHero
        eyebrow="Secteur"
        title={sector.name}
        description={`Solutions CDF adaptées au secteur ${sector.name.toLowerCase()}.`}
        illustration={<NetworkNodesIllustration />}
      />

      <section className="container-cdf grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <AlertTriangle className="h-4 w-4 text-risk-high" strokeWidth={1.75} />
              Problèmes fréquents
            </h2>
            <ul className="mt-4 space-y-2.5">
              {sector.frequentProblems.map((p) => (
                <li key={p} className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <Wrench className="h-4 w-4 text-navy-700" strokeWidth={1.75} />
              Solutions CDF recommandées
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedSolutions.map((s) => (
                <a
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-navy-900 hover:border-navy-300"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <Target className="h-4 w-4 text-risk-low" strokeWidth={1.75} />
              Exemple de contrôle
            </h2>
            <p className="mt-4 rounded-lg border border-slate-200 bg-navy-50 px-4 py-4 text-sm leading-relaxed text-slate-700">
              {sector.exampleControl}
            </p>
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-navy-800 bg-navy-950 p-6">
            <p className="text-sm font-semibold text-white">Votre secteur, votre priorité</p>
            <p className="mt-2 text-xs leading-relaxed text-navy-200">
              Décrivez votre activité, nous vous proposons un périmètre de mission adapté à votre secteur.
            </p>
            <Button href="/demande-mission" className="mt-4 w-full" size="sm">
              Demander un diagnostic
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
