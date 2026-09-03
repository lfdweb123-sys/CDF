import type { Metadata } from "next";
import { getSessionUser, getFullSessionUser } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { Card } from "@/components/ui/card";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Paramètres" };

export default async function AdminSettingsPage() {
  const session = await getSessionUser();
  const user = await getFullSessionUser();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Paramètres</h1>
        <p className="mt-1 text-sm text-slate-500">Gérez votre profil et la sécurité de votre compte CDF.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-navy-950">Profil</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Nom</dt>
            <dd className="font-medium text-navy-900">{user?.displayName ?? "—"}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-navy-900">{session!.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Rôle</dt>
            <dd className="font-medium text-navy-900">{ROLE_LABELS[session!.role]}</dd>
          </div>
        </dl>
      </Card>

      <SettingsForm email={session!.email} twoFactorEnabled={user?.twoFactorEnabled ?? false} />
    </div>
  );
}
