import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isClientRole, ROLE_LABELS } from "@/lib/auth/roles";
import { adminDb } from "@/lib/firebase/admin";
import { DashboardShell } from "@/components/dashboard/shell";
import { clientNavItems } from "@/lib/data/nav";
import type { Company } from "@/types";

export default async function PortailLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session || !isClientRole(session.role) || !session.companyId) {
    redirect("/connexion?next=/portail");
  }

  const companySnap = await adminDb.collection("companies").doc(session.companyId!).get();
  const company = companySnap.exists ? ({ id: companySnap.id, ...companySnap.data() } as Company) : null;

  const userSnap = await adminDb.collection("users").doc(session.uid).get();
  const userName = (userSnap.data()?.displayName as string | undefined) ?? session.email;

  return (
    <DashboardShell
      navItems={clientNavItems}
      brandLabel={company?.name ?? "Espace client"}
      brandSublabel="Espace client CDF"
      userName={userName}
      userRoleLabel={ROLE_LABELS[session.role]}
    >
      {children}
    </DashboardShell>
  );
}
