import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RadarRingsIllustration } from "@/components/site/illustrations";
import { MissionRequestForm } from "@/components/site/mission-request-form";

export const metadata: Metadata = {
  title: "Demande de mission",
  description: "Demandez un diagnostic, une investigation, un contrôle ponctuel ou une supervision continue auprès de CDF.",
};

export default function DemandeMissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Demande de mission"
        title="Décrivez votre besoin, nous revenons vers vous"
        description="Diagnostic, investigation, contrôle ponctuel, installation d'un système, supervision ou contrôle terrain — précisez votre demande."
        illustration={<RadarRingsIllustration icon={Briefcase} />}
      />
      <section className="container-cdf py-16">
        <div className="mx-auto max-w-2xl">
          <Suspense>
            <MissionRequestForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
