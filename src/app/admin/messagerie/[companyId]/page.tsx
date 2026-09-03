import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getCompany, listMessages } from "@/lib/queries";
import { MessageThread } from "@/components/dashboard/message-thread";

export const metadata: Metadata = { title: "Messagerie" };

export default async function AdminMessageThreadPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const [session, company, messages] = await Promise.all([getSessionUser(), getCompany(companyId), listMessages(companyId)]);
  if (!company) notFound();

  const sorted = [...messages].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/messagerie" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-900">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Toute la messagerie
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-navy-950">{company.name}</h1>
      </div>
      <MessageThread
        initialMessages={sorted}
        currentUserId={session!.uid}
        postUrl="/api/admin/messagerie"
        extraFields={{ companyId }}
        emptyLabel="Aucun message échangé avec ce client pour le moment."
        placeholder="Répondre au client..."
      />
    </div>
  );
}
