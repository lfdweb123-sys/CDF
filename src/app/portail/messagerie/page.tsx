import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { Phase2Placeholder } from "@/components/dashboard/phase2-placeholder";

export const metadata: Metadata = { title: "Messagerie" };

export default function MessagingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Messagerie</h1>
        <p className="mt-1 text-sm text-slate-500">Échangez directement avec votre consultant CDF.</p>
      </div>
      <Phase2Placeholder
        icon={MessageSquare}
        title="Messagerie sécurisée CDF ↔ Client"
        description="La messagerie liée à vos missions, anomalies et rapports arrive en phase 2 de la plateforme. En attendant, utilisez la page Contact ou votre consultant habituel."
      />
    </div>
  );
}
