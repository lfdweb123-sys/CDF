import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { listControls, listRecommendations, listMissions } from "@/lib/queries";
import { MonthCalendar } from "@/components/dashboard/month-calendar";
import type { CalendarEvent } from "@/types";

export const metadata: Metadata = { title: "Calendrier" };

const CONTROL_STATUS_LABEL: Record<string, string> = { programme: "Programmé", realise: "Réalisé" };
const RECO_STATUS_LABEL: Record<string, string> = { "a-faire": "À faire", "en-cours": "En cours", "en-retard": "En retard", terminee: "Terminée" };
const MISSION_TYPE_LABEL: Record<string, string> = {
  diagnostic: "Diagnostic",
  investigation: "Investigation",
  "controle-ponctuel": "Contrôle ponctuel",
  "installation-systeme": "Installation système",
  supervision: "Supervision",
  "controle-terrain": "Contrôle terrain",
  autre: "Mission",
};

export default async function CalendarPage() {
  const session = await getSessionUser();
  const companyId = session!.companyId!;
  const [controls, recommendations, missions] = await Promise.all([
    listControls(companyId),
    listRecommendations(companyId),
    listMissions(companyId),
  ]);

  const events: CalendarEvent[] = [
    ...controls.map((c) => ({
      id: `controle-${c.id}`,
      date: c.date,
      type: "controle" as const,
      title: `Contrôle — ${c.domain}`,
      subtitle: CONTROL_STATUS_LABEL[c.status] ?? c.status,
      status: c.status,
      href: "/portail/controles",
    })),
    ...recommendations.map((r) => ({
      id: `echeance-${r.id}`,
      date: r.dueDate,
      type: "echeance" as const,
      title: r.action,
      subtitle: RECO_STATUS_LABEL[r.status] ?? r.status,
      status: r.status,
      href: "/portail/plan-action",
    })),
    ...missions
      .filter((m) => !!m.startDate)
      .map((m) => ({
        id: `mission-${m.id}`,
        date: m.startDate!,
        type: "mission" as const,
        title: `${MISSION_TYPE_LABEL[m.type] ?? "Mission"} — ${m.reference}`,
        subtitle: m.consultantName ?? "Équipe CDF",
        status: m.status,
      })),
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Calendrier</h1>
        <p className="mt-1 text-sm text-slate-500">Vue d&apos;ensemble de vos missions, contrôles et échéances.</p>
      </div>
      <MonthCalendar events={events} />
    </div>
  );
}
