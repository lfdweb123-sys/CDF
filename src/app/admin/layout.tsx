import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isCdfStaff, ROLE_LABELS } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { DashboardShell } from "@/components/dashboard/shell";
import { adminNavItems } from "@/lib/data/nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session || !isCdfStaff(session.role)) {
    redirect("/connexion?next=/admin");
  }

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const userName = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  return (
    <DashboardShell
      navItems={adminNavItems}
      brandLabel="CDF"
      brandSublabel="Back-office CDF"
      userName={userName}
      userRoleLabel={ROLE_LABELS[session.role]}
    >
      {children}
    </DashboardShell>
  );
}
