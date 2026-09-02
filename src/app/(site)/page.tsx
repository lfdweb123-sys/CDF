import Link from "next/link";
import {
  ArrowRight,
  Wallet,
  Package,
  ShoppingCart,
  Users,
  FolderKanban,
  Truck,
  Fuel,
  Smartphone,
  FileCheck,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/card";
import { RadarRingsIllustration, IllustrationPanel, NetworkNodesIllustration } from "@/components/site/illustrations";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { services } from "@/lib/data/services";
import { lossAreas } from "@/lib/data/pricing";
import { siteConfig } from "@/lib/data/site";
import { getContact } from "@/lib/content";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.fullName,
  alternateName: "CDF",
  url: siteConfig.url,
  description: siteConfig.description,
  areaServed: "BJ",
  slogan: siteConfig.tagline,
};

const domainIcons = [Wallet, Package, ShoppingCart, Users, FolderKanban, Truck, Fuel, Smartphone, FileCheck];
const domainLabels = ["Caisse", "Stocks", "Achats", "Personnel", "Projets", "Logistique", "Carburant", "Encaissements", "Procédures"];

export default async function HomePage() {
  const contact = await getContact();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <WhatsAppButton phone={contact.whatsapp} />
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="container-cdf relative py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Vous ne pouvez pas être partout.
                <br />
                Nous vérifions pour vous.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200">
                CDF aide les dirigeants à identifier les failles de leurs opérations, réduire leurs pertes
                et sécuriser leurs processus.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/diagnostic-en-ligne" size="lg">
                  Demander un diagnostic
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Button>
                <Button href="/services" variant="outline" size="lg" className="border-navy-600 bg-transparent text-white hover:bg-navy-900">
                  Découvrir nos solutions
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <RadarRingsIllustration icon={ShieldCheck} />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-3 sm:grid-cols-9">
            {domainLabels.map((label, i) => {
              const Icon = domainIcons[i];
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-navy-800 bg-navy-900/50 px-2 py-4 text-center"
                >
                  <Icon className="h-5 w-5 text-navy-300" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-navy-200">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OÙ PERDEZ-VOUS DE L'ARGENT */}
      <section className="container-cdf py-20">
        <SectionHeading
          eyebrow="Diagnostic des pertes"
          title="Où votre entreprise peut-elle perdre de l'argent ?"
          description="Les pertes opérationnelles se cachent rarement dans un seul domaine. Voici des exemples concrets constatés régulièrement chez nos clients."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lossAreas.map((area) => (
            <div key={area.domain} className="rounded-xl border border-slate-200 p-6 transition-colors hover:border-navy-300">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <TrendingDown className="h-4 w-4 text-risk-high" strokeWidth={1.75} />
                {area.domain}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{area.example}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-navy-50 py-20">
        <div className="container-cdf">
          <SectionHeading
            eyebrow="Nos services"
            title="Un accompagnement structuré, du diagnostic à la supervision continue"
            description="Chaque service répond à un moment précis du parcours de contrôle de votre entreprise."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md hover:shadow-navy-900/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-white">
                  <service.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy-950">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-700 group-hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE MÉTHODE */}
      <section className="container-cdf py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <IllustrationPanel className="order-last lg:order-first">
            <NetworkNodesIllustration size={300} />
          </IllustrationPanel>
          <div>
            <SectionHeading
              eyebrow="Notre méthode"
              title="Une supervision qui couvre tous vos sites, sans multiplier les outils"
              description="Qu'il s'agisse d'un point de vente unique ou d'un réseau multi-sites, CDF centralise le diagnostic, les contrôles et le suivi dans un seul dispositif — pour vous, comme pour vos équipes sur le terrain."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Un point d'entrée unique pour tous vos sites et domaines à risque",
                "Des consultants et contrôleurs formés à vos processus",
                "Un dashboard consolidé, quel que soit le nombre d'entités suivies",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-risk-low" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RISK SCORE TEASER */}
      <section className="container-cdf py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="CDF Risk Score™"
              title="Une mesure claire de votre niveau de risque opérationnel"
              description="En quelques minutes, obtenez une première évaluation indicative de vos vulnérabilités — puis suivez son évolution dans le temps depuis votre dashboard CDF."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Score de 0 à 100 calculé à partir de vos réponses",
                "Quatre niveaux de risque, du faible au critique",
                "Suivi de l'évolution après chaque mission CDF",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-risk-low" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/diagnostic-en-ligne">
                Évaluer mon niveau de risque
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">CDF Risk Score™</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-semibold text-navy-950">54</span>
              <span className="mb-1.5 text-lg text-slate-400">/ 100</span>
            </div>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-risk-moderate-bg px-3 py-1 text-xs font-semibold text-risk-moderate">
              <span className="h-1.5 w-1.5 rounded-full bg-risk-moderate" />
              RISQUE MODÉRÉ
            </span>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[54%] rounded-full bg-navy-700" />
            </div>
            <p className="mt-3 text-xs text-slate-500">↓ 14 points depuis le dernier trimestre</p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-sm">
              <div>
                <p className="text-slate-500">Anomalies ouvertes</p>
                <p className="mt-1 font-semibold text-navy-950">3</p>
              </div>
              <div>
                <p className="text-slate-500">Plan d&apos;action</p>
                <p className="mt-1 font-semibold text-navy-950">72 % terminé</p>
              </div>
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
              Illustration à titre d&apos;exemple. Le résultat du diagnostic en ligne est une première
              évaluation indicative et non un audit officiel.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-navy-950 py-16">
        <div className="container-cdf flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl text-2xl font-semibold text-white sm:text-3xl">
            Parlons de vos opérations et de vos priorités de contrôle.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/demande-mission" size="lg">
              Demander une mission
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="border-navy-600 bg-transparent text-white hover:bg-navy-900">
              Parler à un consultant
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
