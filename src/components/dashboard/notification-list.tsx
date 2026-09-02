"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Bell, Check } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Notification } from "@/types";

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [localRead, setLocalRead] = useState<Record<string, boolean>>({});

  async function markRead(id: string) {
    setLocalRead((prev) => ({ ...prev, [id]: true }));
    await fetch(`/api/portail/notifications/${id}/lue`, { method: "PATCH" });
    startTransition(() => router.refresh());
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
        <Bell className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-navy-950">Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {notifications.map((n) => {
        const isRead = n.read || localRead[n.id];
        return (
          <div key={n.id} className={cn("flex items-start justify-between gap-4 px-5 py-4", !isRead && "bg-navy-50/50")}>
            <div>
              <p className="text-sm font-medium text-navy-950">{n.title}</p>
              <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              <p className="mt-1.5 text-xs text-slate-400">{formatDate(n.createdAt)}</p>
            </div>
            {!isRead && (
              <button
                type="button"
                disabled={pending}
                onClick={() => markRead(n.id)}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-50"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                Marquer lu
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
