import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Diagnostic, investigation, anti-leak, contrôle, supervision continue et contrôle terrain — les services CDF pour sécuriser vos opérations.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nos services"
        title="Un service pour chaque étape de votre démarche de contrôle"
        description="Du premier diagnostic à la supervision continue, CDF structure son accompagnement autour de six services complémentaires."
        illustration={<RadarRingsIllustration icon={ClipboardCheck} />}
      />
      <section className="container-cdf py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md hover:shadow-navy-900/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white">
                <service.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h2 className="mt-4 text-base font-semibold text-navy-950">{service.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:gap-2 transition-all">
                Découvrir le service <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
