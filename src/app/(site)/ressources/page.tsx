import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { LayersIllustration } from "@/components/site/illustrations";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ressources",
  description: "Guides et articles CDF sur la prévention des pertes, le contrôle interne, la gestion des stocks et des caisses.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Ressources"
        title="Guides et articles pour structurer votre contrôle interne"
        illustration={<LayersIllustration />}
      />
      <section className="container-cdf py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/ressources/${article.slug}`}
              className="group flex flex-col rounded-xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md hover:shadow-navy-900/5"
            >
              <Badge tone="navy" className="w-fit">{article.category}</Badge>
              <h2 className="mt-3 text-base font-semibold text-navy-950">{article.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.excerpt}</p>
              <p className="mt-4 text-xs text-slate-400">{formatDate(article.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
