import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { listNotifications } from "@/lib/queries";
import { NotificationList } from "@/components/dashboard/notification-list";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const session = await getSessionUser();
  const notifications = await listNotifications(session!.uid, session!.companyId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Notifications</h1>
        <p className="mt-1 text-sm text-slate-500">Nouvelles anomalies, rapports disponibles, échéances à venir.</p>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}
