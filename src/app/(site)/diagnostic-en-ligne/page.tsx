import type { Metadata } from "next";
import { SearchCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { DiagnosticForm } from "@/components/site/diagnostic-form";

export const metadata: Metadata = {
  title: "Diagnostic en ligne — CDF Risk Score™",
  description: "Évaluez gratuitement et en quelques minutes le niveau de risque opérationnel de votre entreprise.",
};

export default function DiagnosticEnLignePage() {
  return (
    <>
      <PageHero
        eyebrow="Diagnostic gratuit"
        title="Évaluez le niveau de risque de votre entreprise"
        description="Répondez à quelques questions pour obtenir votre CDF Risk Score™ indicatif — une première photographie de vos zones de vulnérabilité."
        illustration={<RadarRingsIllustration icon={SearchCheck} />}
      />
      <section className="container-cdf py-16">
        <div className="mx-auto max-w-2xl">
          <DiagnosticForm />
        </div>
      </section>
    </>
  );
}
