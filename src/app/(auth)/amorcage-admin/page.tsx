import type { Metadata } from "next";
import { BootstrapAdminForm } from "@/components/auth/bootstrap-admin-form";

export const metadata: Metadata = { title: "Amorçage administrateur", robots: { index: false, follow: false } };

export default function BootstrapAdminPage() {
  return <BootstrapAdminForm />;
}
