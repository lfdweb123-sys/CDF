import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { Button } from "@/components/ui/button";
import { services, getServiceBySlug } from "@/lib/data/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.name, description: service.summary };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.name}
        description={service.summary}
        illustration={<RadarRingsIllustration icon={service.icon} />}
      />

      <section className="container-cdf grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-navy-950">Le problème que nous adressons</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.problem}</p>

          <h2 className="mt-10 text-lg font-semibold text-navy-950">Fonctionnement</h2>
          <div className="mt-4 space-y-4">
            {service.approach.map((step, i) => (
              <div key={step.title} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy-950">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-lg font-semibold text-navy-950">Livrables</h2>
          <ul className="mt-4 space-y-2.5">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-risk-low" strokeWidth={1.75} />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-navy-50 p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
              <Users className="h-4 w-4" strokeWidth={1.75} />
              Pour qui ?
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {service.forWho.map((w) => (
                <li key={w}>— {w}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-navy-800 bg-navy-950 p-6">
            <p className="text-sm font-semibold text-white">Prêt à démarrer une mission {service.shortName} ?</p>
            <p className="mt-2 text-xs leading-relaxed text-navy-200">
              Décrivez votre besoin, un consultant CDF revient vers vous rapidement.
            </p>
            <Button href="/demande-mission" className="mt-4 w-full" size="sm">
              Demander une mission
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </aside>
      </section>
    </>
  );
}
