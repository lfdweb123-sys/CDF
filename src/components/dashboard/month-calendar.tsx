"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ClipboardCheck, Briefcase, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const DAY_LABEL = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const TYPE_META: Record<CalendarEvent["type"], { icon: typeof ClipboardCheck; dot: string; label: string }> = {
  controle: { icon: ClipboardCheck, dot: "bg-navy-600", label: "Contrôle" },
  mission: { icon: Briefcase, dot: "bg-accent-500", label: "Mission" },
  echeance: { icon: ListChecks, dot: "bg-risk-moderate", label: "Échéance" },
};

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function isoToday(): string {
  return dateKey(new Date().toISOString());
}

export function MonthCalendar({ events }: { events: CalendarEvent[] }) {
  const today = isoToday();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = dateKey(ev.date);
      const list = map.get(key) ?? [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNumber = i - startOffset + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) return null;
      const date = new Date(year, month, dayNumber);
      const key = dateKey(date.toISOString());
      return { key, dayNumber, dayEvents: eventsByDay.get(key) ?? [] };
    });
  }, [cursor, eventsByDay]);

  const upcoming = useMemo(
    () => [...events].filter((e) => dateKey(e.date) >= today).sort((a, b) => (a.date > b.date ? 1 : -1)).slice(0, 8),
    [events, today]
  );
  const overdue = useMemo(
    () => events.filter((e) => e.type === "echeance" && dateKey(e.date) < today && e.status !== "terminee"),
    [events, today]
  );

  const agendaDate = selected;
  const agendaEvents = agendaDate ? (eventsByDay.get(agendaDate) ?? []) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold capitalize text-navy-950">{MONTH_LABEL.format(cursor)}</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
              className="rounded-md p-1.5 text-slate-500 hover:bg-navy-50 hover:text-navy-900"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
                setSelected(null);
              }}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-navy-50 hover:text-navy-900"
            >
              Aujourd&apos;hui
            </button>
            <button
              type="button"
              onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
              className="rounded-md p-1.5 text-slate-500 hover:bg-navy-50 hover:text-navy-900"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, i) =>
            cell === null ? (
              <div key={i} />
            ) : (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelected((s) => (s === cell.key ? null : cell.key))}
                className={cn(
                  "flex min-h-[3.25rem] flex-col items-center gap-1 rounded-md border p-1.5 text-sm transition-colors sm:min-h-[4rem]",
                  cell.key === today ? "border-navy-300 bg-navy-50" : "border-transparent hover:bg-slate-50",
                  cell.key === selected && "border-navy-900 bg-navy-900/5"
                )}
              >
                <span className={cn("text-slate-700", cell.key === today && "font-semibold text-navy-900")}>{cell.dayNumber}</span>
                {cell.dayEvents.length > 0 && (
                  <span className="flex gap-0.5">
                    {Array.from(new Set(cell.dayEvents.map((e) => e.type)))
                      .slice(0, 3)
                      .map((type) => (
                        <span key={type} className={cn("h-1.5 w-1.5 rounded-full", TYPE_META[type].dot)} />
                      ))}
                  </span>
                )}
              </button>
            )
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {(Object.keys(TYPE_META) as CalendarEvent["type"][]).map((type) => (
            <span key={type} className="flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", TYPE_META[type].dot)} />
              {TYPE_META[type].label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {overdue.length > 0 && (
          <div className="rounded-xl border border-risk-critical-bg bg-risk-critical-bg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-risk-critical">Échéances en retard</p>
            <ul className="mt-2 space-y-2">
              {overdue.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {agendaDate ? DAY_LABEL.format(new Date(agendaDate)) : "Prochaines échéances"}
          </p>
          <ul className="mt-3 space-y-2.5">
            {(agendaEvents ?? upcoming).length === 0 && <li className="text-sm text-slate-400">Rien de prévu.</li>}
            {(agendaEvents ?? upcoming).map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
          {agendaDate && (
            <button type="button" onClick={() => setSelected(null)} className="mt-3 text-xs font-medium text-navy-700 hover:underline">
              Voir les prochaines échéances
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: CalendarEvent }) {
  const meta = TYPE_META[event.type];
  const Icon = meta.icon;
  const content = (
    <>
      <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white", meta.dot)}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-navy-950">{event.title}</span>
        <span className="block text-xs text-slate-500">{DAY_LABEL.format(new Date(event.date))} · {event.subtitle}</span>
      </span>
    </>
  );
  return (
    <li>
      {event.href ? (
        <Link href={event.href} className="flex items-start gap-2.5 rounded-md p-1.5 -m-1.5 hover:bg-slate-50">
          {content}
        </Link>
      ) : (
        <div className="flex items-start gap-2.5">{content}</div>
      )}
    </li>
  );
}
