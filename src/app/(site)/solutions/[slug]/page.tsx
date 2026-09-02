import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, AlertTriangle, ClipboardList, LineChart, PackageCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { solutions, getSolutionBySlug } from "@/lib/data/solutions";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};
  return { title: solution.name, description: solution.problem };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  return (
    <>
      <PageHero eyebrow={solution.domain} title={solution.name} description={solution.problem} />

      <section className="container-cdf grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <AlertTriangle className="h-4 w-4 text-risk-high" strokeWidth={1.75} />
              Risques identifiés
            </h2>
            <ul className="mt-4 space-y-2.5">
              {solution.risks.map((r) => (
                <li key={r} className="rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <ClipboardList className="h-4 w-4 text-navy-700" strokeWidth={1.75} />
              Fonctionnement
            </h2>
            <ul className="mt-4 space-y-2.5">
              {solution.howItWorks.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-800">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <PackageCheck className="h-4 w-4 text-risk-low" strokeWidth={1.75} />
              Contrôles réalisés
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {solution.controls.map((c) => (
                <Badge key={c} tone="neutral">{c}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-950">
              <LineChart className="h-4 w-4 text-accent-600" strokeWidth={1.75} />
              Indicateurs suivis
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {solution.indicators.map((c) => (
                <Badge key={c} tone="accent">{c}</Badge>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-navy-50 p-6">
            <h3 className="text-sm font-semibold text-navy-950">Livrables</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {solution.deliverables.map((d) => (
                <li key={d}>— {d}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-950 p-6">
            <p className="text-sm font-semibold text-white">Demander un devis {solution.name}</p>
            <p className="mt-2 text-xs leading-relaxed text-navy-200">
              Recevez une proposition adaptée à la taille et au périmètre de votre entreprise.
            </p>
            <Button href={`/demande-mission?solution=${solution.slug}`} className="mt-4 w-full" size="sm">
              Demander un devis
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
