import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { faqItems } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur les interventions de CDF, la confidentialité et le cadre juridique applicable.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Questions fréquentes"
        title="Ce que vous devez savoir avant de nous contacter"
        illustration={<RadarRingsIllustration icon={HelpCircle} />}
      />
      <section className="container-cdf py-16">
        <div className="mx-auto max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-navy-950">
                {item.question}
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
