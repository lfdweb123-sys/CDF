import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, ChevronRight } from "lucide-react";
import { listMessageThreads, listCompanies } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Messagerie" };

export default async function AdminMessagingPage() {
  const [threads, companies] = await Promise.all([listMessageThreads(), listCompanies()]);
  const threadCompanyIds = new Set(threads.map((t) => t.companyId));
  const withoutThread = companies.filter((c) => !threadCompanyIds.has(c.id));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Messagerie</h1>
        <p className="mt-1 text-sm text-slate-500">Échanges directs avec vos clients, par entreprise.</p>
      </div>

      {threads.length === 0 && withoutThread.length === 0 ? (
        <EmptyState title="Aucun client" description="Créez une entreprise cliente pour pouvoir échanger avec elle." />
      ) : (
        <Card className="divide-y divide-slate-100">
          {threads.map((t) => (
            <Link
              key={t.companyId}
              href={`/admin/messagerie/${t.companyId}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-navy-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-navy-950">{t.companyName}</p>
                  {t.lastMessage && <p className="shrink-0 text-xs text-slate-500">{formatDateTime(t.lastMessage.createdAt)}</p>}
                </div>
                {t.lastMessage && (
                  <p className="mt-0.5 truncate text-sm text-slate-500">
                    <span className="font-medium text-slate-600">{t.lastMessage.authorName} :</span> {t.lastMessage.text}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
            </Link>
          ))}
          {withoutThread.map((c) => (
            <Link key={c.id} href={`/admin/messagerie/${c.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-navy-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <MessageSquare className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy-950">{c.name}</p>
                <p className="mt-0.5 text-sm text-slate-400">Aucun message échangé.</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={1.75} />
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
