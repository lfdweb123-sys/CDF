import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { Phase2Placeholder } from "@/components/dashboard/phase2-placeholder";

export const metadata: Metadata = { title: "Calendrier" };

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Calendrier</h1>
        <p className="mt-1 text-sm text-slate-500">Vue d&apos;ensemble de vos missions, contrôles et échéances.</p>
      </div>
      <Phase2Placeholder
        icon={Calendar}
        title="Calendrier partagé"
        description="Une vue calendrier unifiée (contrôles, missions, échéances, réunions) arrive en phase 2. Vos contrôles programmés sont d'ores et déjà visibles dans la page Contrôles."
      />
    </div>
  );
}
